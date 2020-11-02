// render-script-google-com-2020-10-30-21-42-38
const cwd = process.cwd()
const path = require('path')
const assert = require('assert')
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {testSetup, getTestInfo} = require('@applitools/sdk-shared')

describe('Coverage Tests', () => {
  let driver, destroyDriver, eyes
  beforeEach(async () => {
    ;[driver, destroyDriver] = await spec.build({
      browser: 'firefox',
      headless: true,
    })
    eyes = testSetup.getEyes({
      apiKey: 'lScDOEqp3FfyO9wjESeSdLlIzeN109PBHYNSGZICfEUPU110',
      viewportSize: {width: 1024, height: 768},
      browsersInfo: [],
      stitchMode: 'Scroll',
      parentBranchName: 'default',
      branchName: 'default',
      dontCloseBatches: false,
      saveNewTests: true,
    })
  })
  afterEach(async () => {
    await destroyDriver(driver)
  })
  it('render-script-google-com-2020-10-30-21-42-38 (@render-script @firefox)', async () => {
    await spec.visit(driver, 'http://google.com')
    await eyes.open(driver, 'selenium render', 'http://google.com', undefined)
    await new Promise(r => setTimeout(r, 7000))
    await eyes.check({
      name: 'render script',
      region: {type: 'css', selector: '.ddlh20-domRoot_'},
      ignoreDisplacements: false,
      timeout: 0,
      isFully: false,
    })
    await eyes.close()
  })
})
