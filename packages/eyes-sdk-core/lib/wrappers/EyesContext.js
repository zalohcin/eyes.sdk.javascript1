const TypeUtils = require('../utils/TypeUtils')
const EyesUtils = require('../EyesUtils')
const EyesElement = require('./EyesElement')

class EyesContext {
  static specialize(spec) {
    return class SpecializedContext extends EyesContext {
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
      this.spec.isSelector(reference) ||
      this.spec.isElement(reference)
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
      this._element = null
      this._reference = null
      this._scrollRootElement = options.scrollRootElement
      this._parent = null
    } else if (this.constructor.isReference(options.reference)) {
      if (options.reference instanceof EyesContext) {
        return options.reference
      }
      this._reference = options.reference
      this._scrollRootElement = options.scrollRootElement
      this._parent = options.parent
    } else if (TypeUtils.isPlainObject(options)) {
      this._element = options.element
      this._scrollRootElement = options.scrollRootElement
      this._parent = options.parent
      this._driver = options.driver
      this._rect = options.rect
      this._clientRect = options.clientRect
      this._offset = null
    } else {
      throw new TypeError('EyesContext constructor called with argument of unknown type!')
    }
  }

  static fromReference(reference) {
    return new this(null, null, {reference})
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

  get scrollRootElement() {
    return this._scrollRootElement
  }

  set scrollRootElement(scrollRootElement) {
    this._scrollRootElement = scrollRootElement
  }

  get isInitialized() {
    return !this._reference
  }

  get isDetached() {
    return !this._parent && !this._element && !this._reference
  }

  get isMain() {
    return this === this._driver.contexts.main
  }

  get isCurrent() {
    return this === this._driver.currentContext
  }

  get path() {
    return [...(this._parent ? this._parent.path : []), this]
  }

  extend(context) {
    const [first, second] = this.path
    if (first.isMain) {
      context.scrollRootElement = this._scrollRootElement
      if (second) {
        second._parent = context
      }
    } else {
      first._parent = context
    }
    return this
  }

  async init(driver) {
    this._driver = driver
    console.log(this.isMain)
    if (this.isMain) return this
    if (!this._parent.isInitialized) {
      await this._parent.init(driver)
    }

    await this._parent.focus()

    if (this._reference && !this._element) {
      this._logger.verbose(`Context initialization from reference - ${this._reference}`)

      if (TypeUtils.isInteger(this._reference)) {
        this._logger.verbose('Getting frames list...')
        const elements = await this._parent.findElements('frame, iframe')
        if (this._reference > elements.length) {
          throw new TypeError(`Frame index [${this._reference}] is invalid!`)
        }
        this._element = elements[this._reference]
      } else if (TypeUtils.isString(this._reference) || this.spec.isSelector(this._reference)) {
        this._logger.verbose('Getting frames by name or id or selector...')
        if (TypeUtils.isString(this._reference)) {
          this._element = await this.parent.findElement(
            `iframe[name="${this._reference}"], iframe#${this._reference}`,
          )
        }
        if (!this._element && this.spec.isSelector(this._reference)) {
          this._element = await this._parent.findElement(this._reference)
        }
        if (!this._element) {
          throw new TypeError(`No frame with selector, name or id '${this._reference}' exists!`)
        }
      } else if (this.spec.isElement(this._reference)) {
        this._element = this.spec.createElement(this._logger, this._driver, this._reference)
      } else {
        throw new TypeError('Reference type does not supported!')
      }
      this._reference = null
      this._logger.verbose('Done! getting the specific frame...')
    }

    if (this._element) {
      this._rect = await this._element.getRect()
      this._clientRect = await this._element.getClientRect()
    }

    return this
  }

  async focus() {
    if (this.isDetached && !this.isMain) {
      throw Error('dfgdg')
    }

    if (this.isMain) {
      return this._driver.switchToMainContext()
    }

    if (!this._parent.isCurrent) {
      await this._driver.switchTo(this)
      return
    }

    await this._parent.preserveOffset()

    this._context = await this.spec.childContext(this._parent.unwrapped, this._element.unwrapped)

    if (this._scrollRootElement) {
      await this._scrollRootElement.init(this._context)
    }

    await this._driver.updateCurrentContext(this)
  }

  async context(reference) {
    const context =
      reference instanceof EyesContext
        ? reference
        : EyesContext.fromReference({reference, parent: this})
    if (context.parent !== this) {
      throw Error(`Couldn't switch to a child context because it has a different parent`)
    }
    return this.isInitialized ? context.init(this._driver) : context
  }

  async findElement(selector) {
    await this.focus()
    if (!this.spec.isSelector(selector)) {
      selector = this.spec.toFrameworkSelector(selector)
    }
    const element = await this.spec.findElement(this._context, selector)
    return element ? this.spec.createElement(this._logger, this, element, selector) : null
  }

  async findElements(selector) {
    await this.focus()
    if (!this.spec.isSelector(selector)) {
      selector = this.spec.toFrameworkSelector(selector)
    }
    const elements = await this.spec.findElements(this._context, selector)
    return elements.map(element =>
      this.spec.createElement(this._logger, this._driver, element, selector),
    )
  }

  async executeScript(script, ...args) {
    await this.focus()
    try {
      const result = await this.spec.executeScript(this._context, script, ...args)
      return result
    } catch (err) {
      this._logger.verbose(`WARNING: execute script error: ${err}`)
      throw err
    }
  }
}

module.exports = EyesContext
