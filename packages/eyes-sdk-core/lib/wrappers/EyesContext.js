const TypeUtils = require('../utils/TypeUtils')
const Location = require('../geometry/Location')
const Region = require('../geometry/Region')
const EyesUtils = require('../EyesUtils')
const EyesElement = require('./EyesElement')

class EyesContext {
  static specialize(spec) {
    return class SpecializedContext extends EyesContext {
      static get spec() {
        return spec
      }
      get spec() {
        return spec
      }
    }
  }

  static isReference(reference) {
    return (
      reference instanceof EyesContext ||
      TypeUtils.isInteger(reference) ||
      TypeUtils.isString(reference) ||
      this.isSelector(reference) ||
      this.isElement(reference)
    )
  }

  static isElement(element) {
    return element instanceof EyesElement || this.spec.isElement(element)
  }

  static isSelector(selector) {
    return this.spec.isSelector(selector)
  }

  constructor(logger, context, options) {
    this._logger = logger
    this._context = context

    if (!options || (!options.reference && !options.element)) {
      // main context
      this._element = null
      this._parent = null
      this._scrollRootElement = options && options.scrollRootElement
      this._driver = options && options.driver
      this._rect = Region.EMPTY
      this._clientRect = Region.EMPTY
    } else if (this.constructor.isReference(options.reference)) {
      // child context
      if (options.reference instanceof EyesContext) {
        return options.reference
      }
      if (!options.parent) {
        throw new Error('Cannot construct child context without reference to the parent')
      }
      this._reference = options.reference
      this._parent = options.parent
      this._scrollRootElement = options.scrollRootElement
      this._driver = options.driver || this._parent.driver
    } else {
      throw new TypeError('EyesContext constructor called with argument of unknown type!')
    }
  }

  get unwrapped() {
    return this._context
  }

  get driver() {
    return this._driver
  }

  get parent() {
    return this._parent
  }

  get main() {
    return this._parent ? this._parent.main : this
  }

  get path() {
    return [...(this._parent ? this._parent.path : []), this]
  }

  get isMain() {
    return this.main === this
  }

  get isCurrent() {
    return !this.isDetached && this._driver.currentContext === this
  }

  get isDetached() {
    return !this._driver
  }

  get isInitialized() {
    return Boolean(this._element) || this.isMain
  }

  get isRef() {
    return !this._context
  }

  attach(context) {
    // TODO fix bug with check settings
    // if (!context.isDetached) {
    //   throw new Error('Context need to be detached before attach')
    // }
    const [main, ...path] = context.path
    if (main._scrollRootElement) {
      this._scrollRootElement = main._scrollRootElement
    }
    main._element = this._element
    main._context = this._context
    main._driver = this._driver
    main._logger = this._logger
    main._parent = this._parent
    if (path.length > 0) {
      path[0]._parent = this
      path.forEach(context => {
        context._driver = this._driver
        context._logger = this._logger
      })
      return context
    } else {
      return this
    }
  }

  context(reference) {
    const context =
      reference instanceof EyesContext
        ? reference
        : new this.constructor(this._logger, null, {reference, driver: this._driver, parent: this})

    if (context.parent !== this) {
      throw Error(`Couldn't find a child context because it has a different parent`)
    }
    return context
  }

  element(selector) {
    if (this.constructor.isElement(selector)) {
      return this.spec.newElement(this._logger, this, {element: selector})
    } else if (this.isDetached) {
      return this.spec.newElement(null, this, {selector})
    }
    return this.focus().then(async () => {
      const element = await this.spec.findElement(this._context, selector)
      return element ? this.spec.newElement(this._logger, this, {element, selector}) : null
    })
  }

  elements(selector) {
    return this.focus().then(async () => {
      const elements = await this.spec.findElements(this._context, selector)
      return elements.map(element => this.spec.newElement(this._logger, this, {element, selector}))
    })
  }

  async equals(context) {
    if (context === this || (this.isMain && context === null)) return true
    if (!this._element) return false
    return this._element.equals(
      context instanceof EyesContext ? await context.getFrameElement() : context,
    )
  }

  async init() {
    if (this.isDetached) {
      throw new Error('Cannot initialize detached context')
    } else if (this.isInitialized) {
      return this
    }

    await this._parent.focus()

    if (this._reference && !this._element) {
      this._logger.verbose(`Context initialization from reference - ${this._reference}`)

      if (TypeUtils.isInteger(this._reference)) {
        this._logger.verbose('Getting frames list...')
        const elements = await this._parent.elements('frame, iframe')
        if (this._reference > elements.length) {
          throw new TypeError(`Frame index [${this._reference}] is invalid!`)
        }
        this._element = elements[this._reference]
      } else if (TypeUtils.isString(this._reference) || this.spec.isSelector(this._reference)) {
        this._logger.verbose('Getting frames by name or id or selector...')
        if (TypeUtils.isString(this._reference)) {
          this._element = await this._parent
            .element(`iframe[name="${this._reference}"], iframe#${this._reference}`)
            .catch(() => null)
        }
        if (!this._element && this.spec.isSelector(this._reference)) {
          this._element = await this._parent.element(this._reference)
        }
        if (!this._element) {
          throw new TypeError(`No frame with selector, name or id '${this._reference}' exists!`)
        }
      } else if (this.constructor.isElement(this._reference)) {
        this._element = this.spec.newElement(this._logger, this._parent, {element: this._reference})
      } else {
        throw new TypeError('Reference type does not supported!')
      }
      this._reference = null
      this._logger.verbose('Done! getting the specific frame...')
    }

    return this
  }

  async focus() {
    if (this.isDetached) {
      throw new Error('Cannot focus on the detached context')
    } else if (this.isCurrent) {
      return this
    } else if (this.isMain) {
      return this._driver.switchToMainContext()
    }

    if (this.isRef) {
      await this.init()
    }

    if (!this._parent.isCurrent) {
      return this._driver.switchTo(this)
    }

    await this._parent.cacheInnerOffset()
    await this.cacheMetrics()

    this._context = await this.spec.childContext(this._parent.unwrapped, this._element.unwrapped)

    // TODO replace
    await this._driver.updateCurrentContext(this)
    return this
  }

  async execute(script, ...args) {
    await this.focus()
    try {
      const result = await this.spec.executeScript(this._context, script, ...serialize(args))
      return result
    } catch (err) {
      this._logger.verbose(`WARNING: execute script error: ${err}`)
      throw err
    }
    function serialize(data) {
      if (TypeUtils.isArray(data)) {
        return data.map(serialize)
      } else if (TypeUtils.isObject(data)) {
        if (TypeUtils.isFunction(data.toJSON)) {
          return data.toJSON()
        }
        return Object.entries(data).reduce(
          (serialized, [key, value]) => Object.assign(serialized, {[key]: serialize(value)}),
          {},
        )
      } else {
        return data
      }
    }
  }

  async cacheInnerOffset() {
    this._innerOffset = await this.getInnerOffset()
  }

  async cacheMetrics() {
    this._rect = await this._element.getRect()
    this._clientRect = await this._element.getClientRect()
    if (this._parent.isMain) {
      this._parent._rect = new Region(Location.ZERO, await this._driver.getViewportSize())
      this._parent._clientRect = this._parent._rect
    }
  }

  async getFrameElement() {
    if (this.isMain) return null
    await this.init()
    return this._element
  }

  async getScrollRootElement() {
    if (!this._scrollRootElement) {
      await this.focus()
      this._scrollRootElement = await this.element({type: 'css', selector: 'html'})
    }
    return this._scrollRootElement
  }

  async setScrollRootElement(scrollRootElement) {
    this._scrollRootElement = await this.element(scrollRootElement)
  }

  async getRect() {
    if (this.isMain) {
      this._rect = new Region(Location.ZERO, await this._driver.getViewportSize())
    } else if (this._parent.isCurrent) {
      await this.init()
      this._rect = await this._element.getRect()
    }
    return this._rect
  }

  async getClientRect() {
    if (this.isMain) {
      this._clientRect = new Region(Location.ZERO, await this._driver.getViewportSize())
    } else if (this._parent.isCurrent) {
      await this.init()
      this._clientRect = await this._element.getClientRect()
    }
    return this._clientRect
  }

  async getClientLocation() {
    const clientRect = await this.getClientRect()
    return clientRect.getLocation()
  }

  async getClientSize() {
    const clientRect = await this.getClientRect()
    return clientRect.getSize()
  }

  async getLocationInPage() {
    return this.path.reduce(
      (location, context) =>
        location.then(async location => {
          return location.offset(await context.getClientLocation())
        }),
      Promise.resolve(Location.ZERO),
    )
  }

  async getLocationInViewport() {
    let location = Location.ZERO
    let currentContext = this
    while (currentContext) {
      const contextLocation = await currentContext.getClientLocation()
      const parentContextInnerOffset = currentContext.parent
        ? await currentContext.parent.getInnerOffset()
        : Location.ZERO

      location = location.offsetByLocation(contextLocation).offsetNegative(parentContextInnerOffset)
      currentContext = currentContext.parent
    }
    return location
  }

  async getEffectiveSize() {
    const rect = new Region(Location.ZERO, await this.main.getClientSize())
    for (const context of this.path) {
      rect.intersect(new Region(Location.ZERO, await context.getClientSize()))
    }
    return rect.getSize()
  }

  async getDocumentSize() {
    return EyesUtils.getDocumentSize(this._logger, this)
  }

  async getInnerOffset() {
    if (this.isCurrent) {
      this._innerOffset = await EyesUtils.getInnerOffset(
        this._logger,
        this,
        await this.getScrollRootElement(),
      )
    }
    return this._innerOffset
  }
}

module.exports = EyesContext
