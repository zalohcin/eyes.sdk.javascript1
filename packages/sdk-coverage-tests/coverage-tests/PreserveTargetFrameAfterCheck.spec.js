'use strict'

const path = require('path')
const cwd = process.cwd()
const assert = require('assert')
const {getEyes, Browsers} = require('./utils/TestSetup')
const TestDriver = require(path.resolve(cwd, 'test/util/TestDriver'))
const {Target} = require(cwd)

describe('PreserveTargetFrameAfterCheck', () => {
  let testDriver, eyes

  async function getDocumentElement() {
    return testDriver.executeScript('return window.document')
  }

  before(async () => {
    testDriver = await TestDriver({capabilities: Browsers.CHROME})
    eyes = getEyes().eyes
    eyes.setHideScrollbars(true) // why is this not default?
    await testDriver.visit('https://applitools.github.io/demo/TestPages/FramesAndRegionsPage/')
  })

  beforeEach(async () => {
    await testDriver.switchToFrame(null)
  })

  afterEach(async () => {
    await eyes.abort()
  })

  after(async () => {
    await testDriver.cleanup()
  })

  it('CheckWindow_WrappedDriver', async function() {
    const driver = await eyes.open(testDriver.driver, this.test.parent.title, this.test.title)
    await testDriver.switchToFrame('[name="frame-main"]', driver)

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('', Target.window())
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckWindow_UnwrappedDriver', async function() {
    await eyes.open(testDriver.driver, this.test.parent.title, this.test.title)
    await testDriver.switchToFrame('[name="frame-main"]')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('', Target.window())
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckNestedFrame_WrappedDriver', async function() {
    const driver = await eyes.open(testDriver.driver, this.test.parent.title, this.test.title)
    await testDriver.switchToFrame('[name="frame-main"]', driver)

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('', Target.frame('frame-comb').frame('frame-image'))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckNestedFrame_UnwrappedDriver', async function() {
    await eyes.open(testDriver.driver, this.test.parent.title, this.test.title)
    await testDriver.switchToFrame('[name="frame-main"]')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('', Target.frame('frame-comb').frame('frame-image'))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckRegionInsideFrameBySelector_WrappedDriver', async function() {
    const driver = await eyes.open(testDriver.driver, this.test.parent.title, this.test.title)
    await testDriver.switchToFrame('[name="frame-main"]', driver)
    await testDriver.switchToFrame('[name="frame-comb"]', driver)
    await testDriver.switchToFrame('[name="frame-image"]', driver)

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('', Target.region('#image'))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckRegionInsideFrameBySelector_UnwrappedDriver', async function() {
    await eyes.open(testDriver.driver, this.test.parent.title, this.test.title)
    await testDriver.switchToFrame('[name="frame-main"]')
    await testDriver.switchToFrame('[name="frame-comb"]')
    await testDriver.switchToFrame('[name="frame-image"]')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('', Target.region('#image'))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  // it('CheckRegionInsideFrameByElement_WrappedDriver', async function() {
  //   const driver = await test.open({appName: this.test.parent.title, testName: this.test.title})
  //   await test.switchToFrame(By.name('frame-main'), driver)
  //   await test.switchToFrame(By.name('frame-comb'), driver)
  //   await test.switchToFrame(By.name('frame-image'), driver)

  //   const element = await test.findElement(By.id('image'))

  //   const frameElementBeforeCheck = await getDocumentElement()
  //   await test.checkRegion(element)
  //   const frameElementAfterCheck = await getDocumentElement()

  //   assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

  //   return test.close()
  // })

  // it('CheckRegionInsideFrameByElement_UnwrappedDriver', async function() {
  //   await test.open({appName: this.test.parent.title, testName: this.test.title})
  //   await test.switchToFrame(By.name('frame-main'))
  //   await test.switchToFrame(By.name('frame-comb'))
  //   await test.switchToFrame(By.name('frame-image'))

  //   const element = await test.findElement(By.id('image'))

  //   const frameElementBeforeCheck = await getDocumentElement()
  //   await test.checkRegion(element)
  //   const frameElementAfterCheck = await getDocumentElement()

  //   assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

  //   return test.close()
  // })

  // it('CheckFrameFully_WrappedDriver', async function() {
  //   const driver = await test.open({appName: this.test.parent.title, testName: this.test.title})
  //   await test.switchToFrame(By.name('frame-main'), driver)
  //   await test.switchToFrame(By.name('frame-comb'), driver)

  //   const frameElementBeforeCheck = await getDocumentElement()
  //   await test.checkFrame('frame-image', {isFully: true})
  //   const frameElementAfterCheck = await getDocumentElement()

  //   assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

  //   return test.close()
  // })

  // it('CheckFrameFully_UnwrappedDriver', async function() {
  //   await test.open({appName: this.test.parent.title, testName: this.test.title})
  //   await test.switchToFrame(By.name('frame-main'))
  //   await test.switchToFrame(By.name('frame-comb'))

  //   const frameElementBeforeCheck = await getDocumentElement()
  //   await test.checkFrame('frame-image', {isFully: true})
  //   const frameElementAfterCheck = await getDocumentElement()

  //   assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

  //   return test.close()
  // })

  // it('CheckCORSFrameRegionBySelector_WrappedDriver', async function() {
  //   const driver = await test.open({appName: this.test.parent.title, testName: this.test.title})
  //   await test.switchToFrame('frame-main', driver)
  //   await test.switchToFrame('frame-cors', driver)

  //   const frameElementBeforeCheck = await getDocumentElement()
  //   await test.checkRegion(By.id('login-form'))
  //   const frameElementAfterCheck = await getDocumentElement()

  //   assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

  //   return test.close()
  // })

  // it('CheckCORSFrameRegionBySelector_UnwrappedDriver', async function() {
  //   await test.open({appName: this.test.parent.title, testName: this.test.title})
  //   await test.switchToFrame('frame-main')
  //   await test.switchToFrame('frame-cors')

  //   const frameElementBeforeCheck = await getDocumentElement()
  //   await test.checkRegion(By.id('login-form'))
  //   const frameElementAfterCheck = await getDocumentElement()

  //   assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

  //   return test.close()
  // })

  // it('CheckCORSFrameRegionByElement_WrappedDriver', async function() {
  //   const driver = await test.open({appName: this.test.parent.title, testName: this.test.title})
  //   await test.switchToFrame('frame-main', driver)
  //   await test.switchToFrame('frame-cors', driver)

  //   const element = await test.findElement(By.id('login-form'))

  //   const frameElementBeforeCheck = await getDocumentElement()
  //   await test.checkRegion(element)
  //   const frameElementAfterCheck = await getDocumentElement()

  //   assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

  //   return test.close()
  // })

  // it('CheckCORSFrameRegionByElement_UnwrappedDriver', async function() {
  //   await test.open({appName: this.test.parent.title, testName: this.test.title})
  //   await test.switchToFrame('frame-main')
  //   await test.switchToFrame('frame-cors')

  //   const element = await test.findElement(By.id('login-form'))

  //   const frameElementBeforeCheck = await getDocumentElement()
  //   await test.checkRegion(element)
  //   const frameElementAfterCheck = await getDocumentElement()

  //   assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

  //   return test.close()
  // })
})
