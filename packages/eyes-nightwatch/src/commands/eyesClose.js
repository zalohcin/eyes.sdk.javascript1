const Events = require('events')

module.exports = class EyesClose extends Events {
  async command(args) {
    await global.__eyes.close(args)
  }
}
