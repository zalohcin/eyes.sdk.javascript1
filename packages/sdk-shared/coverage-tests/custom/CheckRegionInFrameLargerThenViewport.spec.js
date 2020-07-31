'use strict'

const cwd = process.cwd()
const path = require('path')
const spec = require(path.resolve(cwd, 'src/SpecDriver'))
const {Target} = require(cwd)
const {getEyes} = require('../../src/test-setup')

describe('CheckRegionInFrameLargerThenViewport', () => {
  let driver, eyes

  before(async () => {
    driver = await spec.build({browser: 'chrome'})
  })

  beforeEach(async () => {
    await spec.mainContext(driver)
  })

  afterEach(async () => {
    await eyes.abort()
  })

  after(async () => {
    await spec.cleanup(driver)
  })

  it('CheckRegionInFrameLargerThenViewport', async function() {
    eyes = new getEyes({isCssStitching: true})
    await spec.visit(driver, 'https://applitools.github.io/demo/TestPages/OutOfViewport/')
    await eyes.open(driver, this.test.parent.title, this.test.title, {width: 800, height: 600})
    await eyes.check(
      'region in frame fully',
      Target.frame('frame-list')
        .region('#list')
        .fully(),
    )
    return eyes.close()
  })

  it('CheckRegionInFrameLargerThenViewport_Scroll', async function() {
    eyes = new getEyes()
    await spec.visit(driver, 'https://applitools.github.io/demo/TestPages/OutOfViewport/')
    await eyes.open(driver, this.test.parent.title, this.test.title, {width: 800, height: 600})
    eyes.setScrollRootElement('body')
    await eyes.check(
      'region in frame fully',
      Target.frame('frame-list')
        .region('#list')
        .fully(),
    )
    return eyes.close()
  })
})
