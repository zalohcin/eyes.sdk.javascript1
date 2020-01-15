'use strict'
const {By} = require('selenium-webdriver')
const {getDriver, getEyes} = require('./util/TestSetup')
const {Target, Region, BatchInfo} = require('../../../index')
const appName = 'Test Fluent Api'
describe(appName, () => {
  let setups = [
    // {stitchMode: 'CSS', runnerType: 'classic', title: ''},
    {stitchMode: 'SCROLL', runnerType: 'classic', title: ' (SCROLL)'},
    // {stitchMode: 'SCROLL', runnerType: 'visualGrid', title: ' (VG)'},
  ]
  let batch = new BatchInfo('JS test')
  setups.forEach(function(setup) {
    describe(`Test run ${setup.title}`, () => {
      let webDriver, eyes
      beforeEach(async function() {
        webDriver = await getDriver('CHROME')
        await webDriver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
        let defaults = await getEyes(setup.runnerType, setup.stitchMode)
        eyes = defaults.eyes
        eyes.setBatch(batch)
      })

      afterEach(async function() {
        await eyes.abortIfNotClosed()
        await webDriver.quit()
      })

      it('TestCheckScrollableModal', async function() {
        let driver = await eyes.open(
          webDriver,
          appName,
          `Fluent - Scrollable Modal${setup.title}`,
          {
            width: 800,
            height: 600,
          },
        )
        driver.findElement(By.id('centered')).click()
        let scrollRootLocator = setup.stitchMode === 'CSS' ? 'modal-content' : 'modal1'
        let scrollRootSelector = By.id(scrollRootLocator)
        await eyes.check(
          'Fluent - Scrollable Modal',
          Target.region(By.id('modal-content'))
            .fully()
            .scrollRootElement(scrollRootSelector),
        )
        await eyes.close()
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
          let driver = await eyes.open(webDriver, appName, `${settings.title}${setup.title}`, {
            width: 800,
            height: 600,
          })
          await driver.findElement(By.id(settings.clickableId)).click()
          let frame = await driver.findElement(By.css(settings.IframeSelector))
          await driver.switchTo().frame(frame)
          let element = await driver.findElement(By.css('html'))
          let rect = await element.getRect()
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
            await eyes.check('Check Long Out of bounds Iframe Modal', Target.region(region))
          }
          await eyes.close()
        })
      })
    })
  })
})
