'use strict'
const {getDriver, getEyes} = require('./util/TestSetup')
const {By} = require('selenium-webdriver')
const {BatchInfo, Region, Target} = require('../../../index')
const appName = 'Test Fluent Api Frames'
describe(appName, () => {
  let setups = [
    // {stitchMode: 'CSS', runnerType: 'classic', title: ''},
    {stitchMode: 'SCROLL', runnerType: 'classic', title: ' (SCROLL)'},
    // {stitchMode: 'SCROLL', runnerType: 'visualGrid', title: ' (VG)'},
  ]
  let batch = new BatchInfo('JS test')
  setups.forEach(function(setup) {
    describe(`Test run ${setup.title}`, () => {
      let driver, eyes
      beforeEach(async function() {
        driver = await getDriver('CHROME')
        await driver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
        let defaults = await getEyes(setup.runnerType, setup.stitchMode)
        eyes = defaults.eyes
        eyes.setBatch(batch)
      })

      afterEach(async function() {
        await eyes.abortIfNotClosed()
        await driver.quit()
      })

      let longIframes = [
        {
          clickableId: 'hidden_click',
          IframeSelector: '#modal3 iframe',
          title: 'TestCheckLongOutOfBoundsIFrameModal',
        },
        {
          clickableId: 'stretched',
          IframeSelector: '#modal2 iframe',
          title: 'TestCheckLongIFrameModal',
        },
      ]
      longIframes.forEach(settings => {
        it(`${settings.title}`, async function() {
          await driver.findElement(By.id(settings.clickableId)).click()
          let frame = await driver.findElement(By.css(settings.IframeSelector))
          await driver.switchTo().frame(frame)
          let element = await driver.findElement(By.css('html'))
          let rect = await element.getRect()
          let regions = []
          for (
            let currentY = rect.y, c = 1;
            currentY < rect.y + rect.height;
            currentY += 5000, c++
          ) {
            let region
            if (rect.height > currentY + 5000) {
              region = new Region(rect.x, currentY, rect.width, 5000)
            } else {
              region = new Region(rect.x, currentY, rect.width, rect.height - currentY)
            }
            regions.push(Target.region(region))
          }
          await eyes.open(driver, appName, `${settings.title}${setup.title}`, {
            width: 800,
            height: 600,
          })
          //TODO check with Dave how to pass multiple regions to the check method
          // await eyes.check('Check Long Out of bounds Iframe Modal', regions)
          await eyes.close()
        })
      })
    })
  })
})
