'use strict'
/**
 * @typedef {import('../logging/Logger')} Logger
 * @typedef {import('./EyesWrappedElement').EyesSelector} EyesSelector
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./EyesWrappedDriver')<TDriver, TElement, TSelector>} EyesWrappedDriver
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./EyesWrappedElement')<TDriver, TElement, TSelector>} EyesWrappedElement
 */

/**
 * The object which implements the lowest-level functions to work with element finder
 * @template TDriver, TElement, TSelector
 * @typedef SpecElementFinder
 * @prop {(logger: Logger, driver: EyesWrappedDriver<TDriver, TElement, TSelector>, element: TElement, selector: TSelector) => EyesWrappedElement<TDriver, TElement, TSelector>} createElement - return wrapped element instance
 * @prop {(driver: TDriver, selector: TSelector) => TElement} findElement - return found element
 * @prop {(driver: TDriver, selector: TSelector) => TElement} findElements - return found elements
 * @prop {(selector: EyesSelector) => TSelector} toSupportedSelector - translate cross SDK selector to SDK specific selector
 * @prop {(selector: TSelector) => EyesSelector} toEyesSelector - translate SDK specific selector to cross SDK selector
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {new (logger: Logger, driver: EyesWrappedDriver<TDriver, TElement, TSelector>) => EyesElementFinder<TDriver, TElement, TSelector>} EyesElementFinderCtor
 */

/**
 * @template TDriver - TDriver provided by wrapped framework
 * @template TElement - TElement provided by wrapped framework
 * @template TSelector - TSelector supported by framework
 */
class EyesElementFinder {
  /**
   * @template TDriver, TElement, TSelector
   * @param {SpecElementFinder<TDriver, TElement, TSelector>} spec - specifications for the specific framework
   * @return {EyesElementFinderCtor<TDriver, TElement, TSelector>} specialized version of this class
   */
  static specialize(spec) {
    return class extends EyesElementFinder {
      /** @override */
      static get spec() {
        return spec
      }
      /** @override */
      get spec() {
        return spec
      }
    }
  }
  /**
   * @type {SpecElementFinder}
   */
  static get spec() {
    throw new TypeError('The class is not specialized')
  }
  /** @type {SpecElementFinder<TDriver, TElement, TSelector>} */
  get spec() {
    throw new TypeError('The class is not specialized')
  }
  /**
   * Construct an element finder instance
   * @param {Logger} logger - logger instance
   * @param {EyesWrappedDriver<TDriver, TElement, TSelector>} driver - wrapped driver instance
   */
  constructor(logger, driver) {
    this._logger = logger
    this._driver = driver
  }
  /**
   * Returns first founded element
   * @param {TSelector|EyesSelector} selector - selector supported by current implementation
   * @return {Promise<EyesWrappedElement<TDriver, TElement, TSelector>>}
   */
  async findElement(selector) {
    selector = this.spec.toSupportedSelector(selector)
    const element = await this.spec.findElement(this._driver.unwrapped, selector)
    return element ? this.spec.createElement(this._logger, this._driver, element, selector) : null
  }
  /**
   * Returns all founded element
   * @param {TSelector|EyesSelector} selector - selector supported by current implementation
   * @return {Promise<EyesWrappedElement<TDriver, TElement, TSelector>[]>}
   */
  async findElements(selector) {
    const elements = await this.spec.findElements(this._driver.unwrapped, selector)
    return elements.map(element =>
      this.spec.createElement(this._logger, this._driver, element, selector),
    )
  }
}

module.exports = EyesElementFinder
