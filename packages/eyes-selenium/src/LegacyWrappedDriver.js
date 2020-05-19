const {By} = require('selenium-webdriver')

function LegacyAPIDriver(EyesWrappedDriver) {
  return class EyesWebDriver extends EyesWrappedDriver {
    getRemoteWebDriver() {
      return this._driver
    }
    async findElementById(id) {
      return this._driver.findElement(By.id(id))
    }
    async findElementsById(id) {
      return this._driver.findElements(By.id(id))
    }
    async findElementByName(name) {
      return this._driver.findElement(By.name(name))
    }
    async findElementsByName(name) {
      return this._driver.findElements(By.name(name))
    }
    async findElementByCssSelector(cssSelector) {
      return this._driver.findElement(By.cssSelector(cssSelector))
    }
    async findElementsByCssSelector(cssSelector) {
      return this._driver.findElements(By.cssSelector(cssSelector))
    }
    async findElementByClassName(className) {
      throw this._driver.findElement(By.className(className))
    }
    async findElementsByClassName(className) {
      throw this._driver.findElements(By.className(className))
    }
    async findElementByLinkText(linkText) {
      throw this._driver.findElement(By.linkText(linkText))
    }
    async findElementsByLinkText(linkText) {
      throw this._driver.findElements(By.linkText(linkText))
    }
    async findElementByPartialLinkText(partialLinkText) {
      throw this._driver.findElement(By.partialLinkText(partialLinkText))
    }
    async findElementsByPartialLinkText(partialLinkText) {
      throw this._driver.findElements(By.partialLinkText(partialLinkText))
    }
    async findElementByTagName(tagName) {
      return this._driver.findElement(By.tagName(tagName))
    }
    async findElementsByTagName(tagName) {
      return this._driver.findElements(By.tagName(tagName))
    }
    async findElementByXPath(xpath) {
      return this._driver.findElement(By.xPath(xpath))
    }
    async findElementsByXPath(xpath) {
      return this._driver.findElements(By.xPath(xpath))
    }
    async isMobile() {
      return this._controller.isMobileDevice()
    }
    async isNotMobile() {
      return !(await this._controller.isMobileDevice())
    }
    async getUserAgent() {
      return this._controller.getUserAgent()
    }
    async getSessionId() {
      return this._controller.getAUTSessionId()
    }
    getFrameChain() {
      return this._context._frameChain
    }
  }
}

module.exports = LegacyAPIDriver
