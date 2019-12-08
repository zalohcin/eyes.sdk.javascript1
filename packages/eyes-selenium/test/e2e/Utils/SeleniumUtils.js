'use strict'

require('chromedriver')

const {Builder, WebDriver, Capabilities} = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const firefox = require('selenium-webdriver/firefox')
const safari = require('selenium-webdriver/safari')
const ie = require('selenium-webdriver/ie')
const edge = require('selenium-webdriver/edge')
const {GeneralUtils} = require('@applitools/eyes-common')

const {TestUtils} = require('./TestUtils')
const {TestDataProvider} = require('../TestDataProvider')
const {VisualGridRunner, ClassicRunner, Eyes} = require('../../../index')

/**
 * Selenium WebDriver related utilities.
 */
class SeleniumUtils {
  /**
   * @param options
   * @return {WebDriver}
   */
  static createChromeDriver(options = new chrome.Options()) {
    if (TestUtils.RUN_HEADLESS) {
      options.headless()
    }

    if (SeleniumUtils.DRIVER_PATH) {
      chrome.setDefaultService(new chrome.ServiceBuilder(SeleniumUtils.DRIVER_PATH).build())
    }

    return new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build()
  }

  /**
   * @param {Capabilities} options
   * @return {WebDriver}
   */
  static createWebDriver(options) {
    let webDriver
    switch (options.getBrowserName()) {
      case 'firefox':
        if (SeleniumUtils.DRIVER_PATH) {
          firefox.setDefaultService(new firefox.ServiceBuilder(SeleniumUtils.DRIVER_PATH).build())
        }
        webDriver = new Builder()
          .withCapabilities(Capabilities.firefox())
          .setFirefoxOptions(options)
          .build()
        break
      case 'safari':
        if (SeleniumUtils.DRIVER_PATH) {
          safari.setDefaultService(new safari.ServiceBuilder(SeleniumUtils.DRIVER_PATH).build())
        }
        webDriver = new Builder()
          .withCapabilities(Capabilities.safari())
          .setSafariOptions(options)
          .build()
        break
      case 'internet explorer':
        if (SeleniumUtils.DRIVER_PATH) {
          ie.setDefaultService(new ie.ServiceBuilder(SeleniumUtils.DRIVER_PATH).build())
        }
        webDriver = new Builder()
          .withCapabilities(Capabilities.ie())
          .setIeOptions(options)
          .build()
        break
      case 'edge':
        if (SeleniumUtils.DRIVER_PATH) {
          edge.setDefaultService(new edge.ServiceBuilder(SeleniumUtils.DRIVER_PATH).build())
        }
        webDriver = new Builder()
          .withCapabilities(Capabilities.edge())
          .setEdgeOptions(options)
          .build()
        break
      default:
        if (SeleniumUtils.DRIVER_PATH) {
          chrome.setDefaultService(new chrome.ServiceBuilder(SeleniumUtils.DRIVER_PATH).build())
        }
        webDriver = new Builder()
          .withCapabilities(Capabilities.chrome())
          .setChromeOptions(options)
          .build()
        break
    }

    return webDriver
  }

  /**
   * Selenium WebDriver related utilities.
   *
   * @param {boolean} useVisualGrid
   * @param {string} testName
   * @return {{driver: WebDriver, runner: EyesRunner, eyes: Eyes}}
   */
  static initEyes(useVisualGrid, testName) {
    const driver = SeleniumUtils.createChromeDriver()

    let runner
    if (useVisualGrid) {
      testName += '_VG'
      runner = new VisualGridRunner(10)
    } else {
      runner = new ClassicRunner()
    }

    const logPath = TestUtils.initLogPath(testName)
    const eyes = new Eyes(runner)
    eyes.setLogHandler(TestUtils.initLogHandler(testName, logPath))
    eyes.setBatch(TestDataProvider.BatchInfo)
    return {driver, runner, eyes}
  }
}

SeleniumUtils.DRIVER_PATH = GeneralUtils.getEnvValue('DRIVER_PATH')

exports.SeleniumUtils = SeleniumUtils
