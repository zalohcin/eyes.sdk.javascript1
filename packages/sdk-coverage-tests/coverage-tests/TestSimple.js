'use strict'
const path = require('path')
const cwd = process.cwd()
const {ConsoleLogHandler, Eyes, Target, StitchMode} = require(cwd)
const getDriver = require(path.resolve(cwd, 'test/util/getDriver'))
const EyesWrappedDriver = require(path.resolve(cwd, 'src/wrappers/interface'))

describe('Coverage tests', async () => {
  it('TestSimple', async () => {
    const eyes = new Eyes()
    if (process.env.APPLITOOLS_SHOW_LOGS) {
      eyes.setLogHandler(new ConsoleLogHandler(true))
    }
    const configuration = eyes.getConfiguration()
    configuration.setStitchMode(StitchMode.CSS)
    eyes.setConfiguration(configuration)
    const {driver} = await getDriver({
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['--headless'],
        },
      },
    })
    const wrappedDriver = new EyesWrappedDriver(eyes.getLogger(), driver)
    await wrappedDriver.controller.visit(
      'https://applitools.github.io/demo/TestPages/FramesTestPage/index.html',
    )
    const el = await wrappedDriver.finder.findElement('#overflowing-div')
    await eyes.open(driver, 'TestSimple', 'TestSimple', {width: 460, height: 700})
    await eyes.check('', Target.region(el))
    const testResults = await eyes.close()
    console.log(testResults.getStatus(), testResults.getUrl())
  })
})
