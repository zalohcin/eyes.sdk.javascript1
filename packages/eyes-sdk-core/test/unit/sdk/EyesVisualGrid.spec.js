'use strict'

const assert = require('assert')
const {EyesVisualGrid} = require('../../utils/FakeSDK')

describe('EyesVisualGrid', () => {
  describe('getBrowserSize(browser)', () => {
    let eyes

    before(async () => {
      eyes = new EyesVisualGrid()
      eyes._serverConnector.getEmulatedDevicesSizes = async () => {
        return {
          emulated1: {portrait: {width: 1, height: 11}, landscape: {width: 11, height: 1}},
          emulated2: {portrait: {width: 2, height: 22}, landscape: {width: 22, height: 2}},
        }
      }
      eyes._serverConnector.getIosDevicesSizes = async () => {
        return {
          ios1: {portrait: {width: 10, height: 110}, landscape: {width: 110, height: 10}},
        }
      }
    })

    it('works with desktop browser', async () => {
      const browser = {name: 'browser1', width: 3, height: 33}
      assert.deepStrictEqual(await eyes.getBrowserSize(browser), {width: 3, height: 33})
    })

    it('works with emulated device syntax', async () => {
      const device1 = {deviceName: 'emulated1'}
      assert.deepStrictEqual(await eyes.getBrowserSize(device1), {width: 1, height: 11})
      const device1Portrait = {deviceName: 'emulated1', screenOrientation: 'portrait'}
      assert.deepStrictEqual(await eyes.getBrowserSize(device1Portrait), {width: 1, height: 11})
      const device1Landscape = {deviceName: 'emulated1', screenOrientation: 'landscape'}
      assert.deepStrictEqual(await eyes.getBrowserSize(device1Landscape), {width: 11, height: 1})
      const device2 = {chromeEmulationInfo: {deviceName: 'emulated2'}}
      assert.deepStrictEqual(await eyes.getBrowserSize(device2), {width: 2, height: 22})
      const device2Portrait = {
        chromeEmulationInfo: {deviceName: 'emulated2', screenOrientation: 'portrait'},
      }
      assert.deepStrictEqual(await eyes.getBrowserSize(device2Portrait), {width: 2, height: 22})
      const device2Landscape = {
        chromeEmulationInfo: {deviceName: 'emulated2', screenOrientation: 'landscape'},
      }
      assert.deepStrictEqual(await eyes.getBrowserSize(device2Landscape), {width: 22, height: 2})
    })

    it('works with ios device syntax', async () => {
      const device1 = {iosDeviceInfo: {deviceName: 'ios1'}}
      assert.deepStrictEqual(await eyes.getBrowserSize(device1), {width: 10, height: 110})
      const device1Portrait = {
        iosDeviceInfo: {deviceName: 'ios1', screenOrientation: 'portrait'},
      }
      assert.deepStrictEqual(await eyes.getBrowserSize(device1Portrait), {width: 10, height: 110})
      const device1Landscape = {
        iosDeviceInfo: {deviceName: 'ios1', screenOrientation: 'landscape'},
      }
      assert.deepStrictEqual(await eyes.getBrowserSize(device1Landscape), {width: 110, height: 10})
    })
  })
})
