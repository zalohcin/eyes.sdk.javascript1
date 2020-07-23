const {TypeUtils} = require('../../index')

module.exports = {
  isDriver(driver) {
    return driver.constructor.name === 'MockDriver'
  },
  isElement(element) {
    return TypeUtils.has(element, 'id')
  },
  isSelector(selector) {
    return TypeUtils.isString(selector) || TypeUtils.has(selector, ['using', 'value'])
  },
  isEqualElements(_driver, element1, element2) {
    return element1.id === element2.id
  },
  toFrameworkSelector(selector) {
    return selector.toString()
  },
  executeScript(driver, script, ...args) {
    return driver.executeScript(script, args)
  },
  findElement(driver, selector) {
    return driver.findElement(selector)
  },
  findElements(driver, selector) {
    return driver.findElements(selector)
  },
  mainContext(driver) {
    return driver.switchToFrame(null)
  },
  parentContext(driver) {
    return driver.switchToParentFrame()
  },
  childContext(driver, reference) {
    return driver.switchToFrame(reference)
  },
  takeScreenshot(driver) {
    return driver.takeScreenshot()
  },
  isNative(driver) {
    return driver._isNative
  },
  isMobile(driver) {
    return driver._isMobile
  },
  getSessionId() {
    return 'session-id'
  },
  async getWindowRect(driver) {
    const rect = await driver.getWindowRect()
    return rect
  },
  async setWindowRect(driver, rect) {
    await driver.setWindowRect(rect)
  },
  async getUrl(driver) {
    return driver.getUrl()
  },
  async getTitle(driver) {
    return driver.getTitle()
  },
  async visit(driver, url) {
    await driver.visit(url)
  },
}
