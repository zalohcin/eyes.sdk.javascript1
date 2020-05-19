// re: https://trello.com/c/EQD3JUOf
const {remote} = require('webdriverio')
const {Eyes, Target} = require('../../..')

describe('JS Coverage Tests - WDIO5', async () => {
  let eyes
  let browser

  before(async () => {
    const browserOptions = {
      host: 'ondemand.saucelabs.com',
      hostname: 'ondemand.saucelabs.com',
      port: 80,
      path: '/wd/hub',
      capabilities: {
        browserName: 'MicrosoftEdge',
        browserVersion: '18',
        'sauce:options': {
          screenResolution: '1920x1080',
          username: process.env.SAUCE_USERNAME,
          accesskey: process.env.SAUCE_ACCESS_KEY,
        },
      },
    }
    browser = await remote(browserOptions)
    eyes = new Eyes()
  })

  after(async () => {
    await browser.deleteSession()
    await eyes.abortIfNotClosed()
  })

  // NOTE (from Dave H):
  // Blank screenshots with Edge are intermittent.
  // This test is added as an initial starting point but it does not reliably produce the error.
  // Marking it as skipped for now.
  it.skip('blank-image-edge-18', async function() {
    eyes.setMatchTimeout(0)
    await browser.url('http://applitools-dom-capture-origin-1.surge.sh/ie.html')
    await eyes.open(browser, this.test.parent.title, 'blank-image-edge-18')
    await eyes.check(undefined, Target.window())
    await eyes.close(true)
  })
})
