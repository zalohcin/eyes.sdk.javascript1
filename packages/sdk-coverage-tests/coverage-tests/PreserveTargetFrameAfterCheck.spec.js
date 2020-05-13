'use strict'

const path = require('path')
const cwd = process.cwd()
const assert = require('assert')
const {By, BatchInfo} = require(cwd)
const CustomTestController = require(path.resolve(cwd, 'test/util/CustomTestController'))

describe('PreserveTargetFrameAfterCheck', () => {
  const test = new CustomTestController()
  const batch = new BatchInfo('PreserveTargetFrameAfterCheck')

  async function getDocumentElement() {
    return test.executeScript('return window.document')
  }

  before(async () => {
    await test.setup({
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['disable-infobars', 'headless'],
        },
      },
      batch,
      hideScrollbars: true,
    })
    await test.visit('https://applitools.github.io/demo/TestPages/FramesAndRegionsPage/')
  })

  beforeEach(async () => {
    await test.switchToFrame(null)
  })

  afterEach(async () => {
    await test.abort()
  })

  after(async () => {
    await test.cleanup()
  })

  it('CheckWindow_WrappedDriver', async function() {
    const driver = await test.open({appName: this.test.parent.title, testName: this.test.title})
    await test.switchToFrame(By.name('frame-main'), driver)

    const frameElementBeforeCheck = await getDocumentElement()
    await test.checkWindow()
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return test.close()
  })

  it('CheckWindow_UnwrappedDriver', async function() {
    await test.open({appName: this.test.parent.title, testName: this.test.title})
    await test.switchToFrame(By.name('frame-main'))

    const frameElementBeforeCheck = await getDocumentElement()
    await test.checkWindow()
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return test.close()
  })

  it('CheckNestedFrame_WrappedDriver', async function() {
    const driver = await test.open({appName: this.test.parent.title, testName: this.test.title})
    await test.switchToFrame(By.name('frame-main'), driver)

    const frameElementBeforeCheck = await getDocumentElement()
    await test.checkFrame(['frame-comb', 'frame-image'])
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return test.close()
  })

  it('CheckNestedFrame_UnwrappedDriver', async function() {
    await test.open({appName: this.test.parent.title, testName: this.test.title})
    await test.switchToFrame(By.name('frame-main'))

    const frameElementBeforeCheck = await getDocumentElement()
    await test.checkFrame(['frame-comb', 'frame-image'])
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return test.close()
  })

  it('CheckRegionInsideFrameBySelector_WrappedDriver', async function() {
    const driver = await test.open({appName: this.test.parent.title, testName: this.test.title})
    await test.switchToFrame(By.name('frame-main'), driver)
    await test.switchToFrame(By.name('frame-comb'), driver)
    await test.switchToFrame(By.name('frame-image'), driver)

    const frameElementBeforeCheck = await getDocumentElement()
    await test.checkRegion(By.id('image'))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return test.close()
  })

  it('CheckRegionInsideFrameBySelector_UnwrappedDriver', async function() {
    await test.open({appName: this.test.parent.title, testName: this.test.title})
    await test.switchToFrame(By.name('frame-main'))
    await test.switchToFrame(By.name('frame-comb'))
    await test.switchToFrame(By.name('frame-image'))

    const frameElementBeforeCheck = await getDocumentElement()
    await test.checkRegion(By.id('image'))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return test.close()
  })

  it('CheckRegionInsideFrameByElement_WrappedDriver', async function() {
    const driver = await test.open({appName: this.test.parent.title, testName: this.test.title})
    await test.switchToFrame(By.name('frame-main'), driver)
    await test.switchToFrame(By.name('frame-comb'), driver)
    await test.switchToFrame(By.name('frame-image'), driver)

    const element = await test.findElement(By.id('image'))

    const frameElementBeforeCheck = await getDocumentElement()
    await test.checkRegion(element)
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return test.close()
  })

  it('CheckRegionInsideFrameByElement_UnwrappedDriver', async function() {
    await test.open({appName: this.test.parent.title, testName: this.test.title})
    await test.switchToFrame(By.name('frame-main'))
    await test.switchToFrame(By.name('frame-comb'))
    await test.switchToFrame(By.name('frame-image'))

    const element = await test.findElement(By.id('image'))

    const frameElementBeforeCheck = await getDocumentElement()
    await test.checkRegion(element)
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return test.close()
  })

  it('CheckFrameFully_WrappedDriver', async function() {
    const driver = await test.open({appName: this.test.parent.title, testName: this.test.title})
    await test.switchToFrame(By.name('frame-main'), driver)
    await test.switchToFrame(By.name('frame-comb'), driver)

    const frameElementBeforeCheck = await getDocumentElement()
    await test.checkFrame('frame-image', {isFully: true})
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return test.close()
  })

  it('CheckFrameFully_UnwrappedDriver', async function() {
    await test.open({appName: this.test.parent.title, testName: this.test.title})
    await test.switchToFrame(By.name('frame-main'))
    await test.switchToFrame(By.name('frame-comb'))

    const frameElementBeforeCheck = await getDocumentElement()
    await test.checkFrame('frame-image', {isFully: true})
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return test.close()
  })

  it('CheckCORSFrameRegionBySelector_WrappedDriver', async function() {
    const driver = await test.open({appName: this.test.parent.title, testName: this.test.title})
    await test.switchToFrame('frame-main', driver)
    await test.switchToFrame('frame-cors', driver)

    const frameElementBeforeCheck = await getDocumentElement()
    await test.checkRegion(By.id('login-form'))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return test.close()
  })

  it('CheckCORSFrameRegionBySelector_UnwrappedDriver', async function() {
    await test.open({appName: this.test.parent.title, testName: this.test.title})
    await test.switchToFrame('frame-main')
    await test.switchToFrame('frame-cors')

    const frameElementBeforeCheck = await getDocumentElement()
    await test.checkRegion(By.id('login-form'))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return test.close()
  })

  it('CheckCORSFrameRegionByElement_WrappedDriver', async function() {
    const driver = await test.open({appName: this.test.parent.title, testName: this.test.title})
    await test.switchToFrame('frame-main', driver)
    await test.switchToFrame('frame-cors', driver)

    const element = await test.findElement(By.id('login-form'))

    const frameElementBeforeCheck = await getDocumentElement()
    await test.checkRegion(element)
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return test.close()
  })

  it('CheckCORSFrameRegionByElement_UnwrappedDriver', async function() {
    await test.open({appName: this.test.parent.title, testName: this.test.title})
    await test.switchToFrame('frame-main')
    await test.switchToFrame('frame-cors')

    const element = await test.findElement(By.id('login-form'))

    const frameElementBeforeCheck = await getDocumentElement()
    await test.checkRegion(element)
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return test.close()
  })
})
