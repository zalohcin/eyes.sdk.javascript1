'use strict'
const path = require('path')
const cwd = process.cwd()
const spec = require(path.resolve(cwd, 'src/SpecDriver'))
const {getEyes} = require('../../../src/test-setup')
const {TestIgnoreDisplacements} = require('./TestFluentApi_utils')

describe('Coverage tests', () => {
  let driver, eyes

  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await spec.cleanup(driver)
  })

  beforeEach(async () => {
    driver = await spec.build({browser: 'chrome'})
    await spec.visit(driver, 'https://applitools.github.io/demo/TestPages/FramesTestPage/')
    eyes = await getEyes({isVisualGrid: true, branchName: 'v2'})
    eyes.setMatchTimeout(0)
  })

  it('TestIgnoreDisplacements_VG', () =>
    TestIgnoreDisplacements({
      testName: 'TestIgnoreDisplacements_VG',
      eyes,
      driver,
      ignoreDisplacement: true,
    }))

  it('TestIgnoreDisplacements_VG', () =>
    TestIgnoreDisplacements({
      testName: 'TestIgnoreDisplacements_VG',
      eyes,
      driver,
      ignoreDisplacement: false,
    }))
})
