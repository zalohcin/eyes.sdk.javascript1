const chromedriver = require('chromedriver')

module.exports = async () => {
  if (!process.env.SKIP_CHROMEDRIVER || process.env.CVG_TEST_REMOTE) {
    const returnPromise = true
    await chromedriver.start(['--port=4444', '--url-base=wd/hub', '--silent'], returnPromise)
  }
}
