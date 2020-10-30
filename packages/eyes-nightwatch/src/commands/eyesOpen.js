const Events = require('events')
const {Eyes, ConsoleLogHandler} = require('../..')

module.exports = class EyesOpen extends Events {
  async command({appName, testName, viewportSize}) {
    global.__eyes = global.__eyes || new Eyes()
    global.__eyes.setLogHandler(new ConsoleLogHandler(true))
    await global.__eyes.open(this.client.api, appName, testName, viewportSize)
    this.emit('complete')
  }
}
