const {TypeUtils, UniversalSelector} = require('@applitools/eyes-sdk-core')

function LegacyAPIDriver(EyesWrappedDriver) {
  return class EyesWebDriver extends EyesWrappedDriver {
    get remoteWebDriver() {
      return this._driver
    }
    async executeScript(script, ...varArgs) {
      if (TypeUtils.isFunction(script) || varArgs.length > 1 || !TypeUtils.isArray(varArgs[0])) {
        return this._executor.executeScript(script, ...varArgs)
      } else {
        return this._driver.executeScript(script, varArgs[0])
      }
    }
    async executeAsyncScript(script, ...varArgs) {
      if (TypeUtils.isFunction(script) || varArgs.length > 1 || !TypeUtils.isArray(varArgs[0])) {
        return this._executor.executeAsyncScript(script, ...varArgs)
      } else {
        return this._driver.executeAsyncScript(script, varArgs[0])
      }
    }
    async findElement(usingOrLocator, value) {
      if (usingOrLocator instanceof UniversalSelector) {
        return this._finder.findElement(usingOrLocator)
      } else {
        return this._driver.findElement(usingOrLocator, value)
      }
    }
    async findElements(usingOrLocator, value) {
      if (usingOrLocator instanceof UniversalSelector) {
        return this._finder.findElements(usingOrLocator)
      } else {
        return this._driver.findElements(usingOrLocator, value)
      }
    }
    async findElementById(id) {
      return this.findElement(UniversalSelector.id(id))
    }
    async findElementsById(id) {
      return this.findElements(UniversalSelector.id(id))
    }
    async findElementByName(name) {
      return this.findElement(UniversalSelector.name(name))
    }
    async findElementsByName(name) {
      return this.findElements(UniversalSelector.name(name))
    }
    async findElementByCssSelector(cssSelector) {
      return this.findElement(UniversalSelector.cssSelector(cssSelector))
    }
    async findElementsByCssSelector(cssSelector) {
      return this.findElements(UniversalSelector.cssSelector(cssSelector))
    }
    async findElementByClassName(_className) {
      throw new TypeError('findElementByClassName method is not implemented!')
    }
    async findElementsByClassName(_className) {
      throw new TypeError('findElementsByClassName method is not implemented!')
    }
    async findElementByLinkText(_linkText) {
      throw new TypeError('findElementByLinkText method is not implemented!')
    }
    async findElementsByLinkText(_linkText) {
      throw new TypeError('findElementsByLinkText method is not implemented!')
    }
    async findElementByPartialLinkText(_partialLinkText) {
      throw new TypeError('findElementByPartialLinkText method is not implemented!')
    }
    async findElementsByPartialLinkText(_partialLinkText) {
      throw new TypeError('findElementsByPartialLinkText method is not implemented!')
    }
    async findElementByTagName(tagName) {
      return this.findElement(UniversalSelector.tagName(tagName))
    }
    async findElementsByTagName(tagName) {
      return this.findElements(UniversalSelector.tagName(tagName))
    }
    async findElementByXPath(xpath) {
      return this.findElement(UniversalSelector.xPath(xpath))
    }
    async findElementsByXPath(xpath) {
      return this.findElements(UniversalSelector.xPath(xpath))
    }
    getFrameChain() {
      return this._context._frameChain
    }
    switchTo() {
      return {
        defaultContent: () => this.switchToFrame(null),
        frame: arg => this.switchToFrame(arg),
        parentFrame: () => this.switchToParentFrame(),
      }
    }
    async getUserAgent() {
      return this._controller.getUserAgent()
    }
    async end() {
      return this._driver.deleteSession()
    }
    async close() {
      return this._driver.deleteSession()
    }
    async sleep(ms) {
      return this._driver.pause(ms)
    }
    async takeScreenshot() {
      return this._driver.takeScreenshot()
    }
  }
}

module.exports = LegacyAPIDriver
