const cwd = process.cwd()
const path = require('path')
const assert = require('assert')
const spec = require(path.resolve(cwd, 'src/SpecDriver'))
const {Configuration} = require(cwd)
const {testSetup} = require('@applitools/sdk-shared')

describe('Coverage Tests', () => {
  let driver, destroyDriver
  let eyes
  let baselineTestName
  beforeEach(async () => {
    ;[driver, destroyDriver] = await spec.build({browser: 'Safari', device: 'iPhone XS'})
    eyes = testSetup.getEyes({
      branchName: "master",
    })
  })
  afterEach(async () => {
    await destroyDriver()
  })
  it('Check', async () => {
    await spec.visit(driver, "https://applitools.github.io/demo/TestPages/StickyHeaderWithRegions")
    eyes.setSaveDebugScreenshots(true)
    eyes.setDebugScreenshotsPath('./')
    await eyes.open(
            driver,
            "Applitools Eyes SDK",
            "Check",
          )
    await eyes.check()
    await eyes.close(undefined)
  })
});
