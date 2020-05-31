'use strict'

const assert = require('assert')
const cwd = process.cwd()
const path = require('path')
const spec = require(path.resolve(cwd, 'src/SpecWrappedDriver'))
const {Target} = require(cwd)
const {getEyes, Browsers} = require('../util/TestSetup')

describe('PreserveTargetFrameAfterCheck', () => {
  let driver, eyes

  async function getDocumentElement() {
    const {value: element} = await spec.executeScript(driver, 'return window.document')
    return element
  }

  before(async () => {
    driver = await spec.build({capabilities: Browsers.chrome()})
    await spec.visit(driver, 'https://applitools.github.io/demo/TestPages/FramesAndRegionsPage/')
  })

  beforeEach(async () => {
    await spec.switchToFrame(driver, null)
    eyes = getEyes()
  })

  afterEach(async () => {
    await eyes.abort()
  })

  after(async () => {
    await spec.cleanup(driver)
  })

  it('CheckWindow_WrappedDriver', async function() {
    const wrappedDriver = await eyes.open(driver, this.test.parent.title, this.test.title)
    await spec.switchToFrame(wrappedDriver, 'frame-main')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('window', Target.window())
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckWindow_UnwrappedDriver', async function() {
    await eyes.open(driver, this.test.parent.title, this.test.title)
    const el = await spec.findElement(driver, '[name="frame-main"]')
    await spec.switchToFrame(driver, el)

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('window', Target.window())
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckNestedFrame_WrappedDriver', async function() {
    const wrappedDriver = await eyes.open(driver, this.test.parent.title, this.test.title)
    await spec.switchToFrame(wrappedDriver, 'frame-main')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('nested frame', Target.frame('frame-comb').frame('frame-image'))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckNestedFrame_UnwrappedDriver', async function() {
    await eyes.open(driver, this.test.parent.title, this.test.title)
    const el = await spec.findElement(driver, '[name="frame-main"]')
    await spec.switchToFrame(driver, el)

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('nested frame', Target.frame('frame-comb').frame('frame-image'))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckRegionInsideFrameBySelector_WrappedDriver', async function() {
    const wrappedDriver = await eyes.open(driver, this.test.parent.title, this.test.title)
    await spec.switchToFrame(wrappedDriver, 'frame-main')
    await spec.switchToFrame(wrappedDriver, 'frame-comb')
    await spec.switchToFrame(wrappedDriver, 'frame-image')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region', Target.region('#image'))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckRegionInsideFrameBySelector_UnwrappedDriver', async function() {
    await eyes.open(driver, this.test.parent.title, this.test.title)
    await spec.switchToFrame(driver, await spec.findElement(driver, '[name="frame-main"]'))
    await spec.switchToFrame(driver, await spec.findElement(driver, '[name="frame-comb"]'))
    await spec.switchToFrame(driver, await spec.findElement(driver, '[name="frame-image"]'))

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region', Target.region('#image'))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckRegionInsideFrameByElement_WrappedDriver', async function() {
    const wrappedDriver = await eyes.open(driver, this.test.parent.title, this.test.title)
    await spec.switchToFrame(wrappedDriver, 'frame-main')
    await spec.switchToFrame(wrappedDriver, 'frame-comb')
    await spec.switchToFrame(wrappedDriver, 'frame-image')

    const element = await spec.findElement(wrappedDriver, '#image')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region', Target.region(element))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckRegionInsideFrameByElement_UnwrappedDriver', async function() {
    await eyes.open(driver, this.test.parent.title, this.test.title)
    await spec.switchToFrame(driver, await spec.findElement(driver, '[name="frame-main"]'))
    await spec.switchToFrame(driver, await spec.findElement(driver, '[name="frame-comb"]'))
    await spec.switchToFrame(driver, await spec.findElement(driver, '[name="frame-image"]'))

    const element = await spec.findElement(driver, '#image')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region', Target.region(element))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckFrameFully_WrappedDriver', async function() {
    const wrappedDriver = await eyes.open(driver, this.test.parent.title, this.test.title)
    await spec.switchToFrame(wrappedDriver, 'frame-main')
    await spec.switchToFrame(wrappedDriver, 'frame-comb')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('nested frame fully', Target.frame('frame-image').fully())
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckFrameFully_UnwrappedDriver', async function() {
    await eyes.open(driver, this.test.parent.title, this.test.title)
    await spec.switchToFrame(driver, await spec.findElement(driver, '[name="frame-main"]'))
    await spec.switchToFrame(driver, await spec.findElement(driver, '[name="frame-comb"]'))

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('nested frame fully', Target.frame('frame-image').fully())
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckCORSFrameRegionBySelector_WrappedDriver', async function() {
    const wrappedDriver = await eyes.open(driver, this.test.parent.title, this.test.title)
    await spec.switchToFrame(wrappedDriver, 'frame-main')
    await spec.switchToFrame(wrappedDriver, 'frame-cors')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region in cors frame', Target.region('#login-form'))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckCORSFrameRegionBySelector_UnwrappedDriver', async function() {
    await eyes.open(driver, this.test.parent.title, this.test.title)
    await spec.switchToFrame(driver, await spec.findElement(driver, '[name="frame-main"]'))
    await spec.switchToFrame(driver, await spec.findElement(driver, '[name="frame-cors"]'))

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region in cors frame', Target.region('#login-form'))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckCORSFrameRegionByElement_WrappedDriver', async function() {
    const wrappedDriver = await eyes.open(driver, this.test.parent.title, this.test.title)
    await spec.switchToFrame(wrappedDriver, 'frame-main')
    await spec.switchToFrame(wrappedDriver, 'frame-cors')

    const element = await spec.findElement(wrappedDriver, '#login-form')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region in cors frame', Target.region(element))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckCORSFrameRegionByElement_UnwrappedDriver', async function() {
    await eyes.open(driver, this.test.parent.title, this.test.title)
    await spec.switchToFrame(driver, await spec.findElement(driver, '[name="frame-main"]'))
    await spec.switchToFrame(driver, await spec.findElement(driver, '[name="frame-cors"]'))

    const element = await spec.findElement(driver, '#login-form')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region in cors frame', Target.region(element))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })
})
