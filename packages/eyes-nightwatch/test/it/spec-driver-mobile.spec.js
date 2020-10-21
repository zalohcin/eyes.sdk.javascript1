const assert = require('assert')
const spec = require('../../src/spec-driver')
const returnFake = true

// TODO: test against iOS
describe('spec driver', async () => {
  describe('mobile driver (@mobile)', async () => {
    before(function(_driver, done) {
      done()
    })
    after(function(driver, done) {
      return driver.end(function() {
        done()
      })
    })
    it('isMobile()', function(driver) {
      const {isMobile} = spec.getDriverInfo(driver, {returnFake})
      assert.ok(isMobile)
    })
    it('getDeviceName()', function(driver) {
      const {deviceName} = spec.getDriverInfo(driver, {returnFake})
      assert.deepStrictEqual(deviceName, 'google pixel 2')
    })
    it('getPlatformName()', function(driver) {
      const {platformName} = spec.getDriverInfo(driver, {returnFake})
      assert.deepStrictEqual(platformName, 'Android')
    })
    // TODO: test on Sauce
    it('getPlatformVersion()', function(driver) {
      const {platformVersion} = spec.getDriverInfo(driver, {returnFake})
      assert.deepStrictEqual(platformVersion, '9.0')
    })
    // TODO: test w/ orientation set on BS (fake captured w/o it)
    // TODO: test on Sauce
    it('getOrientation()', function(driver) {
      const result = spec.getOrientation(driver, {returnFake})
      assert.strictEqual(result, 'portrait')
    })
    it('isNative()', function(driver) {
      const {isNative} = spec.getDriverInfo(driver, {returnFake})
      assert.strictEqual(isNative, true)
    })
  })
})
