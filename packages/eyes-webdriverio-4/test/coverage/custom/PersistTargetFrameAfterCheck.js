'use strict'

const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')
const assert = require('assert')
const {Eyes, Target, By} = require('../../../index')

describe('PersistTargetFrameAfterCheck', () => {
  let browser, eyes

  async function getFrameElement(browser) {
    const {value: element} = await browser.execute('return window.frameElement')
    return element
  }

  before(async () => {
    await chromedriver.start([], true)
  })

  beforeEach(async () => {
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
    eyes = new Eyes()
    eyes.setHideScrollbars(true)
  })

  afterEach(async () => {
    await browser.end()
    await eyes.abort()
  })

  after(async () => {
    chromedriver.stop()
  })

  it('should persist target frame with eyes driver', async function() {
    await browser.url('https://applitools.github.io/demo/TestPages/FramesAndRegionsPage/')

    const driver = await eyes.open(browser, this.test.parent.title, this.test.title)
    await driver.switchTo().frame('frame-main')

    const frameElementBeforeCheck = await getFrameElement(browser)
    await eyes.check('frame inside a frame', Target.frame('frame-comb').frame('frame-image'))
    const frameElementAfterCheck = await getFrameElement(browser)

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close(false)
  })

  it('should persist target frame with wdio driver', async function() {
    await browser.url('https://applitools.github.io/demo/TestPages/FramesAndRegionsPage/')

    await eyes.open(browser, this.test.parent.title, this.test.title)
    await browser.frame('frame-main')

    const frameElementBeforeCheck = await getFrameElement(browser)
    await eyes.check('nested frames', Target.frame('frame-comb').frame('frame-image'))
    const frameElementAfterCheck = await getFrameElement(browser)

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close(false)
  })

  it('should persist target frame with wdio driver after check region', async function() {
    await browser.url('https://applitools.github.io/demo/TestPages/FramesAndRegionsPage/')

    await eyes.open(browser, this.test.parent.title, this.test.title)
    await browser.frame('frame-main')

    const frameElementBeforeCheck = await getFrameElement(browser)
    await eyes.check(
      'nested frames',
      Target.frame('frame-comb')
        .frame('frame-image')
        .region(By.id('image')),
    )
    const frameElementAfterCheck = await getFrameElement(browser)

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close(false)
  })

  it('should persist target frame with wdio driver after check frame fully', async function() {
    await browser.url('https://applitools.github.io/demo/TestPages/FramesAndRegionsPage/')

    await eyes.open(browser, this.test.parent.title, this.test.title)
    await browser.frame('frame-main')

    const frameElementBeforeCheck = await getFrameElement(browser)
    await eyes.check(
      'nested frames',
      Target.frame('frame-comb')
        .frame('frame-image')
        .fully(),
    )
    const frameElementAfterCheck = await getFrameElement(browser)

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close(false)
  })
})
