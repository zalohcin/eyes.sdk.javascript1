const {remote} = require('webdriverio')

exports.mochaHooks = {
  async beforeAll() {
    global.ieDriver = await remote({
      protocol: 'https',
      hostname: 'ondemand.saucelabs.com',
      path: '/wd/hub',
      port: 443,
      logLevel: 'silent',
      capabilities: {
        name: 'Snippets tests',
        browserName: 'internet explorer',
        browserVersion: '11.285',
        platformName: 'Windows 10',
        'sauce:options': {
          username: process.env.SAUCE_USERNAME,
          accessKey: process.env.SAUCE_ACCESS_KEY,
        },
      },
    })
  },

  async afterAll() {
    await global.ieDriver.deleteSession()
  },
}
