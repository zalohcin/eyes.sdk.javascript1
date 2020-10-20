const assert = require('assert')
const spec = require('../../src/spec-driver')

describe('spec driver', async () => {
  const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'

  describe('mobile driver (@mobile)', async () => {
    before(function(_driver, done) {
      //;[driver, destroyDriver] = await spec.build({browser: 'chrome', device: 'Pixel 3a XL'})
      done()
    })
    after(function(_driver, done) {
      //await destroyDriver()
      done()
    })
    it.skip('isMobile()', function(_driver) {
      //isMobile({expected: true}
    })
    it.skip('getDeviceName()', function(_driver) {
      //getDeviceName({expected: 'Google Pixel 3a XL GoogleAPI Emulator'})
    })
    it.skip('getPlatformName()', function(_driver) {
      //getPlatformName({expected: 'Android'})
    })
    it.skip('isNative()', function(_driver) {
      //isNative({expected: false})
    })
    it.skip('getOrientation()', function(_driver) {
      //getOrientation({expected: 'portrait'})
    })
    it.skip('getPlatformVersion()', function(_driver) {
      //getPlatformVersion({expected: '10'})
    })
  })
  //function getOrientation({expected} = {}) {
  //  return async () => {
  //    const result = await spec.getOrientation(driver)
  //    assert.strictEqual(result, expected)
  //  }
  //}
  //function isNative({expected} = {}) {
  //  return async () => {
  //    const {isNative} = await spec.getDriverInfo(driver)
  //    assert.strictEqual(isNative, expected)
  //  }
  //}
  //function getDeviceName({expected} = {}) {
  //  return async () => {
  //    const {deviceName} = await spec.getDriverInfo(driver)
  //    assert.strictEqual(deviceName, expected)
  //  }
  //}
  //function getPlatformName({expected} = {}) {
  //  return async () => {
  //    const {platformName} = await spec.getDriverInfo(driver)
  //    assert.strictEqual(platformName, expected)
  //  }
  //}
  //function getPlatformVersion({expected} = {}) {
  //  return async () => {
  //    const {platformVersion} = await spec.getDriverInfo(driver)
  //    assert.strictEqual(platformVersion, expected)
  //  }
  //}
})
