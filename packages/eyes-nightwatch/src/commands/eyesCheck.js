module.exports = {
  async command(args) {
    return global.__eyes.check(args)
  },
}
