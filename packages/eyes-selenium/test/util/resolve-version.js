const mock = require('mock-require')

if (!process.env.SELENIUM_MAJOR_VERSION) {
  process.env.SELENIUM_MAJOR_VERSION = '4'
}

mock('selenium-webdriver', `selenium-webdriver-${process.env.SELENIUM_MAJOR_VERSION}`)
