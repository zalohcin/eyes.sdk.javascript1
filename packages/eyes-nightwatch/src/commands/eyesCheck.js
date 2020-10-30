const Events = require('events')

module.exports = class EyesCheck extends Events {
  async command(args) {
    await global.__eyes.check(args)
    this.emit('complete')
  }
}
