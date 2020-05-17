const {EyesWrappedDriver} = require('../../index')
const FakeWrappedElement = require('./FakeWrappedElement')
const FakeFrame = require('./FakeFrame')

module.exports = EyesWrappedDriver.specialize({
  executeScript(driver, script, ...args) {
    return driver.executeScript(script, args)
  },
  findElement(driver, selector) {
    return driver.findElement(selector)
  },
  findElements(driver, selector) {
    return driver.findElements(selector)
  },
  switchToFrame(driver, reference) {
    return driver.switchToFrame(reference)
  },
  switchToParentFrame(driver) {
    return driver.switchToParentFrame()
  },
  isEqualFrames(leftFrame, rightFrame) {
    return FakeFrame.equals(leftFrame, rightFrame)
  },
  createFrameReference(reference) {
    return FakeFrame.fromReference(reference)
  },
  createElement(logger, driver, element, selector) {
    return new FakeWrappedElement(logger, driver, element, selector)
  },
})
