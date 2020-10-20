'use strict'
const cwd = process.cwd()
const assert = require('assert')
const path = require('path')
const {getEyes} = require('../../src/test-setup')
const spec = require(path.resolve(cwd, 'src/SpecDriver'))
const {Target, TestResults} = require(cwd)

describe.skip('Coverage tests', () => {
  let driver, eyes
  beforeEach(async () => {
    driver = await spec.build({browser: 'chrome'})
  })

  it('TestCloseReturnsTestResults_Passed_ClassicRunner', async function() {
    eyes = getEyes()
    await spec.visit(driver, 'https://applitools.github.io/demo/TestPages/RandomizePage/')

    await eyes.open(driver, this.test.parent.title, this.test.title)
    const region = await spec.findElement(driver, '#random_wrapper')
    await eyes.check('check region', Target.region(region))

    const testResults = await eyes.close(false)

    assert.ok(testResults instanceof TestResults)
  })

  it('TestCloseReturnsTestResults_Failed_ClassicRunner', async function() {
    eyes = getEyes()
    await spec.visit(driver, 'https://applitools.github.io/demo/TestPages/RandomizePage/?randomize')

    await eyes.open(driver, this.test.parent.title, this.test.title)
    const region = await spec.findElement(driver, '#random_wrapper')
    await eyes.check('check region', Target.region(region))

    const testResults = await eyes.close(false)

    assert.ok(testResults instanceof TestResults)
  })

  it('TestCloseReturnsTestResults_Passed_VisualGridRunner', async function() {
    eyes = getEyes({isVisualGrid: true})
    await spec.visit(driver, 'https://applitools.github.io/demo/TestPages/RandomizePage/')

    await eyes.open(driver, this.test.parent.title, this.test.title)
    const region = await spec.findElement(driver, '#random_wrapper')
    await eyes.check('check region', Target.region(region))

    const testResults = await eyes.close(false)

    assert.ok(testResults instanceof TestResults)
  })

  it('TestCloseReturnsTestResults_Failed_VisualGridRunner', async function() {
    eyes = getEyes({isVisualGrid: true})
    await spec.visit(driver, 'https://applitools.github.io/demo/TestPages/RandomizePage/?randomize')

    await eyes.open(driver, this.test.parent.title, this.test.title)
    const region = await spec.findElement(driver, '#random_wrapper')
    await eyes.check('check region', Target.region(region))

    const testResults = await eyes.close(false)

    assert.ok(testResults instanceof TestResults)
  })

  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await spec.cleanup(driver)
  })
})
