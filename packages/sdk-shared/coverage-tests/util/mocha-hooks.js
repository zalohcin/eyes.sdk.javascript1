const waitForDockerBrowsers = require('../../src/wait-for-docker-browsers')
const {checkLocalhost} = require('../../src/preflight-check')

exports.mochaHooks = {
  async beforeAll() {
    await checkLocalhost()
    await waitForDockerBrowsers()
  },
}
