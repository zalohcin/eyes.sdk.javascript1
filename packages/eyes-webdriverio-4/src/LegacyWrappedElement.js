function LegacyAPIElement(EyesWrappedElement) {
  return class EyesWebElement extends EyesWrappedElement {
    getDriver() {
      return this._driver
    }
    getId() {
      return this.elementId
    }
    async getComputedStyle(propStyle) {
      return this.getCssProperty(propStyle)
    }
    async getComputedStyleInteger(propStyle) {
      const value = await this.getCssProperty(propStyle)
      return Math.round(Number.parseFloat(value))
    }
    async getScrollLeft() {
      const value = await this.getProperty('scrollLeft')
      return Math.ceil(Number.parseFloat(value))
    }
    async getScrollTop() {
      const value = await this.getProperty('scrollTop')
      return Math.ceil(Number.parseFloat(value))
    }
    async getScrollWidth() {
      const value = await this.getProperty('scrollWidth')
      return Math.ceil(Number.parseFloat(value))
    }
    async getScrollHeight() {
      const value = await this.getProperty('scrollHeight')
      return Math.ceil(Number.parseFloat(value))
    }
    async getClientWidth() {
      const value = await this.getProperty('clientWidth')
      return Math.ceil(Number.parseFloat(value))
    }
    async getClientHeight() {
      const value = await this.getProperty('clientHeight')
      return Math.ceil(Number.parseFloat(value))
    }
    getBorderLeftWidth() {
      return this.getComputedStyleInteger('border-left-width')
    }
    getBorderRightWidth() {
      return this.getComputedStyleInteger('border-right-width')
    }
    getBorderTopWidth() {
      return this.getComputedStyleInteger('border-top-width')
    }
    getBorderBottomWidth() {
      return this.getComputedStyleInteger('border-bottom-width')
    }
    async executeScript(script) {
      return this._driver.executor.executeScript(script, this)
    }
    async findElement(locator) {
      return this._driver.finder.findElement(locator, this)
    }
    async findElements(locator) {
      return this._driver.finder.findElements(locator, this)
    }
    async sendKeys(keysToSend) {
      await this._driver.elementIdClick(this.elementId)
      return this._driver.keys(keysToSend)
    }
    async click() {
      return this._driver.elementIdClick(this.elementId)
    }
  }
}

module.exports = LegacyAPIElement
