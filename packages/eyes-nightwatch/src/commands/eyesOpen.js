const {Eyes, ConsoleLogHandler} = require('../..')

module.exports = {
  command(appName, testName, viewportSize) {
    global.__eyes = global.__eyes || new Eyes()
    global.__eyes.setLogHandler(new ConsoleLogHandler(true))
    return global.__eyes.open(this, appName, testName, viewportSize)
  },
}
