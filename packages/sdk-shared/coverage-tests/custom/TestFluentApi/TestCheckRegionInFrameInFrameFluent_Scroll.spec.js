// error example https://eyes.applitools.com/app/test-results/00000251805154478531/00000251805154305711/steps/1?accountId=xIpd7EWjhU6cjJzDGrMcUw~~&mode=step-editor
'use strict'
const path = require('path')
const cwd = process.cwd()
const spec = require(path.resolve(cwd, 'src/SpecDriver'))
const {getEyes} = require('../../../src/test-setup')
const {TestCheckRegionInFrameInFrame_Fluent} = require('./TestFluentApi_utils')

describe.skip('Coverage tests', () => {
  let driver, eyes

  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await spec.cleanup(driver)
  })

  beforeEach(async () => {
    driver = await spec.build({browser: 'chrome'})
    await spec.visit(driver, 'https://applitools.github.io/demo/TestPages/FramesTestPage/')
    eyes = await getEyes({branchName: 'default'})
    eyes.setMatchTimeout(0)
  })

  it('TestCheckRegionInFrameInFrameFluent_Scroll', () =>
    TestCheckRegionInFrameInFrame_Fluent({
      testName: 'TestCheckRegionInFrameInFrame_Fluent_Scroll',
      eyes,
      driver,
    }))
})
