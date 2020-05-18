const WDIOFrame = require('./WDIOFrame')
const WDIOWrappedElement = require('./WDIOWrappedElement')

module.exports = {
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
  isEqualFrames(leftFrame, rightFrame) {
    return WDIOFrame.equals(leftFrame, rightFrame)
  },
  createFrameReference(reference) {
    return WDIOFrame.fromReference(reference)
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
  createElement(logger, driver, element, selector) {
    return new WDIOWrappedElement(logger, driver, element, selector)
  },
  async getWindowLocation(driver) {
    return driver.getWindowPosition()
  },
  async setWindowLocation(driver, location) {
    return driver.setWindowPosition(location.x, location.y)
  },
  async getWindowSize(driver) {
    return driver.getWindowSize()
  },
  async setWindowSize(driver, size) {
    return driver.setWindowSize(size.width, size.height)
  },
  async getOrientation(driver) {
    return driver.getOrientation()
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
