const assert = require('assert')
const pixelmatch = require('pixelmatch')
const makeDriver = require('../util/driver')
const saveScreenshot = require('../../src/saveScreenshot')
const screenshoter = require('../../index')
const makeImage = require('../../src/image')

// TODO add overflowed regions tests

describe('screenshoter', () => {
  const logger = {log: () => null, verbose: () => null}
  let driver, destroyDriver

  beforeEach(async () => {
    ;[driver, destroyDriver] = await makeDriver()
    await driver.init()
    await driver.visit('https://applitools.github.io/demo/TestPages/FramesTestPage/')
    await driver.setViewportSize({width: 700, height: 460})
  })

  afterEach(async () => {
    await destroyDriver()
  })

  it('take viewport screenshot', viewport)

  it('take full page screenshot', fullPage)

  it('take context screenshot', context)

  it('take full context screenshot', fullContext)

  it('take region screenshot', region)

  it('take full region screenshot', fullRegion)

  it('take element screenshot', element)

  it('take full element screenshot', fullElement)

  it('take region in context screenshot', regionInContext)

  it('take full region in context screenshot', fullRegionInContext)

  it('take element in context screenshot', elementInContext)

  it('take full element in context screenshot', fullElementInContext)

  it('take context in context screenshot', contextInContext)

  it('take full context in context screenshot', fullContextInContext)

  async function viewport() {
    const screenshot = await screenshoter({logger, driver})
    const actual = await screenshot.toObject()
    const expected = await makeImage('./test/fixtures/screenshoter/page.png').toObject()
    assert.ok(
      pixelmatch(actual.data, expected.data, null, expected.info.width, expected.info.height) === 0,
    )
  }
  async function fullPage() {
    const screenshot = await screenshoter({
      logger,
      driver,
      isFully: true,
      scrollingMode: 'scroll',
    })
    const actual = await screenshot.toObject()
    const expected = await makeImage('./test/fixtures/screenshoter/page-fully.png').toObject()
    assert.ok(
      pixelmatch(actual.data, expected.data, null, expected.info.width, expected.info.height) === 0,
    )
  }
  async function context() {
    const screenshot = await screenshoter({
      logger,
      driver,
      context: {reference: 'iframe[name="frame1"]'},
      scrollingMode: 'scroll',
    })
    const actual = await screenshot.toObject()
    const expected = await makeImage('./test/fixtures/screenshoter/context.png').toObject()
    assert.ok(
      pixelmatch(actual.data, expected.data, null, expected.info.width, expected.info.height) === 0,
    )
  }
  async function fullContext() {
    const screenshot = await screenshoter({
      logger,
      driver,
      context: {reference: 'iframe[name="frame1"]'},
      isFully: true,
      scrollingMode: 'scroll',
    })
    const actual = await screenshot.toObject()
    const expected = await makeImage('./test/fixtures/screenshoter/context-fully.png').toObject()
    assert.ok(
      pixelmatch(actual.data, expected.data, null, expected.info.width, expected.info.height) === 0,
    )
  }
  async function region() {
    const screenshot = await screenshoter({
      logger,
      driver,
      target: {x: 30, y: 500, height: 100, width: 200},
      scrollingMode: 'scroll',
    })
    const actual = await screenshot.toObject()
    const expected = await makeImage('./test/fixtures/screenshoter/region.png').toObject()
    assert.ok(
      pixelmatch(actual.data, expected.data, null, expected.info.width, expected.info.height) === 0,
    )
  }
  async function fullRegion() {
    const screenshot = await screenshoter({
      logger,
      driver,
      target: {x: 30, y: 500, height: 700, width: 200},
      isFully: true,
      scrollingMode: 'scroll',
    })
    const actual = await screenshot.toObject()
    const expected = await makeImage('./test/fixtures/screenshoter/region-fully.png').toObject()
    assert.ok(
      pixelmatch(actual.data, expected.data, null, expected.info.width, expected.info.height) === 0,
    )
  }
  async function element() {
    const screenshot = await screenshoter({
      logger,
      driver,
      target: '#overflowing-div-image',
      scrollingMode: 'scroll',
    })
    const actual = await screenshot.toObject()
    const expected = await makeImage('./test/fixtures/screenshoter/element.png').toObject()
    assert.ok(
      pixelmatch(actual.data, expected.data, null, expected.info.width, expected.info.height) === 0,
    )
  }
  async function fullElement() {
    const screenshot = await screenshoter({
      logger,
      driver,
      target: '#overflowing-div-image',
      isFully: true,
      scrollingMode: 'scroll',
    })
    const actual = await screenshot.toObject()
    const expected = await makeImage('./test/fixtures/screenshoter/element-fully.png').toObject()
    assert.ok(
      pixelmatch(actual.data, expected.data, null, expected.info.width, expected.info.height) === 0,
    )
  }
  async function regionInContext() {
    const screenshot = await screenshoter({
      logger,
      driver,
      context: {reference: 'iframe[name="frame1"]'},
      target: {x: 10, y: 20, width: 110, height: 120},
      scrollingMode: 'scroll',
    })
    const actual = await screenshot.toObject()
    const expected = await makeImage('./test/fixtures/screenshoter/inner-region.png').toObject()
    assert.ok(
      pixelmatch(actual.data, expected.data, null, expected.info.width, expected.info.height) === 0,
    )
  }
  async function fullRegionInContext() {
    const screenshot = await screenshoter({
      logger,
      driver,
      context: {reference: 'iframe[name="frame1"]'},
      target: {x: 10, y: 100, width: 1000, height: 120},
      isFully: true,
      scrollingMode: 'scroll',
    })
    const actual = await screenshot.toObject()
    const expected = await makeImage(
      './test/fixtures/screenshoter/inner-region-fully.png',
    ).toObject()
    assert.ok(
      pixelmatch(actual.data, expected.data, null, expected.info.width, expected.info.height) === 0,
    )
  }
  async function elementInContext() {
    const screenshot = await screenshoter({
      logger,
      driver,
      context: {reference: 'iframe[name="frame1"]'},
      target: '#inner-frame-div',
      scrollingMode: 'scroll',
    })
    const actual = await screenshot.toObject()
    const expected = await makeImage('./test/fixtures/screenshoter/inner-element.png').toObject()
    assert.ok(
      pixelmatch(actual.data, expected.data, null, expected.info.width, expected.info.height) === 0,
    )
  }
  async function fullElementInContext() {
    const screenshot = await screenshoter({
      logger,
      driver,
      context: {reference: 'iframe[name="frame1"]'},
      target: '#inner-frame-div',
      isFully: true,
      scrollingMode: 'scroll',
    })
    const actual = await screenshot.toObject()
    const expected = await makeImage(
      './test/fixtures/screenshoter/inner-element-fully.png',
    ).toObject()
    assert.ok(
      pixelmatch(actual.data, expected.data, null, expected.info.width, expected.info.height) === 0,
    )
  }
  async function contextInContext() {
    const screenshot = await screenshoter({
      logger,
      driver,
      context: {reference: 'iframe[name="frame1-1"]', parent: {reference: 'iframe[name="frame1"]'}},
      scrollingMode: 'scroll',
    })
    const actual = await screenshot.toObject()
    const expected = await makeImage('./test/fixtures/screenshoter/inner-context.png').toObject()
    assert.ok(
      pixelmatch(actual.data, expected.data, null, expected.info.width, expected.info.height) === 0,
    )
  }
  async function fullContextInContext() {
    const screenshot = await screenshoter({
      logger,
      driver,
      context: {reference: 'iframe[name="frame1-1"]', parent: {reference: 'iframe[name="frame1"]'}},
      isFully: true,
      scrollingMode: 'scroll',
    })
    const actual = await screenshot.toObject()
    const expected = await makeImage(
      './test/fixtures/screenshoter/inner-context-fully.png',
    ).toObject()
    assert.ok(
      pixelmatch(actual.data, expected.data, null, expected.info.width, expected.info.height) === 0,
    )
  }
})
