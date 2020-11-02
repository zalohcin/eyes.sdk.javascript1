'use strict'
const cwd = process.cwd()
const path = require('path')
const {getEyes} = require('../../../src/test-setup')
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {MatchLevel} = require(cwd)
const {testSetup, getCheckSettings, validateVG2} = require('./EyesDifferentRunners')

describe('TestEyesDifferentRunners VG2', () => {
  let driver, destroyDriver, eyes

  beforeEach(async function() {
    ;[driver, destroyDriver] = await spec.build({browser: 'chrome'})
    eyes = await getEyes({vg: true})
    eyes.setSaveNewTests(false)
    await eyes.open(driver, 'Top Sites', `Top Sites - ${this.currentTest.title}`, {
      width: 800,
      height: 600,
    })
  })

  afterEach(async function() {
    await destroyDriver()
    await eyes.abortIfNotClosed()
  })

  it('TestEyesDifferentRunners', () => {
    const testCase = testSetup(getCheckSettings, validateVG2)
    testCase('https://amazon.com', MatchLevel.Layout)
  })
})
