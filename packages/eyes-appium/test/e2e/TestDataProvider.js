'use strict'

const {BatchInfo} = require('@applitools/eyes-selenium')

class TestDataProvider {}

TestDataProvider.BatchInfo = new BatchInfo(`JS4 Tests${process.env.TEST_NAME_SUFFIX}`)

TestDataProvider.SAUCE_USERNAME = process.env.SAUCE_USERNAME
TestDataProvider.SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY
TestDataProvider.SAUCE_SELENIUM_URL = 'https://ondemand.saucelabs.com:443/wd/hub'

TestDataProvider.BROWSERSTACK_USERNAME = process.env.BROWSERSTACK_USERNAME
TestDataProvider.BROWSERSTACK_ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY
TestDataProvider.BROWSERSTACK_SELENIUM_URL = 'https://hub-cloud.browserstack.com/wd/hub'

exports.TestDataProvider = TestDataProvider
