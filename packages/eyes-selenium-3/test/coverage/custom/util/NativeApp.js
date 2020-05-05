'use strict'

const androidCaps = {
  browserName: '',
  platformName: 'Android',
  platformVersion: '8.1',
  deviceName: 'Samsung Galaxy S9 WQHD GoogleAPI Emulator',
  deviceOrientation: 'portrait',
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
  app: 'http://appium.s3.amazonaws.com/ContactManager.apk',
  clearSystemFiles: true,
  noReset: true,
}

const iOSCaps = {
  browserName: '',
  platformName: 'iOS',
  platformVersion: '12.2',
  deviceName: 'iPhone XS Simulator',
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
  app: 'https://applitools.bintray.com/Examples/HelloWorldiOS_1_0.zip',
  clearSystemFiles: true,
  noReset: true,
  NATIVE_APP: true,
  idleTimeout: 200,
}

module.exports = {
  androidCaps: androidCaps,
  iOSCaps: iOSCaps
}
