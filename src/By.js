

class By {

  /**
   *
   * @param {String} value
   */
  constructor(value) {
    this._value = value;
  }

  static id(id) {
    return new By('#' + id);
  }


  static name(name) {
    return new By(`[name=${name}]`);
  }


  static cssSelector(cssSelector) {
    return new By(cssSelector);
  }


  static xPath(xPath) {
    return new By(xPath);
  }


  static attributeValue(attributeName, value) {
    return new By(`[${attributeName}=${value}]`);
  }

  get value() {
    return this._value;
  }

}

module.exports = By;
