'use strict'

class By {
  /**
   *
   * @param {String} value
   */
  constructor(value, using = 'css selector') {
    this._value = value
    this._using = using
  }

  static id(id) {
    return new By(`*[id="${id}"]`)
  }

  static name(name) {
    return new By(`*[name="${name}"]`)
  }

  /**
   * @alias css
   */
  static cssSelector(cssSelector) {
    return By.css(cssSelector)
  }

  static css(cssSelector) {
    return new By(cssSelector)
  }

  static xPath(xPath) {
    return new By(xPath, 'xpath')
  }

  static xpath(xPath) {
    return this.xPath(xPath)
  }

  /**
   *
   * @param {string} tagName
   * @return {By}
   */
  static tagName(tagName) {
    return new By(tagName)
  }

  static attributeValue(attributeName, value) {
    return new By(`[${attributeName}="${value}"]`)
  }

  static className(value) {
    return new By(`.${value}`)
  }

  get value() {
    return this._value
  }

  get using() {
    return this._using
  }
}

module.exports = By
