const WDIOFrame = require('./WDIOFrame')
const WDIOWrappedElement = require('./WDIOWrappedElement')

module.exports = {
  isEqualFrames(leftFrame, rightFrame) {
    return WDIOFrame.equals(leftFrame, rightFrame)
  },
  createElement(logger, driver, element, selector) {
    return new WDIOWrappedElement(logger, driver, element, selector)
  },
  createFrameReference(reference) {
    return WDIOFrame.fromReference(reference)
  },
  toSupportedSelector(selector) {
    return WDIOWrappedElement.toSupportedSelector(selector)
  },
  toEyesSelector(selector) {
    return WDIOWrappedElement.toEyesSelector(selector)
  },
  async executeScript(driver, script, ...args) {
    return driver.execute(script, ...args)
  },
  sleep(driver, ms) {
    return driver.pause(ms)
  },
  switchToFrame(driver, reference) {
    return driver.switchToFrame(reference)
  },
  switchToParentFrame(driver) {
    return driver.switchToParentFrame()
  },
  async findElement(driver, selector) {
    return driver.$(selector.toString())
  },
  async findElementInElement(driver, element, selector) {
    const extendedElement = await driver.$(element)
    return extendedElement.$(selector.toString())
  },
  async findElements(driver, selector) {
    return driver.$$(selector.toString())
  },
  async findElementsInElement(driver, element, selector) {
    const extendedElement = await driver.$(element)
    return extendedElement.$$(selector.toString())
  },
  async getWindowLocation(driver) {
    const rect = await driver.getWindowRect()
    return {x: rect.x, y: rect.y}
  },
  async setWindowLocation(driver, location) {
    return driver.setWindowRect(location.x, location.y, null, null)
  },
  async getWindowSize(driver) {
    const rect = await driver.getWindowRect()
    return {width: rect.width, height: rect.height}
  },
  async setWindowSize(driver, size) {
    return driver.setWindowRect(null, null, size.width, size.height)
  },
  async getOrientation(driver) {
    const orientation = await driver.getOrientation()
    return orientation.toLowerCase()
  },
  async isMobile(driver) {
    return driver.isMobile
  },
  async isAndroid(driver) {
    return driver.isAndroid
  },
  async isIOS(driver) {
    return driver.isIOS
  },
  async isNative(driver) {
    return driver.isMobile && !driver.capabilities.browserName
  },
  async getPlatformVersion(driver) {
    return driver.capabilities.platformVersion
  },
  async getSessionId(driver) {
    return driver.sessionId
  },
  async takeScreenshot(driver) {
    return driver.takeScreenshot()
  },
  async getTitle(driver) {
    return driver.getTitle()
  },
  async getUrl(driver) {
    return driver.getUrl()
  },
  async visit(driver, url) {
    return driver.url(url)
  },
}
