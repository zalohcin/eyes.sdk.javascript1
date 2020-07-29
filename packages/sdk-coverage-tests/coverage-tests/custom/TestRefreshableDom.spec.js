'use strict'

const assert = require('assert')
const cwd = process.cwd()
const path = require('path')
const {getEyes} = require('../util/TestSetup')
const spec = require(path.resolve(cwd, 'src/SpecDriver'))
const {Target} = require(cwd)

let browser, eyes, driver

describe('TestRefreshableDom', function() {
  before(async () => {
    eyes = getEyes()
  })

  beforeEach(async function() {
    browser = await spec.build({browser: 'chrome'})
    driver = await eyes.open(browser, 'AppName', this.currentTest.fullTitle(), {
      width: 600,
      height: 500,
    })
  })

  afterEach(async () => {
    await spec.cleanup(browser)
    await eyes.abort()
  })

  it('refresh element inside iframe after StaleElementReference', async () => {
    await spec.visit(driver, 'https://applitools.github.io/demo/TestPages/RefreshDomPage/iframe')
    await spec.mainContext(driver)
    await spec.childContext(driver, await spec.findElement(driver, '[name="frame"]'))
    const el = await spec.findElement(driver, '#refresh-button')
    await spec.click(driver, el)

    await spec.mainContext(driver)

    await eyes.check('Handle', Target.frame('frame').region('#inner-img'))
    return eyes.close()
  })

  it('refresh element after StaleElementReference', async () => {
    await spec.visit(driver, 'https://applitools.github.io/demo/TestPages/RefreshDomPage')
    const el = await spec.findElement(driver, '#refresh-button')
    await spec.click(driver, el)

    await eyes.check('Handle', Target.region('#inner-img'))
    return eyes.close()
  })

  it('throw after unhandled StaleElementReference', async () => {
    await spec.visit(driver, 'https://applitools.github.io/demo/TestPages/RefreshDomPage')

    const el = await spec.findElement(driver, '#invalidate-button')
    await spec.click(driver, el)
    try {
      await eyes.check('Throw', Target.region('#inner-img'))
      assert.fail()
    } catch (err) {
      assert.strictEqual(err.seleniumStack && err.seleniumStack.type, 'StaleElementReference')
    } finally {
      return eyes.close(false)
    }
  })

  it('refresh scroll root element after StaleElementReference', async () => {
    await spec.visit(driver, 'https://applitools.github.io/demo/TestPages/RefreshDomPage')
    await eyes.check()
    await spec.visit(driver, 'https://applitools.github.io/demo/TestPages/RefreshDomPage')
    await eyes.check()
    return eyes.close()
  })
})
