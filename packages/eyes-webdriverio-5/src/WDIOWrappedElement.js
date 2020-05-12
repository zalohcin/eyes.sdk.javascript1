const {
  TypeUtils,
  Region,
  FrameChain,
  UniversalSelector,
  EyesWrappedElement,
  EyesUtils,
} = require('@applitools/eyes-sdk-core')
const LegacyWrappedElement = require('./LegacyWrappedElement')

const WEB_ELEMENT_ID = 'element-6066-11e4-a52e-4f735466cecf'

class WDIOWrappedElement extends LegacyWrappedElement(EyesWrappedElement) {
  constructor(logger, driver, element, selector) {
    if (element instanceof WDIOWrappedElement) {
      return element
    }
    super()
    if (WDIOWrappedElement.isCompatible(element)) {
      this._element = element
      this._selector = selector || element.selector
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
      Boolean(element.ELEMENT || element[WEB_ELEMENT_ID] || element.elementId)
    )
  }

  static isSelector(selector) {
    return TypeUtils.isString(selector) || selector instanceof UniversalSelector
  }

  static equals(leftElement, rightElement) {
    if (!leftElement || !rightElement) return false
    return WDIOWrappedElement.elementId(leftElement) === WDIOWrappedElement.elementId(rightElement)
  }

  static elementId(element) {
    return element instanceof WDIOWrappedElement
      ? element.elementId
      : element.elementId || element.ELEMENT || element[WEB_ELEMENT_ID]
  }

  get elementId() {
    return this._element.elementId || this._element[WEB_ELEMENT_ID] || this._element.ELEMENT
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
    return this.withRefresh(() =>
      EyesUtils.getElementRect(this._logger, this._driver.executor, this),
    )
  }

  async getClientRect() {
    return this.withRefresh(() =>
      EyesUtils.getElementClientRect(this._logger, this._driver.executor, this),
    )
  }

  async getSize() {
    const rect = await this.withRefresh(() =>
      EyesUtils.getElementRect(this._logger, this._driver.executor, this),
    )
    return rect.getSize()
  }

  async getLocation() {
    const rect = await this.withRefresh(() =>
      EyesUtils.getElementRect(this._logger, this._driver.executor, this),
    )
    return rect.getLocation()
  }

  async getCssProperty(...properties) {
    const values = await this.withRefresh(() =>
      EyesUtils.getElementCssProperties(this._logger, this._driver.executor, properties, this),
    )
    return properties.length <= 1 ? values[0] : values
  }

  async getProperty(...properties) {
    const values = await this.withRefresh(() =>
      EyesUtils.getElementProperties(this._logger, this._driver.executor, properties, this),
    )
    return properties.length <= 1 ? values[0] : values
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
