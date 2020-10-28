module.exports = {
  async command(args) {
    return global.__eyes.close(args)
  },
}
