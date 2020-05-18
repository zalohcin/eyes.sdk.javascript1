// re: https://trello.com/c/EQD3JUOf
const {remote} = require('webdriverio')
const {By, Eyes, Target, StitchMode} = require('../../..')

describe('JS Coverage Tests - WDIO5', async () => {
  let eyes
  let browser

  before(async () => {
    const browserOptions = {
      saucelabs: {
        host: 'ondemand.saucelabs.com',
        hostname: 'ondemand.saucelabs.com',
        port: 80,
        path: '/wd/hub',
        capabilities: {
          browserName: 'internet explorer',
          browserVersion: '11.285',
          platformName: 'Windows 10',
          //seleniumVersion: '3.141.59',
          'sauce:options': {
            screenResolution: '1920x1080',
            username: process.env.SAUCE_USERNAME,
            accesskey: process.env.SAUCE_ACCESS_KEY,
          },
        },
      },
      browserStack: {
        host: 'hub-cloud.browserstack.com',
        user: process.env.BROWSERSTACK_USERNAME,
        key: process.env.BROWSERSTACK_ACCESS_KEY,
        capabilities: {
          browserName: 'IE',
          browserVersion: '11.0',
          'browserstack.selenium_version': '3.141.59',
          'bstack:options': {
            os: 'Windows',
            osVersion: '10',
            projectName: 'SDK Coverage Tests',
            debug: 'true',
            resolution: '1920x1080',
            networkLogs: 'true',
            consoleLogs: 'verbose',
            //idleTimeout: 300,
            ie: {
              noFlash: 'true',
              driver: '3.141.59',
              enablePopups: 'true',
            },
          },
        },
      },
    }
    browser = await remote(browserOptions.browserStack)
    eyes = new Eyes()
  })

  after(async () => {
    await browser.deleteSession()
    await eyes.abortIfNotClosed()
  })

  it('works', async function() {
    eyes.setMatchLevel('Layout')
    eyes.setStitchMode(StitchMode.CSS)
    eyes.setMatchTimeout(0)
    eyes.setStitchOverlap(60)
    await browser.url('https://www.softwareadvice.com/hr/rippling-profile/?automated=true')
    await browser.pause(5000) // to wait for window maximize
    await eyes.open(
      browser,
      this.test.parent.title,
      'Check Window Fully with CSS Stitching on IE 11',
    )
    await eyes.check(
      undefined,
      Target.window()
        .fully()
        .scrollRootElement(By.css('body')),
    )
    await eyes.close(true)
  })
})
