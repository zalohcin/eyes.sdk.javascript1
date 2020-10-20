const assert = require('assert')
const spec = require('../../src/spec-driver')

describe.skip('spec driver', async () => {
  const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'
  describe('onscreen desktop (@webdriver)', async () => {
    before(function(_driver, done) {
      //;[driver, destroyDriver] = await spec.build({browser: 'chrome', headless: false})
      done()
    })
    after(function(_driver, done) {
      //await destroyDriver()
      done()
    })
    it.skip('getWindowRect()', function(_driver) {})
    it.skip('setWindowRect({x, y, width, height})', function(_driver) {
      //setWindowRect({
      //  input: {x: 0, y: 0, width: 510, height: 511},
      //  expected: {x: 0, y: 0, width: 510, height: 511},
      //}),
    })
    it.skip('setWindowRect({x, y})', function(_driver) {
      //setWindowRect({
      //  input: {x: 11, y: 12},
      //  expected: {x: 11, y: 12, width: 510, height: 511},
      //}),
    })
    it.skip('setWindowRect({width, height})', function(_driver) {
      //setWindowRect({
      //  input: {width: 551, height: 552},
      //  expected: {x: 11, y: 12, width: 551, height: 552},
      //}),
    })
  })
  //function getWindowRect() {
  //  return async () => {
  //    const {x, y} = await driver
  //      .manage()
  //      .window()
  //      .getPosition()
  //    const {width, height} = await driver
  //      .manage()
  //      .window()
  //      .getSize()
  //    const rect = {x, y, width, height}
  //    const result = await spec.getWindowRect(driver)
  //    assert.deepStrictEqual(result, rect)
  //  }
  //}
  //function setWindowRect({input, expected} = {}) {
  //  return async () => {
  //    await spec.setWindowRect(driver, input)
  //    const {x, y} = await driver
  //      .manage()
  //      .window()
  //      .getPosition()
  //    const {width, height} = await driver
  //      .manage()
  //      .window()
  //      .getSize()
  //    const rect = {x, y, width, height}
  //    assert.deepStrictEqual(rect, expected)
  //  }
  //}
})
