'use strict'
const path = require('path')
const cwd = process.cwd()
const {ConsoleLogHandler, Eyes, Target, StitchMode} = require(cwd)
const TestDriver = require(path.resolve(cwd, 'test/util/TestDriver'))

describe.skip('Coverage tests', async () => {
  it('TestSimple', async () => {
    const eyes = new Eyes()
    if (process.env.APPLITOOLS_SHOW_LOGS) {
      eyes.setLogHandler(new ConsoleLogHandler(true))
    }
    const configuration = eyes.getConfiguration()
    configuration.setStitchMode(StitchMode.CSS)
    eyes.setConfiguration(configuration)
    const testDriver = await TestDriver({
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['--headless'],
        },
      },
    })
    await testDriver.visit('https://applitools.github.io/demo/TestPages/FramesTestPage/index.html')
    const el = await testDriver.findElement('#overflowing-div')
    await eyes.open(testDriver.driver, 'TestSimple', 'TestSimple', {width: 460, height: 700})
    await eyes.check('', Target.region(el).fully())
    const testResults = await eyes.close()
    console.log(testResults.getStatus(), testResults.getUrl())
  })
})
