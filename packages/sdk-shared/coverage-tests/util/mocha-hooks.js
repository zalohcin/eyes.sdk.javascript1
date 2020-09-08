const waitForDockerBrowsers = require('../../src/wait-for-docker-browsers')

exports.mochaHooks = {
  async beforeAll() {
    await waitForDockerBrowsers()
  },
}
