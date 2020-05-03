'use strict'

const assert = require('assert')

const deviceInfoFromInferred = require('../../lib/deviceInfoFromInferred')

describe('deviceInfoFromInferred', function() {
  it('works for desktop', async function() {
    const inferredDeviceInfo = 'chrome:headless'
    const deviceInfo = deviceInfoFromInferred(inferredDeviceInfo)
    assert.strictEqual(deviceInfo, 'Desktop')
  })

  it('works for chrome device emulation', async function() {
    const inferredDeviceInfo = 'chrome:emulation:device=iphone X'
    const deviceInfo = deviceInfoFromInferred(inferredDeviceInfo)
    assert.strictEqual(deviceInfo, 'iphone X (Chrome emulation)')
  })

  it('works for no device chrome emulation', async function() {
    const inferredDeviceInfo =
      'chrome:emulation:width=100;height=200;mobile=true;orientation=vertical;touch=true'
    const deviceInfo = deviceInfoFromInferred(inferredDeviceInfo)
    assert.strictEqual(deviceInfo, 'Chrome emulation')
  })

  it('treating remote browser services as unknown', async function() {
    let inferredDeviceInfo = 'browserstack:iPhone XS'
    let deviceInfo = deviceInfoFromInferred(inferredDeviceInfo)
    assert.strictEqual(deviceInfo, undefined)

    inferredDeviceInfo = 'saucelabs:iPhone XS Simulator@13.0'
    deviceInfo = deviceInfoFromInferred(inferredDeviceInfo)
    assert.strictEqual(deviceInfo, undefined)
  })
})
