const WDIOFrame = require('./WDIOFrame')
const WDIOWrappedElement = require('./WDIOWrappedElement')

module.exports = {
  isEqualFrames(leftFrame, rightFrame) {
    return WDIOFrame.equals(leftFrame, rightFrame)
  },
  createFrameReference(reference) {
    return WDIOFrame.fromReference(reference)
  },
  createElement(logger, driver, element, selector) {
    return new WDIOWrappedElement(logger, driver, element, selector)
  },
  toSupportedSelector(selector) {
    return WDIOWrappedElement.toSupportedSelector(selector)
  },
  toEyesSelector(selector) {
    return WDIOWrappedElement.toEyesSelector(selector)
  },
  async executeScript(driver, script, ...args) {
    const {value} = await driver.execute(script, ...args)
    return value
  },
  sleep(driver, ms) {
    return driver.pause(ms)
  },
  switchToFrame(driver, reference) {
    return driver.frame(reference)
  },
  switchToParentFrame(driver) {
    return driver.frameParent()
  },
  async findElement(driver, selector) {
    const {value} = await driver.element(selector.toString())
    return value
  },
  async findElementInElement(driver, element, selector) {
    const {value} = await driver.elementIdElement(
      WDIOWrappedElement.extractId(element),
      selector.toString(),
    )
    return value
  },
  async findElements(driver, selector) {
    const {value} = await driver.elements(selector.toString())
    return value
  },
  async findElementsInElement(driver, element, selector) {
    const {value} = await driver.elementIdElements(
      WDIOWrappedElement.extractId(element),
      selector.toString(),
    )
    return value
  },
  async getWindowLocation(driver) {
    const {value} = await driver.windowHandlePosition()
    return value
  },
  async setWindowLocation(driver, location) {
    await driver.windowHandlePosition(location)
  },
  async getWindowSize(driver) {
    const {value} = await driver.windowHandleSize()
    return value
  },
  async setWindowSize(driver, size) {
    await driver.windowHandleSize(size)
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
  async isNative(driver) {
    return driver.isMobile && !driver.desiredCapabilities.browserName
  },
  async getPlatformVersion(driver) {
    return driver.desiredCapabilities.platformVersion
  },
  async getSessionId(driver) {
    return driver.requestHandler.sessionID || driver.sessionId
  },
  async takeScreenshot(driver) {
    return driver.saveScreenshot()
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
