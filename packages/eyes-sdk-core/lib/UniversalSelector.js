'use strict'

class UniversalSelector {
  /**
   * @param {string} value - selector itself
   * @param {string} using - selector type
   */
  constructor(value, using = 'css selector') {
    this._value = value
    this._using = using
  }
  /**
   * @return {string} selector
   */
  get value() {
    return this._value
  }
  /**
   * @return {string} selector type
   */
  get using() {
    return this._using
  }
  /**
   * Create css selector
   * @param {string} cssSelector - selector string
   * @return {UniversalSelector} selector instance
   */
  static css(cssSelector) {
    return new UniversalSelector(cssSelector)
  }
  /**
   * @alias css
   */
  static cssSelector(cssSelector) {
    return UniversalSelector.css(cssSelector)
  }
  /**
   * Create css selector by id
   * @param {string} id - element id
   * @return {UniversalSelector} selector instance
   */
  static id(id) {
    return new UniversalSelector(`*[id="${id}"]`)
  }
  /**
   * Create css selector by class
   * @param {string} className - element class
   * @return {UniversalSelector} selector instance
   */
  static className(className) {
    return new UniversalSelector(`.${className}`)
  }
  /**
   * Create css selector by attribute an its value
   * @param {string} attributeName - attribute name
   * @param {string} value - attribute value
   * @return {UniversalSelector} selector instance
   */
  static attributeValue(attributeName, value) {
    return new UniversalSelector(`*[${attributeName}="${value}"]`)
  }
  /**
   * Create css selector by name attribute
   * @param {string} name - name attribute value
   * @return {UniversalSelector} selector instance
   */
  static name(name) {
    return UniversalSelector.attributeValue('name', name)
  }
  /**
   * Create css selector by tag name
   * @param {string} tagName - element tag name
   * @return {UniversalSelector} selector instance
   */
  static tagName(tagName) {
    return new UniversalSelector(tagName)
  }
  /**
   * Create xpath selector
   * @param {string} xpath - xpath string
   * @return {UniversalSelector} selector instance
   */
  static xpath(xpath) {
    return new UniversalSelector(xpath, 'xpath')
  }
  /**
   * @alias xpath
   */
  static xPath(xpath) {
    return UniversalSelector.xpath(xpath)
  }
  /**
   * @override
   */
  toString() {
    return `${this.using}:${this.value}`
  }
}

module.exports = UniversalSelector
