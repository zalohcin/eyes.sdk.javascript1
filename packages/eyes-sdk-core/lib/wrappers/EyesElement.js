'use strict'
const ElementNotFoundError = require('../errors/ElementNotFoundError')
const Region = require('../geometry/Region')
const CoordinatesTypes = require('../geometry/CoordinatesType')
const EyesUtils = require('../EyesUtils')

/**
 * @template TDriver - TDriver provided by wrapped framework
 * @template TElement - TElement provided by wrapped framework
 * @template TSelector - TSelector supported by framework
 */
class EyesElement {
  static specialize(spec) {
    return class SpecializedElement extends EyesElement {
      static get spec() {
        return spec
      }
      get spec() {
        return spec
      }
    }
  }

  static get spec() {
    throw new TypeError('The class is not specialized. Create a specialize EyesElement first')
  }

  constructor(logger, context, {element, selector} = {}) {
    if (element instanceof EyesElement) {
      return element
    }
    if (this.spec.isElement(element)) {
      this._element = this.spec.transformElement ? this.spec.transformElement(element) : element
      // Some frameworks contains information about the selector inside an element
      this._selector = selector || (this.spec.extractSelector && this.spec.extractSelector(element))
    } else if (this.spec.isSelector(selector)) {
      this._selector = selector
    } else {
      throw new TypeError('EyesElement constructor called with argument of unknown type!')
    }
    if (logger) {
      this._logger = logger
    }
    if (context) {
      this._context = context
    }
  }

  get spec() {
    throw new TypeError('The class is not specialized. Create a specialize EyesElement first')
  }

  get unwrapped() {
    return this._element
  }

  get selector() {
    return this._selector
  }

  get context() {
    return this._context
  }

  get isRef() {
    return this._context.isRef || !this._element
  }

  async equals(element) {
    if (this.isRef) return false
    return this.spec.isEqualElements(
      this._context.unwrapped,
      this._element,
      element instanceof EyesElement ? element.unwrapped : element,
    )
  }

  async init() {
    if (!this._element) {
      const element = await this._context.element(this._selector)
      if (!element) {
        throw new ElementNotFoundError(this._selector)
      }
      this._element = element.unwrapped
    }
    if (!this._logger) {
      this._logger = this._context._logger
    }
    return this
  }

  async getRect() {
    await this.init()
    return this.withRefresh(async () => {
      if (this._context.driver.isNative) {
        const rect = await this.spec.getElementRect(this._context.unwrapped, this._element)
        return new Region({
          left: Math.ceil(rect.x),
          top: Math.ceil(rect.y),
          width: Math.ceil(rect.width),
          height: Math.ceil(rect.height),
          coordinatesType: CoordinatesTypes.CONTEXT_RELATIVE,
        })
      } else {
        return EyesUtils.getElementRect(this._logger, this._context, this)
      }
    })
  }

  async getClientRect() {
    await this.init()
    return this.withRefresh(() => EyesUtils.getElementClientRect(this._logger, this._context, this))
  }

  async getCssProperty(...properties) {
    await this.init()
    const values = await this.withRefresh(() =>
      EyesUtils.getElementCssProperties(this._logger, this._context, properties, this),
    )
    return properties.length <= 1 ? values[0] : values
  }

  async getProperty(...properties) {
    await this.init()
    const values = await this.withRefresh(() =>
      EyesUtils.getElementProperties(this._logger, this._context, properties, this),
    )
    return properties.length <= 1 ? values[0] : values
  }

  async hideScrollbars() {
    await this.init()
    return this.withRefresh(async () => {
      this._originalOverflow = await EyesUtils.setOverflow(
        this._logger,
        this._context,
        'hidden',
        this,
      )
      return this._originalOverflow
    })
  }

  async restoreScrollbars() {
    await this.init()
    return this.withRefresh(async () => {
      await EyesUtils.setOverflow(this._logger, this._context, this._originalOverflow, this)
    })
  }

  async preservePosition(positionProvider) {
    await this.init()
    return this.withRefresh(async () => {
      this._positionMemento = await positionProvider.getState(this)
      return this._positionMemento
    })
  }

  async restorePosition(positionProvider) {
    if (this._positionMemento) {
      await this.init()
      return this.withRefresh(async () => {
        await positionProvider.restoreState(this._positionMemento, this)
      })
    }
  }

  async refresh(freshElement) {
    if (this.spec.isElement(freshElement)) {
      this._element = freshElement
      return true
    }
    if (!this._selector) return false
    const element = await this._context.element(this._selector)
    if (element) {
      this._element = element.unwrapped
    }
    return Boolean(element)
  }
  /**
   * Wrap an operation on the element and handle stale element reference if such happened during operation
   * @param {Function} operation - operation on the element
   * @return {Promise<*>} promise which resolve whatever an operation will resolve
   */
  async withRefresh(operation) {
    if (!this.spec.isStaleElementError) return operation()
    try {
      const result = await operation()
      // Some frameworks could handle stale element reference error by itself or doesn't throw an error
      if (this.spec.isStaleElementError(result)) {
        const freshElement = this.spec.extractElement ? this.spec.extractElement(result) : result
        await this.refresh(freshElement)
        return operation()
      }

      return result
    } catch (err) {
      if (!this.spec.isStaleElementError(err)) throw err
      const refreshed = await this.refresh()
      if (refreshed) return operation()
      else throw err
    }
  }
  /**
   * @override
   */
  toJSON() {
    return this.unwrapped
  }
}

module.exports = EyesElement
