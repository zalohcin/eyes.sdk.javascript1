'use strict'

const {Options: ChromeOptions} = require('selenium-webdriver/chrome')
const {Options: FirefoxOptions} = require('selenium-webdriver/firefox')
const {Options: SafariOptions} = require('selenium-webdriver/safari')
const {Options: IeOptions} = require('selenium-webdriver/ie')

const {BatchInfo, StitchMode, MatchLevel} = require('../../index')
const {TestUtils} = require('./Utils/TestUtils')

/**
 * Collection of utility methods.
 */
class TestDataProvider {
  /**
   * @return {{options: Capabilities, useVisualGrid: boolean, stitchMode: StitchMode}[]}
   */
  static fixtureArgs() {
    const dataVariants = []
    dataVariants.push({
      options: this.getChromeOptions(),
      useVisualGrid: true,
      stitchMode: StitchMode.CSS,
    })
    dataVariants.push({
      options: this.getChromeOptions(),
      useVisualGrid: false,
      stitchMode: StitchMode.CSS,
    })
    dataVariants.push({
      options: this.getChromeOptions(),
      useVisualGrid: false,
      stitchMode: StitchMode.SCROLL,
    })

    if (TestUtils.RUNS_ON_TRAVIS) {
      dataVariants.push({
        options: this.getFirefoxOptions(),
        useVisualGrid: false,
        stitchMode: StitchMode.CSS,
      })
      dataVariants.push({
        options: this.getFirefoxOptions(),
        useVisualGrid: false,
        stitchMode: StitchMode.SCROLL,
      })
      dataVariants.push({
        options: this.getIE11Options(),
        useVisualGrid: false,
        stitchMode: StitchMode.CSS,
      })
      dataVariants.push({
        options: this.getIE11Options(),
        useVisualGrid: false,
        stitchMode: StitchMode.SCROLL,
      })
      dataVariants.push({
        options: this.getSafariOptions(),
        useVisualGrid: false,
        stitchMode: StitchMode.CSS,
      })
      dataVariants.push({
        options: this.getSafariOptions(),
        useVisualGrid: false,
        stitchMode: StitchMode.SCROLL,
      })
    }

    return dataVariants
  }

  /**
   * @return {{testedUrl: string, matchLevel: MatchLevel}[]}
   */
  static eyesBaseArgs() {
    return [
      {testedUrl: 'https://google.com', matchLevel: MatchLevel.Strict},
      {testedUrl: 'https://facebook.com', matchLevel: MatchLevel.Strict},
      {testedUrl: 'https://youtube.com', matchLevel: MatchLevel.Layout},
      {testedUrl: 'https://amazon.com', matchLevel: MatchLevel.Layout},
      {testedUrl: 'https://twitter.com', matchLevel: MatchLevel.Strict},
      {testedUrl: 'https://ebay.com', matchLevel: MatchLevel.Layout},
      {testedUrl: 'https://wikipedia.org', matchLevel: MatchLevel.Strict},
      {testedUrl: 'https://instagram.com', matchLevel: MatchLevel.Strict},
      {
        testedUrl:
          'https://www.target.com/c/blankets-throws/-/N-d6wsb?lnk=ThrowsBlankets%E2%80%9C,tc',
        matchLevel: MatchLevel.Strict,
      },
      // { testedUrl: 'https://www.usatoday.com', matchLevel: MatchLevel.Layout },
      // { testedUrl: 'https://www.vans.com', matchLevel: MatchLevel.Layout }, // TODO - this website get the flow to stuck in an endless loop.
      {testedUrl: 'https://docs.microsoft.com/en-us/', matchLevel: MatchLevel.Strict},
      {
        testedUrl: 'https://applitools.com/features/frontend-development',
        matchLevel: MatchLevel.Strict,
      },
      {
        testedUrl: 'https://applitools.com/docs/topics/overview.html',
        matchLevel: MatchLevel.Strict,
      },
      // { testedUrl: 'https://www.qq.com/', matchLevel: MatchLevel.Strict },
    ]
  }

  /**
   * @return {Capabilities}
   */
  static getIE11Options() {
    const options = new IeOptions()
    options.set('browserVersion', '11.0')
    return options
  }

  /**
   * @return {Capabilities}
   */
  static getFirefoxOptions() {
    const options = new FirefoxOptions()
    if (TestUtils.RUN_HEADLESS) {
      options.addArgument('--headless')
    }
    return options
  }

  /**
   * @return {Capabilities}
   */
  static getChromeOptions() {
    const options = new ChromeOptions()
    if (TestUtils.RUN_HEADLESS) {
      options.headless()
    }
    // options.addArgument("--force-device-scale-factor=1.5");
    return options
  }

  /**
   * @return {Capabilities}
   */
  static getSafariOptions() {
    const options = new SafariOptions()
    return options
  }
}

TestDataProvider.BatchInfo = new BatchInfo(`JS4 Tests${process.env.TEST_NAME_SUFFIX || ''}`)

TestDataProvider.SAUCE_USERNAME = process.env.SAUCE_USERNAME
TestDataProvider.SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY
TestDataProvider.SAUCE_SELENIUM_URL = 'https://ondemand.saucelabs.com:443/wd/hub'

TestDataProvider.BROWSERSTACK_USERNAME = process.env.BROWSERSTACK_USERNAME
TestDataProvider.BROWSERSTACK_ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY
TestDataProvider.BROWSERSTACK_SELENIUM_URL = 'https://hub-cloud.browserstack.com/wd/hub'

exports.TestDataProvider = TestDataProvider
