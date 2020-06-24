'use strict'
/**
 * @typedef {import('../logging/Logger')} Logger
 * @typedef {import('./EyesWrappedElement').EyesSelector} EyesSelector
 */

/**
 * @template Driver, Element, Selector
 * @typedef {import('./EyesWrappedDriver')<Driver, Element, Selector>} EyesWrappedDriver
 */

/**
 * @template Driver, Element, Selector
 * @typedef {import('./EyesWrappedElement')<Driver, Element, Selector>} EyesWrappedElement
 */

/**
 * The object which implements the lowest-level functions to work with element finder
 * @template Driver, Element, Selector
 * @typedef SpecElementFinder
 * @prop {(logger: Logger, driver: EyesWrappedDriver<Driver, Element, Selector>, element: Element, selector: Selector) => EyesWrappedElement<Driver, Element, Selector>} createElement - return wrapped element instance
 * @prop {(driver: Driver, selector: Selector) => Element} findElement - return found element
 * @prop {(driver: Driver, selector: Selector) => Element} findElements - return found elements
 * @prop {(selector: EyesSelector) => Selector} toSupportedSelector - translate cross SDK selector to SDK specific selector
 * @prop {(selector: Selector) => EyesSelector} toEyesSelector - translate SDK specific selector to cross SDK selector
 */

/**
 * @template Driver - Driver provided by wrapped framework
 * @template Element - Element provided by wrapped framework
 * @template Selector - Selector supported by framework
 */
class EyesElementFinder {
  /**
   * @template Driver, Element, Selector
   * @param {SpecElementFinder<Driver, Element, Selector>} spec - specifications for the specific framework
   * @return {typedef EyesElementFinder} specialized version of this class
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
  /** @type {SpecElementFinder<Driver, Element, Selector>} */
  get spec() {
    throw new TypeError('The class is not specialized')
  }
  /**
   * Construct an element finder instance
   * @param {Logger} logger - logger instance
   * @param {EyesWrappedDriver<Driver, Element, Selector>} driver - wrapped driver instance
   */
  constructor(logger, driver) {
    this._logger = logger
    this._driver = driver
  }
  /**
   * Returns first founded element
   * @param {Selector|EyesSelector} selector - selector supported by current implementation
   * @return {Promise<EyesWrappedElement<Driver, Element, Selector>>}
   */
  async findElement(selector) {
    selector = this.spec.toSupportedSelector(selector)
    const element = await this.spec.findElement(this._driver.unwrapped, selector)
    return element ? this.spec.createElement(this._logger, this._driver, element, selector) : null
  }
  /**
   * Returns all founded element
   * @param {Selector|EyesSelector} selector - selector supported by current implementation
   * @return {Promise<EyesWrappedElement<Driver, Element, Selector>[]>}
   */
  async findElements(selector) {
    const elements = await this.spec.findElements(this._driver.unwrapped, selector)
    return elements.map(element =>
      this.spec.createElement(this._logger, this._driver, element, selector),
    )
  }
}

module.exports = EyesElementFinder
