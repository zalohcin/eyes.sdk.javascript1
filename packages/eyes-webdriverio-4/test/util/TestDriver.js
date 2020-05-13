'use strict'
const {remote} = require('webdriverio')

async function TestDriver({capabilities}) {
  const driver = remote({
    logLevel: 'error',
    desiredCapabilities: capabilities,
  })
  await driver.init()

  return {
    driver,
    visit,
    findElement,
    executeScript,
    switchToFrame,
    scrollDown,
    type,
    cleanup,
  }

  function visit(url) {
    return driver.url(url)
  }

  async function findElement(selector) {
    return driver.element(selector)
  }

  async function executeScript(script, args = [], anotherDriver = driver) {
    const {value} = await anotherDriver.execute(script, ...args)
    return value
  }

  async function switchToFrame(selector, anotherDriver = driver) {
    let frame = null
    if (selector) {
      const {value} = await anotherDriver.$(selector)
      frame = value
    }
    await driver.frame(frame)
  }

  async function scrollDown(pixels) {
    await driver.execute(`window.scrollBy(0, ${pixels})`)
  }

  async function type(selector, text) {
    await driver.setValue(selector, text)
  }

  async function cleanup() {
    await driver.end()
  }
}

module.exports = TestDriver
