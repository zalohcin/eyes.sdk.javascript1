'use strict'
const ElementNotFoundError = require('../errors/ElementNotFoundError')
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

  get spec() {
    throw new TypeError('The class is not specialized')
  }

  constructor(logger, context, element, selector) {
    if (element instanceof EyesElement) {
      return element
    }
    if (this.spec.isElement(element)) {
      this._element = this.spec.extractElement ? this.spec.extractElement(element) : element
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

  async equals(otherElement) {
    if (!otherElement) return false
    return this.spec.isEqualElements(
      this._context.unwrapped,
      this.unwrapped,
      otherElement instanceof EyesElement ? otherElement.unwrapped : otherElement,
    )
  }

  async init(context) {
    if (!this._element) {
      const element = await context.findElement(this._selector)
      if (!element) {
        throw new ElementNotFoundError(this._selector)
      }
      this._element = element.unwrapped
    }
    if (!this._context) {
      this._context = context
      if (!this._logger) {
        this._logger = context._logger
      }
    }
    return this
  }

  async getRect() {
    return this.withRefresh(() => EyesUtils.getElementRect(this._logger, this._context, this))
  }

  async getClientRect() {
    return this.withRefresh(() => EyesUtils.getElementClientRect(this._logger, this._context, this))
  }

  async getCssProperty(...properties) {
    const values = await this.withRefresh(() =>
      EyesUtils.getElementCssProperties(this._logger, this._context, properties, this),
    )
    return properties.length <= 1 ? values[0] : values
  }

  async getProperty(...properties) {
    const values = await this.withRefresh(() =>
      EyesUtils.getElementProperties(this._logger, this._context, properties, this),
    )
    return properties.length <= 1 ? values[0] : values
  }

  async hideScrollbars() {
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
    return this.withRefresh(async () => {
      await EyesUtils.setOverflow(this._logger, this._context, this._originalOverflow, this)
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
    if (this.spec.isElement(freshElement)) {
      this._element = freshElement
      return true
    }
    if (!this._selector) return false
    const element = await this._context.findElement(this._selector)
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
    try {
      const result = await operation()
      // Some frameworks could handle stale element reference error by itself or doesn't throw an error
      const isStaleElementReferenceResult = this.spec.isStaleElementReferenceResult
        ? this.spec.isStaleElementReferenceResult(result, this)
        : false
      if (isStaleElementReferenceResult) {
        const freshElement = this.spec.extractElement ? this.spec.extractElement(result) : result
        await this.refresh(freshElement)
        return operation()
      }
      return result
    } catch (err) {
      const isStaleElementReferenceError = this.spec.isStaleElementReferenceResult
        ? this.spec.isStaleElementReferenceResult(err, this)
        : false
      if (!isStaleElementReferenceError) throw err
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
