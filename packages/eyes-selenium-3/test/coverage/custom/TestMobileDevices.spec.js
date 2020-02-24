'use strict'
const {Eyes, Target, StitchMode, ConsoleLogHandler} = require('../../../index')
const {Builder} = require('selenium-webdriver')
const {sauceUrl, batch} = require('./util/TestSetup')
const sauceCaps = {
  browserName: 'safari',
  platformName: 'iOS',
  platformVersion: '11.0',
  deviceName: 'iPad Air 2 Simulator',
  deviceOrientation: 'portrait',
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
  idleTimeout: 360,
}

let getDeviceEmulationCaps = mobileEmulation => ({
  browserName: 'chrome',
  'goog:chromeOptions': {
    mobileEmulation: mobileEmulation,
  },
})
let data = [
  {
    mobileEmulation: {
      deviceMetrics: {width: 512, height: 352, pixelRatio: 4},
      userAgent:
        'Mozilla/5.0 (iPad; CPU OS 11_0_1 like Mac OS X) AppleWebKit/604.2.10 (KHTML, like Gecko) Version/11.0 Mobile/15A8401 Safari/604.1',
    },
    name: 'iPad Air 2 Simulator 10.3 Landscape',
    orientation: 'landScape',
  },
  {
    mobileEmulation: {
      deviceMetrics: {width: 512, height: 349, pixelRatio: 4},
      userAgent:
        'Mozilla/5.0 (iPad; CPU OS 11_0_1 like Mac OS X) AppleWebKit/604.2.10 (KHTML, like Gecko) Version/11.0 Mobile/15A8401 Safari/604.1',
    },
    name: 'iPad Air 2 Simulator 12.0 Landscape',
    orientation: 'landScape',
  },
  {
    mobileEmulation: {
      deviceMetrics: {width: 512, height: 333, pixelRatio: 4},
      userAgent:
        'Mozilla/5.0 (iPad; CPU OS 11_0_1 like Mac OS X) AppleWebKit/604.2.10 (KHTML, like Gecko) Version/11.0 Mobile/15A8401 Safari/604.1',
    },
    name: 'iPad Air 2 Simulator 11.3 Landscape',
    orientation: 'landScape',
  },
  {
    mobileEmulation: {
      deviceMetrics: {width: 768, height: 960, pixelRatio: 2},
      userAgent:
        'Mozilla/5.0 (iPad; CPU OS 10_3 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E269 Safari/602.1',
    },
    name: 'iPad Air 2 Simulator 10.3 Portrait',
    orientation: 'portrait',
  },
  {
    mobileEmulation: {
      deviceMetrics: {width: 768, height: 954, pixelRatio: 2},
      userAgent:
        'Mozilla/5.0 (iPad; CPU OS 10_3 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E269 Safari/602.1',
    },
    name: 'iPad Air 2 Simulator 11.0 Portrait',
    orientation: 'portrait',
  },
]

describe('TestMobileDevices', () => {
  let page = ['mobile', 'desktop', 'scrolled_mobile']
  page.forEach(page => {
    describe(`${page}`, () => {
      data.forEach(device => {
        it('testChromeEmulation', async () => {
          let webDriver, eyes
          try {
            webDriver = await new Builder()
              .withCapabilities(getDeviceEmulationCaps(device.mobileEmulation))
              .build()
            eyes = new Eyes()
            eyes.setBatch(batch)
            eyes.setSaveNewTests(false)
            eyes.StitchMode = StitchMode.CSS
            eyes.addProperty('Orientation', device.orientation)
            eyes.addProperty('Page', page)
            eyes.setLogHandler(new ConsoleLogHandler(true))
            webDriver.get(
              `https://applitools.github.io/demo/TestPages/DynamicResolution/${page}.html`,
            )
            await eyes.open(
              webDriver,
              'Eyes Selenium SDK - iOS Safari Cropping',
              `${device.name} ${page} fully`,
            )
            await eyes.check('step 1', Target.window().fully())
            await eyes.close()
          } finally {
            await webDriver.quit()
            await eyes.abortIfNotClosed()
          }
        })
      })
    })
  })

  it('testSauce', async () => {
    let webDriver, eyes
    try {
      webDriver = await new Builder()
        .withCapabilities(sauceCaps)
        .usingServer(sauceUrl)
        .build()
      let page = 'mobile'
      eyes = new Eyes()
      eyes.setBatch(batch)
      eyes.setSaveNewTests(false)
      eyes.StitchMode = StitchMode.CSS
      eyes.addProperty('Orientation', 'portrait')
      eyes.addProperty('Page', page)
      eyes.setLogHandler(new ConsoleLogHandler(true))
      webDriver.get(`https://applitools.github.io/demo/TestPages/DynamicResolution/${page}.html`)
      await eyes.open(
        webDriver,
        'Eyes Selenium SDK - iOS Safari Cropping',
        'iPad Air 2 Simulator 10.3 Portrait mobile fully',
      )
      await eyes.check('step 1', Target.window().fully())
      await eyes.close()
    } finally {
      await webDriver.quit()
      await eyes.abortIfNotClosed()
    }
  })
})
