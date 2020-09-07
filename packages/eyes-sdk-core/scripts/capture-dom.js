'use strict'
const {Builder} = require('selenium-webdriver')
const {captureDom} = require('../test/it/DomCapture/DomCapture_utils')
const {Logger} = require('../')
const filenamify = require('filenamify')
const fs = require('fs')
const path = require('path')

;(async function main() {
  const driver = new Builder()
    .withCapabilities({
      browserName: 'chrome',
      'goog:chromeOptions': {
        debuggerAddress: '127.0.01:9222',
      },
    })
    .usingServer(process.env.CVG_TESTS_REMOTE)
    .build()

  const url = await driver.getCurrentUrl()
  console.log(url)

  const domStr = await captureDom(new Logger(!!process.env.APPLITOOLS_SHOW_LOGS), driver)
  console.log('captured dom of size', domStr.length)
  let obj
  try {
    obj = JSON.parse(domStr)
  } catch (ex) {
    console.log('failed to parse dom str', ex)
  }
  const filepath = path.resolve(__dirname, `${filenamify(url)}.json`)
  console.log('writing result to file', filepath)
  fs.writeFileSync(filepath, obj ? JSON.stringify(obj, null, 2) : domStr)
})().catch(ex => {
  console.log(ex)
  process.exit(1)
})
