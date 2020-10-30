const {Target} = require('../..')

describe('chaining api', async () => {
  before(function(driver, done) {
    driver.url('https://applitools.github.io/demo/TestPages/FramesTestPage/', done)
  })
  after(function(driver, done) {
    return driver.end(done)
  })
  it('hello world', function(driver) {
    driver
      .eyesOpen({
        appName: 'eyes-nightwatch',
        testName: 'hello world',
        viewportSize: {width: 800, height: 600},
      })
      .eyesCheck(Target.window().fully())
      .eyesClose()
  })
})
