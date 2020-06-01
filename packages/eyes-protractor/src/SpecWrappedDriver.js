const ProtractorFrame = require('./ProtractorFrame')
const ProtractorWrappedElement = require('./ProtractorWrappedElement')
const {Builder, Runner} = require('protractor')
// const cmd = require('selenium-webdriver/lib/command')

module.exports = {
  isEqualFrames(leftFrame, rightFrame) {
    return ProtractorFrame.equals(leftFrame, rightFrame)
  },
  createFrameReference(reference) {
    return ProtractorFrame.fromReference(reference)
  },
  createElement(logger, driver, element, selector) {
    return new ProtractorWrappedElement(logger, driver, element, selector)
  },
  toSupportedSelector(selector) {
    return ProtractorWrappedElement.toSupportedSelector(selector)
  },
  toEyesSelector(selector) {
    return ProtractorWrappedElement.toEyesSelector(selector)
  },
  prepareDriver(driver) {
    // cmd.Name.SWITCH_TO_PARENT_FRAME = 'switchToParentFrame'
    // driver
    //   .getExecutor()
    //   .defineCommand(cmd.Name.SWITCH_TO_PARENT_FRAME, 'POST', '/session/:sessionId/frame/parent')
    // return driver
  },
  executeScript(driver, script, ...args) {
    return driver.executeScript(script, ...args)
  },
  sleep(driver, ms) {
    return driver.sleep(ms)
  },
  switchToFrame(driver, reference) {
    return driver.switchTo().frame(reference)
  },
  switchToParentFrame(driver) {
    return driver.schedule(new cmd.Command(cmd.Name.SWITCH_TO_PARENT_FRAME))
  },
  async findElement(driver, selector) {
    try {
      return await driver.$(selector)
    } catch (err) {
      if (err.name === 'NoSuchElementError') return null
      else throw err
    }
  },
  async findElements(driver, selector) {
    return driver.$$(selector)
  },
  async getWindowLocation(driver) {
    const {x, y} = await driver
      .manage()
      .window()
      .getPosition()
    return {x, y}
  },
  async setWindowLocation(driver, location) {
    await driver
      .manage()
      .window()
      .setPosition(location.x, location.y)
  },
  async getWindowSize(driver) {
    const {width, height} = await driver
      .manage()
      .window()
      .getSize()
    return {width, height}
  },
  async setWindowSize(driver, size) {
    await driver
      .manage()
      .window()
      .setSize(size.width, size.height)
  },
  async getOrientation(driver) {
    const capabilities = await driver.getCapabilities()
    const orientation = capabilities.get('orientation') || capabilities.get('deviceOrientation')
    return orientation.toLowerCase()
  },
  async isMobile(driver) {
    const capabilities = await driver.getCapabilities()
    const platformName = capabilities.get('platformName')
    return platformName ? ['android', 'ios'].includes(platformName.toLowerCase()) : false
  },
  async isAndroid(driver) {
    const capabilities = await driver.getCapabilities()
    const platformName = capabilities.get('platformName')
    return platformName ? platformName.toLowerCase() === 'android' : false
  },
  async isIOS(driver) {
    const capabilities = await driver.getCapabilities()
    const platformName = capabilities.get('platformName')
    return platformName ? platformName.toLowerCase() === 'ios' : false
  },
  async isNative(driver) {
    const capabilities = await driver.getCapabilities()
    const platformName = capabilities.get('platformName')
    const browserName = capabilities.get('browserName')
    return platformName
      ? ['android', 'ios'].includes(platformName.toLowerCase()) && !browserName
      : false
  },
  async getPlatformVersion(driver) {
    const capabilities = await driver.getCapabilities()
    return capabilities.get('platformVersion')
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

  /********* for testing purposes */
  async build({capabilities, serverUrl = process.env.CVG_TESTS_REMOTE, logLevel}) {
    const runner = new Runner({
      capabilities,
      seleniumAddress: serverUrl,
      logLevel: logLevel.toUpperCase(),
      allScriptsTimeout: 11000,
      getPageTimeout: 10000,
    })
    const driver = await runner.createBrowser().ready
    driver.by = driver.constructor.By
    driver.waitForAngularEnabled(false)
    return driver
  },

  async cleanup(driver) {
    return driver.quit()
  },

  async click(_driver, el) {
    return el.click()
  },

  async waitUntilDisplayed(driver, selector, timeout) {
    // const el = await this.findElement(driver, selector)
    // return driver.wait(until.elementIsVisible(el), timeout)
  },

  async getElementRect(_driver, el) {
    return el.getRect()
  },
}
