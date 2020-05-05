const {
  TypeUtils,
  Location,
  RectangleSize,
  Region,
  CoordinatesType,
  EyesWrappedElement,
  FrameChain,
  EyesUtils,
} = require('@applitools/eyes-sdk-core')
const By = require('./LegacySelector')
const LegacyWrappedElement = require('./LegacyWrappedElement')

const WEB_ELEMENT_ID = 'element-6066-11e4-a52e-4f735466cecf'

class WDIOWrappedElement extends LegacyWrappedElement(EyesWrappedElement) {
  constructor(logger, driver, element, selector) {
    if (element instanceof WDIOWrappedElement) {
      return element
    }
    super()
    if (WDIOWrappedElement.isCompatible(element)) {
      // in case of wrapping not an element but response with value
      if (element.value) {
        this._element = element.value
        this._selector = selector || element.selector || ''
      } else {
        this._element = element
        this._selector = selector
      }
    } else if (WDIOWrappedElement.isSelector(selector)) {
      this._selector = selector
    } else {
      throw new TypeError('WDIOWrappedElement constructor called with argument of unknown type!')
    }
    if (logger) {
      this._logger = logger
    }
    if (driver) {
      this._driver = driver
      this._frameChain = driver.context.frameChain
    }
  }

  static fromElement(element) {
    return new WDIOWrappedElement(null, null, element)
  }

  static fromSelector(selector) {
    return new WDIOWrappedElement(null, null, null, selector)
  }

  static isCompatible(element) {
    if (!element) return false
    return (
      element instanceof WDIOWrappedElement ||
      (element.value
        ? Boolean(element.value.ELEMENT || element.value[WEB_ELEMENT_ID])
        : Boolean(element.ELEMENT || element[WEB_ELEMENT_ID]))
    )
  }

  static isSelector(selector) {
    return (
      TypeUtils.isString(selector) ||
      TypeUtils.has(selector, ['using', 'value']) ||
      selector instanceof By
    )
  }

  static equals(leftElement, rightElement) {
    if (!leftElement || !rightElement) return false
    return WDIOWrappedElement.elementId(leftElement) === WDIOWrappedElement.elementId(rightElement)
  }

  static elementId(element) {
    return element instanceof WDIOWrappedElement
      ? element.elementId
      : element.ELEMENT || element[WEB_ELEMENT_ID]
  }

  get elementId() {
    return this._element[WEB_ELEMENT_ID] || this._element.ELEMENT
  }

  get selector() {
    return this._selector
  }

  get unwrapped() {
    return {
      ELEMENT: this.elementId,
      [WEB_ELEMENT_ID]: this.elementId,
    }
  }

  equals(element) {
    return WDIOWrappedElement.equals(this, element)
  }

  async init(driver) {
    if (!this._element) {
      const element = await driver.finder.findElement(this._selector)
      if (!element) {
        throw new Error('Could not get element from selector!')
      }
      this._element = element.unwrapped
    }
    if (!this._driver) {
      this._driver = driver
      this._frameChain = driver.context.frameChain
      if (!this._logger) {
        this._logger = driver._logger
      }
    }
    return this
  }

  async getRect() {
    const {value: rect} = await this.withRefresh(() => this._driver.elementIdRect(this.elementId))
    const left = rect && rect.x ? Math.ceil(rect.x) : 0
    const top = rect && rect.y ? Math.ceil(rect.y) : 0
    const width = rect && rect.width ? Math.ceil(rect.width) : 0
    const height = rect && rect.height ? Math.ceil(rect.height) : 0
    return new Region(left, top, width, height)
  }

  async getContentRect() {
    const [
      location,
      [borderLeftWidth, borderTopWidth],
      [clientWidth, clientHeight],
    ] = await Promise.all([
      this.getLocation(),
      this.getCssProperty('border-left-width', 'border-top-width'),
      this.getProperty('clientWidth', 'clientHeight'),
    ])
    return new Region(
      Math.round(location.getX() + Number.parseFloat(borderLeftWidth)),
      Math.round(location.getY() + Number.parseFloat(borderTopWidth)),
      Math.round(clientWidth),
      Math.round(clientHeight),
      CoordinatesType.CONTEXT_RELATIVE,
    )
  }

  async getBounds() {
    const {value: rect} = await this.withRefresh(() => this._driver.elementIdRect(this.elementId))
    let left = rect && rect.x ? Math.ceil(rect.x) : 0
    let top = rect && rect.y ? Math.ceil(rect.y) : 0
    let width = rect && rect.width ? Math.ceil(rect.width) : 0
    let height = rect && rect.height ? Math.ceil(rect.height) : 0
    if (left < 0) {
      width = Math.max(0, width + left)
      left = 0
    }
    if (top < 0) {
      height = Math.max(0, height + top)
      top = 0
    }
    return new Region(left, top, width, height, CoordinatesType.CONTEXT_RELATIVE)
  }

  async getSize() {
    const {value: size} = await this.withRefresh(() => this._driver.elementIdSize(this.elementId))
    const width = size && size.width ? Math.ceil(size.width) : 0
    const height = size && size.height ? Math.ceil(size.height) : 0
    return new RectangleSize(width, height)
  }

  async getLocation() {
    const {value: location} = await this.withRefresh(() =>
      this._driver.elementIdLocation(this.elementId),
    )
    const left = location && location.x ? Math.ceil(location.x) : 0
    const top = location && location.y ? Math.ceil(location.y) : 0
    return new Location(left, top)
  }

  async getCssProperty(...cssPropertyNames) {
    const properties = await this.withRefresh(() =>
      this._driver.executor.executeScript(
        `var el = arguments[0];
        var computedStyle = window.getComputedStyle ? window.getComputedStyle(el, null) : el.currentStyle;
        return computedStyle
          ? [${cssPropertyNames.map(property => `computedStyle['${property}']`).join(',')}]
          : [];`,
        this,
      ),
    )
    return cssPropertyNames.length <= 1 ? properties[0] : properties
  }

  async getProperty(...propertyNames) {
    const properties = await this.withRefresh(() =>
      this._driver.executor.executeScript(
        `return [${propertyNames.map(property => `arguments[0]['${property}']`).join(',')}];`,
        this,
      ),
    )
    return propertyNames.length <= 1 ? properties[0] : properties
  }

  async hideScrollbars() {
    return this.withRefresh(async () => {
      this._originalOverflow = await EyesUtils.setOverflow(
        this._logger,
        this._driver.executor,
        'hidden',
        this,
      )
      return this._originalOverflow
    })
  }

  async restoreScrollbars() {
    return this.withRefresh(async () => {
      await EyesUtils.setOverflow(this._logger, this._driver.executor, this._originalOverflow, this)
    })
  }

  async preservePosition(positionProvider) {
    return this.withRefresh(async () => {
      this._positionMemento = await positionProvider.getState(this)
      return this._positionMemento
    })
  }

  async restorePosition(positionProvider) {
    if (this._positionMemento) {
      return this.withRefresh(async () => {
        await positionProvider.restoreState(this._positionMemento, this)
      })
    }
  }

  async refresh(freshElement) {
    if (freshElement) {
      this._element = freshElement
      return true
    }
    const originalFrameChain = this._driver.context.frameChain
    const isSameFrameChain = FrameChain.equals(originalFrameChain, this._frameChain)
    if (!isSameFrameChain) {
      await this._driver.context.frames(this._frameChain)
    }
    const {value: element} = await this._driver.element(this._selector)
    if (element) {
      this._element = element
    }
    if (!isSameFrameChain) {
      await this._driver.context.frames(originalFrameChain)
    }
    return Boolean(element)
  }

  async withRefresh(callback) {
    try {
      const result = await callback()
      // WDIO will try to handle `StaleElementReference` by itself
      // in this case it will return `element` response for stale element
      if (result && result.selector && result.value && result.selector === this._selector) {
        await this.refresh(result.value)
        return callback()
      }
      return result
    } catch (err) {
      if (!err.seleniumStack || err.seleniumStack.type !== 'StaleElementReference') throw err
      const refreshed = await this.refresh()
      if (refreshed) return callback()
      else throw err
    }
  }
}

module.exports = WDIOWrappedElement
