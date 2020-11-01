const {Target} = require('../..')

describe('chaining api', async () => {
  it('hello world', function(driver) {
    driver
      .url('https://applitools.github.io/demo/TestPages/FramesTestPage/')
      .eyesOpen()
      .eyesCheck(Target.window().fully())
      .eyesClose()
      .end()
  })
})
