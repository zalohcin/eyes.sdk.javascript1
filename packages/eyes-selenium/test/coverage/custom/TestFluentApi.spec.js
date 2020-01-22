'use strict'
const {By} = require('selenium-webdriver')
const {getDriver, getEyes} = require('./util/TestSetup')
const {Target, Region, BatchInfo, StitchMode} = require('../../../index')
const appName = 'Eyes Selenium SDK - Fluent API'
describe(appName, () => {
  let batch = new BatchInfo('JS test')
  let webDriver, eyes

  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await webDriver.quit()
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

  describe(`Test`, () => {
    beforeEach(async () => {
      webDriver = await getDriver('CHROME')
      await webDriver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
      ;({eyes} = await getEyes('classic', StitchMode.CSS))
      eyes.setBatch(batch)
    })

    it('TestCheckScrollableModal', async () => {
      let driver = await eyes.open(webDriver, appName, `TestCheckScrollableModal`, {
        width: 700,
        height: 460,
      })
      driver.findElement(By.id('centered')).click()
      let scrollRootSelector = By.id('modal-content')
      await eyes.check(
        'TestCheckScrollableModal',
        Target.region(By.id('modal-content'))
          .fully()
          .scrollRootElement(scrollRootSelector),
      )
      await eyes.close()
    })

    longIframes.forEach(settings => {
      it(`${settings.title}`, async () => {
        let driver = await eyes.open(webDriver, appName, `${settings.title}`, {
          width: 700,
          height: 460,
        })
        await driver.findElement(By.id(settings.clickableId)).click()
        let frame = await driver.findElement(By.css(settings.IframeSelector))
        await driver.switchTo().frame(frame)
        let element = await driver.findElement(By.css('html'))
        let rect = await element.getRect()
        await performChecksOnLongRegion(rect, eyes)
        await eyes.close()
      })
    })
  })

  describe(`Test_SCROLL`, () => {
    beforeEach(async () => {
      webDriver = await getDriver('CHROME')
      await webDriver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
      ;({eyes} = await getEyes('classic', StitchMode.SCROLL))
      eyes.setBatch(batch)
    })

    it('TestCheckScrollableModal', async () => {
      let driver = await eyes.open(webDriver, appName, `TestCheckScrollableModal_SCROLL`, {
        width: 700,
        height: 460,
      })
      driver.findElement(By.id('centered')).click()
      let scrollRootSelector = By.id('modal1')
      await eyes.check(
        'TestCheckScrollableModal',
        Target.region(By.id('modal-content'))
          .fully()
          .scrollRootElement(scrollRootSelector),
      )
      await eyes.close()
    })

    longIframes.forEach(settings => {
      it(`${settings.title}`, async () => {
        let driver = await eyes.open(webDriver, appName, `${settings.title}_SCROLL`, {
          width: 700,
          height: 460,
        })
        await driver.findElement(By.id(settings.clickableId)).click()
        let frame = await driver.findElement(By.css(settings.IframeSelector))
        await driver.switchTo().frame(frame)
        let element = await driver.findElement(By.css('html'))
        let rect = await element.getRect()
        await performChecksOnLongRegion(rect, eyes)
        await eyes.close()
      })
    })
  })

  describe(`Test_VG`, () => {
    beforeEach(async () => {
      webDriver = await getDriver('CHROME')
      await webDriver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
      ;({eyes} = await getEyes('VG'))
      eyes.setBatch(batch)
    })

    it('TestCheckScrollableModal', async () => {
      let driver = await eyes.open(webDriver, appName, `TestCheckScrollableModal_VG`, {
        width: 700,
        height: 460,
      })
      driver.findElement(By.id('centered')).click()
      let scrollRootSelector = By.id('modal-content')
      await eyes.check(
        'TestCheckScrollableModal',
        Target.region(By.id('modal-content'))
          .fully()
          .scrollRootElement(scrollRootSelector),
      )
      await eyes.close()
    })

    longIframes.forEach(settings => {
      it(`${settings.title}`, async () => {
        let driver = await eyes.open(webDriver, appName, `${settings.title}_VG`, {
          width: 700,
          height: 460,
        })
        await driver.findElement(By.id(settings.clickableId)).click()
        let frame = await driver.findElement(By.css(settings.IframeSelector))
        await driver.switchTo().frame(frame)
        let element = await driver.findElement(By.css('html'))
        let rect = await element.getRect()
        await performChecksOnLongRegion(rect, eyes)
        await eyes.close()
      })
    })
  })
})

async function performChecksOnLongRegion(rect, eyes) {
  for (let currentY = rect.y, c = 1; currentY < rect.y + rect.height; currentY += 5000, c++) {
    let region
    if (rect.height > currentY + 5000) {
      region = new Region(rect.x, currentY, rect.width, 5000)
    } else {
      region = new Region(rect.x, currentY, rect.width, rect.height - currentY)
    }
    await eyes.check('Check Long Out of bounds Iframe Modal', Target.region(region))
  }
}
