const {EyesWebElement} = require('../../../lib/wrappers/EyesWebElement')
const assert = require('assert')

const fakeEyesDriver = {
  getRemoteWebDriver: () => {},
}
const fakeLogger = () => {}
const fakeWebElement = {
  getId: () => {},
}

// TODO: mocking for WebElement for better control
describe('EyesWebElement', () => {
  it('should getRect of zeros if getRect from selenium-webdriver fails', async () => {
    const el = new EyesWebElement(fakeLogger, fakeEyesDriver, fakeWebElement)
    assert.deepStrictEqual(await el.getRect(), {width: 0, height: 0, x: 0, y: 0})
  })
})
