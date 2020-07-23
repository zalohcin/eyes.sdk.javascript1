'use strict'
const path = require('path')
const cwd = process.cwd()
const spec = require(path.resolve(cwd, 'src/SpecWrappedDriver'))
const appName = 'Eyes Selenium SDK - Classic API'

async function TestCheckInnerFrame({testName, eyes, driver}) {
  eyes.setHideScrollbars(false)
  driver = await eyes.open(driver, appName, testName, {
    width: 700,
    height: 460,
  })
  await spec.executeScript(driver, scrollTop)
  let frame = await spec.findElement(driver, '[name="frame1"]')
  await spec.switchToFrame(driver, frame)
  await eyes.checkFrame('frame1-1')
  await eyes.checkWindow('window after check frame')
  let innerFrameBody = await spec.findElement(driver, 'body')
  await spec.executeScript(driver, makeItRed, innerFrameBody)
  await eyes.checkWindow('window after change background color of inner frame')
  await eyes.close()
}
function scrollTop() {
  // eslint-disable-next-line no-undef
  document.documentElement.scrollTop = 350
}
function makeItRed() {
  arguments[0].style.background = 'red'
}

module.exports = {
  TestCheckInnerFrame,
}
