const SeleniumFrame = require('./SeleniumFrame')
const SeleniumWrappedElement = require('./SeleniumWrappedElement')

module.exports = {
  isEqualFrames(leftFrame, rightFrame) {
    return SeleniumFrame.equals(leftFrame, rightFrame)
  },
  createFrameReference(reference) {
    return SeleniumFrame.fromReference(reference)
  },
  createElement(logger, driver, element, selector) {
    return new SeleniumWrappedElement(logger, driver, element, selector)
  },
  async executeScript(driver, script, ...args) {
    return driver.executeScript(script, ...args)
  },
  sleep(driver, ms) {
    return driver.sleep(ms)
  },
  switchToFrame(driver, reference) {
    return driver.switchTo().frame(reference)
  },
  switchToParentFrame(driver) {
    return driver.switchTo().parentFrame()
  },
  async findElement(driver, selector) {
    const element = await driver.findElement(selector)
    return element
  },
  async findElementInElement(driver, element, selector) {
    // const {value} = await driver.elementIdElement(
    //   SeleniumWrappedElement.extractId(element),
    //   selector.toString(),
    // )
    // return value
  },
  async findElements(driver, selector) {
    const elements = await driver.findElements(selector)
    return elements
  },
  async findElementsInElement(driver, element, selector) {
    // const {value} = await driver.elementIdElements(
    //   SeleniumWrappedElement.extractId(element),
    //   selector.toString(),
    // )
    // return value
  },
  async getWindowLocation(driver) {
    const {x, y} = await driver
      .manage()
      .window()
      .getRect()
    return {x, y}
  },
  async setWindowLocation(driver, location) {
    await driver
      .manage()
      .window()
      .setRect(location)
  },
  async getWindowSize(driver) {
    const {width, height} = await driver
      .manage()
      .window()
      .getRect()
    return {width, height}
  },
  async setWindowSize(driver, size) {
    await driver
      .manage()
      .window()
      .setRect(size)
  },
  async getOrientation(driver) {
    // return driver.getOrientation()
  },
  async isMobile(driver) {
    const capabilities = await driver.getCapabilities()
    const platformName = capabilities.get('platformName')
    const browserName = capabilities.get('browserName')
    return platformName && ['ANDROID', 'IOS'].includes(platformName.toUpperCase()) && !browserName
  },
  async isAndroid(driver) {
    const capabilities = await driver.getCapabilities()
    const platformName = capabilities.get('platformName')
    return platformName && platformName.toUpperCase() === 'ANDROID'
  },
  async isIOS(driver) {
    const capabilities = await driver.getCapabilities()
    const platformName = capabilities.get('platformName')
    return platformName && platformName.toUpperCase() === 'IOS'
  },
  async getPlatformVersion(driver) {
    return driver.desiredCapabilities.platformVersion
  },
  async getSessionId(driver) {
    const session = await driver.getSession()
    return session.getId()
  },
  async takeScreenshot(driver) {
    return driver.takeScreenshot()
  },
  async getTitle(driver) {
    return driver.getTitle()
  },
  async getUrl(driver) {
    return driver.getCurrentUrl()
  },
  async visit(driver, url) {
    return driver.get(url)
  },
}
