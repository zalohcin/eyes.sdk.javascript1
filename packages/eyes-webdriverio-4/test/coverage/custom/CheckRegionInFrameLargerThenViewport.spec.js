'use strict'

const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')
const {Eyes, Target} = require('../../../index')

describe('CheckRegionInFrameLargerThenViewport', () => {
  let browser, eyes, batch

  before(async () => {
    await chromedriver.start([], true)
    browser = remote({
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['disable-infobars', 'headless'],
        },
      },
      logLevel: 'error',
      port: 9515,
      path: '/',
    })
    await browser.init()
  })

  beforeEach(async () => {
    await browser.frame(null)
    eyes = new Eyes()
    eyes.setHideScrollbars(true)
    eyes.setBatch(batch)
  })

  afterEach(async () => {
    await eyes.abort()
  })

  after(async () => {
    await browser.end()
    chromedriver.stop()
  })

  it('CheckRegionInFrameLargerThenViewport', async function() {
    eyes.setStitchMode('CSS')
    await browser.url('https://applitools-test-out-of-viewport.surge.sh')
    await eyes.open(browser, this.test.parent.title, this.test.title)
    await eyes.check(
      'region in frame fully',
      Target.frame('frame-list')
        .region('#list')
        .fully(),
    )
    return eyes.close()
  })

  it('CheckRegionInFrameLargerThenViewport_Scroll', async function() {
    await browser.url('https://applitools-test-out-of-viewport.surge.sh')
    await eyes.open(browser, this.test.parent.title, this.test.title)
    await eyes.check(
      'region in frame fully',
      Target.frame('frame-list')
        .region('#list')
        .fully(),
    )
    return eyes.close()
  })
})
