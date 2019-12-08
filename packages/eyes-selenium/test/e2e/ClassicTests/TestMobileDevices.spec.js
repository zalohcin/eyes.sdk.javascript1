'use strict'

const {Builder, Capabilities} = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const safari = require('selenium-webdriver/safari')
const axios = require('axios')

const {ReportingTestSuite} = require('../ReportingTestSuite')
const {TestUtils} = require('../Utils/TestUtils')
const {TestDataProvider} = require('../TestDataProvider')
const {Eyes, Target, StitchMode, ScreenOrientation} = require('../../../index')

describe('HelloWorldTest', function() {
  this.timeout(5 * 60 * 1000)

  const /** @type {ReportingTestSuite} */ testSetup = new ReportingTestSuite()
  before(async function() {
    await testSetup.oneTimeSetup()
  })
  beforeEach(async function() {
    await testSetup.setup(this)
  })
  afterEach(async function() {
    await testSetup.tearDown(this)
  })
  after(async function() {
    await testSetup.oneTimeTearDown()
  })

  /**
   * @param {boolean} fully
   * @param {Eyes} eyes
   * @param {string} testName
   * @param {WebDriver} driver
   * @param {string} page
   * @private
   */
  async function _runTest(fully, eyes, testName, driver, page) {
    try {
      await driver.get(`https://applitools.github.io/demo/TestPages/DynamicResolution/${page}.html`)
      await eyes.open(driver, 'Eyes Selenium SDK - iOS Safari Cropping', testName)
      // eyes.check("Initial view", Target.region(By.css("div.page")).fully(fully).sendDom(false));
      await eyes.check(null, Target.window().fully(fully))
      const result = await eyes.close()

      const passed = {passed: result.isPassed()}
      await axios.get(
        `https://saucelabs.com/rest/v1/${
          TestDataProvider.SAUCE_USERNAME
        }/jobs/${await eyes.getDriver().getSessionId()}`,
        {
          method: 'PUT',
          auth: {
            username: TestDataProvider.SAUCE_USERNAME,
            password: TestDataProvider.SAUCE_ACCESS_KEY,
          },
          data: passed,
        },
      )
    } finally {
      await eyes.abort()
      await driver.quit()
    }
  }

  /**
   * @param {string} deviceName
   * @param {string} platformVersion
   * @param {ScreenOrientation} deviceOrientation
   * @param {boolean} fully
   * @param {string} page
   * @private
   */
  function _initTestName(deviceName, platformVersion, deviceOrientation, fully, page) {
    let testName = `${deviceName} ${platformVersion} ${deviceOrientation} ${page}`
    if (fully) {
      testName += ' fully'
    }
    return testName
  }

  /**
   * @param {Capabilities} options
   * @param {string} deviceName
   * @param {string} platformVersion
   * @param {ScreenOrientation} deviceOrientation
   * @param {boolean} fully
   * @param {string} platformName
   * @param {string} page
   * @private
   */
  async function _initEyes(
    options,
    deviceName,
    platformVersion,
    deviceOrientation,
    fully,
    platformName,
    page,
  ) {
    const eyes = new Eyes()
    eyes.setBatch(TestDataProvider.BatchInfo)
    options.set('deviceName', deviceName)
    options.set('deviceOrientation', deviceOrientation.toLowerCase())
    options.set('platformVersion', platformVersion)
    options.set('platformName', platformName)

    options.set('username', TestDataProvider.SAUCE_USERNAME)
    options.set('accesskey', TestDataProvider.SAUCE_ACCESS_KEY)

    const testName = _initTestName(deviceName, platformVersion, deviceOrientation, fully, page)

    options.set('name', `${testName} (${eyes.getFullAgentId()})`)

    const driver = await new Builder()
      .usingServer(TestDataProvider.SAUCE_SELENIUM_URL)
      .withCapabilities(options)
      .build()

    TestUtils.setupLogging(eyes, testName)

    eyes.setStitchMode(StitchMode.CSS)

    eyes.addProperty('Orientation', deviceOrientation.toString())
    eyes.addProperty('Stitched', fully ? 'True' : 'False')
    await _runTest(fully, eyes, testName, driver, page)
  }

  function getAndroidDeviceFixtureArgs() {
    const devices = []
    devices.push({
      deviceName: 'Android Emulator',
      platformVersion: '8.0',
      deviceOrientation: ScreenOrientation.PORTRAIT,
      fully: false,
    })
    // devices.push({ deviceName: 'Android Emulator', platformVersion: '8.0', deviceOrientation: ScreenOrientation.LANDSCAPE, fully: false });
    // devices.push({ deviceName: 'Android Emulator', platformVersion: '8.0', deviceOrientation: ScreenOrientation.PORTRAIT, fully: true });
    // devices.push({ deviceName: 'Android Emulator', platformVersion: '8.0', deviceOrientation: ScreenOrientation.LANDSCAPE, fully: true });
    return devices
  }

  function getIOSDeviceFixtureArgs() {
    const devices = []
    devices.push({
      deviceName: 'iPad Pro (9.7 inch) Simulator',
      platformVersion: '12.0',
      deviceOrientation: ScreenOrientation.LANDSCAPE,
      fully: false,
    })
    devices.push({
      deviceName: 'iPhone XR Simulator',
      platformVersion: '12.0',
      deviceOrientation: ScreenOrientation.PORTRAIT,
      fully: true,
    })

    if (TestUtils.RUNS_ON_CI) {
      devices.push({
        deviceName: 'iPad Air 2 Simulator',
        platformVersion: '12.0',
        deviceOrientation: ScreenOrientation.LANDSCAPE,
        fully: false,
      })
      devices.push({
        deviceName: 'iPad Air 2 Simulator',
        platformVersion: '11.3',
        deviceOrientation: ScreenOrientation.LANDSCAPE,
        fully: false,
      })
      devices.push({
        deviceName: 'iPad Air 2 Simulator',
        platformVersion: '11.0',
        deviceOrientation: ScreenOrientation.LANDSCAPE,
        fully: false,
      })
      devices.push({
        deviceName: 'iPad Air 2 Simulator',
        platformVersion: '10.3',
        deviceOrientation: ScreenOrientation.LANDSCAPE,
        fully: false,
      })
      devices.push({
        deviceName: 'iPad Air 2 Simulator',
        platformVersion: '12.0',
        deviceOrientation: ScreenOrientation.PORTRAIT,
        fully: false,
      })
      devices.push({
        deviceName: 'iPad Air 2 Simulator',
        platformVersion: '11.3',
        deviceOrientation: ScreenOrientation.PORTRAIT,
        fully: false,
      })
      devices.push({
        deviceName: 'iPad Air 2 Simulator',
        platformVersion: '11.0',
        deviceOrientation: ScreenOrientation.PORTRAIT,
        fully: false,
      })
      devices.push({
        deviceName: 'iPad Air 2 Simulator',
        platformVersion: '10.3',
        deviceOrientation: ScreenOrientation.PORTRAIT,
        fully: false,
      })
      devices.push({
        deviceName: 'iPhone XS Max Simulator',
        platformVersion: '12.2',
        deviceOrientation: ScreenOrientation.LANDSCAPE,
        fully: false,
      })
      devices.push({
        deviceName: 'iPhone XR Simulator',
        platformVersion: '12.2',
        deviceOrientation: ScreenOrientation.PORTRAIT,
        fully: false,
      })
      devices.push({
        deviceName: 'iPhone XS Max Simulator',
        platformVersion: '12.2',
        deviceOrientation: ScreenOrientation.LANDSCAPE,
        fully: true,
      })
      devices.push({
        deviceName: 'iPhone XS Max Simulator',
        platformVersion: '12.2',
        deviceOrientation: ScreenOrientation.PORTRAIT,
        fully: false,
      })
      devices.push({
        deviceName: 'iPhone XS Simulator',
        platformVersion: '12.2',
        deviceOrientation: ScreenOrientation.PORTRAIT,
        fully: false,
      })
      devices.push({
        deviceName: 'iPhone XS Simulator',
        platformVersion: '12.2',
        deviceOrientation: ScreenOrientation.LANDSCAPE,
        fully: false,
      })
      devices.push({
        deviceName: 'iPhone XS Max Simulator',
        platformVersion: '12.2',
        deviceOrientation: ScreenOrientation.PORTRAIT,
        fully: true,
      })
      devices.push({
        deviceName: 'iPhone XR Simulator',
        platformVersion: '12.2',
        deviceOrientation: ScreenOrientation.LANDSCAPE,
        fully: false,
      })
      devices.push({
        deviceName: 'iPhone XR Simulator',
        platformVersion: '12.2',
        deviceOrientation: ScreenOrientation.LANDSCAPE,
        fully: true,
      })
      devices.push({
        deviceName: 'iPhone XS Simulator',
        platformVersion: '12.2',
        deviceOrientation: ScreenOrientation.PORTRAIT,
        fully: true,
      })
      devices.push({
        deviceName: 'iPhone XS Simulator',
        platformVersion: '12.2',
        deviceOrientation: ScreenOrientation.LANDSCAPE,
        fully: true,
      })
      devices.push({
        deviceName: 'iPhone X Simulator',
        platformVersion: '11.2',
        deviceOrientation: ScreenOrientation.PORTRAIT,
        fully: false,
      })
      devices.push({
        deviceName: 'iPhone 7 Simulator',
        platformVersion: '10.3',
        deviceOrientation: ScreenOrientation.PORTRAIT,
        fully: true,
      })
      devices.push({
        deviceName: 'iPad Simulator',
        platformVersion: '11.0',
        deviceOrientation: ScreenOrientation.LANDSCAPE,
        fully: true,
      })
      devices.push({
        deviceName: 'iPhone 6 Plus Simulator',
        platformVersion: '11.0',
        deviceOrientation: ScreenOrientation.PORTRAIT,
        fully: false,
      })
      devices.push({
        deviceName: 'iPhone 5s Simulator',
        platformVersion: '10.3',
        deviceOrientation: ScreenOrientation.LANDSCAPE,
        fully: false,
      })
      devices.push({
        deviceName: 'iPad Simulator',
        platformVersion: '11.0',
        deviceOrientation: ScreenOrientation.PORTRAIT,
        fully: false,
      })
      devices.push({
        deviceName: 'iPad Pro (9.7 inch) Simulator',
        platformVersion: '11.0',
        deviceOrientation: ScreenOrientation.LANDSCAPE,
        fully: false,
      })
      devices.push({
        deviceName: 'iPad Pro (12.9 inch) (2nd generation) Simulator',
        platformVersion: '11.0',
        deviceOrientation: ScreenOrientation.LANDSCAPE,
        fully: false,
      })
      devices.push({
        deviceName: 'iPad Pro (10.5 inch) Simulator',
        platformVersion: '11.0',
        deviceOrientation: ScreenOrientation.PORTRAIT,
        fully: false,
      })
      devices.push({
        deviceName: 'iPad (5th generation) Simulator',
        platformVersion: '11.0',
        deviceOrientation: ScreenOrientation.PORTRAIT,
        fully: false,
      })
      devices.push({
        deviceName: 'iPad Air Simulator',
        platformVersion: '12.0',
        deviceOrientation: ScreenOrientation.LANDSCAPE,
        fully: false,
      })
      devices.push({
        deviceName: 'iPhone X Simulator',
        platformVersion: '11.2',
        deviceOrientation: ScreenOrientation.PORTRAIT,
        fully: true,
      })
      devices.push({
        deviceName: 'iPhone 6 Plus Simulator',
        platformVersion: '11.0',
        deviceOrientation: ScreenOrientation.LANDSCAPE,
        fully: true,
      })
      devices.push({
        deviceName: 'iPhone 5s Simulator',
        platformVersion: '10.3',
        deviceOrientation: ScreenOrientation.LANDSCAPE,
        fully: true,
      })
      devices.push({
        deviceName: 'iPad Pro (9.7 inch) Simulator',
        platformVersion: '11.0',
        deviceOrientation: ScreenOrientation.LANDSCAPE,
        fully: true,
      })
      devices.push({
        deviceName: 'iPad Pro (12.9 inch) (2nd generation) Simulator',
        platformVersion: '11.0',
        deviceOrientation: ScreenOrientation.PORTRAIT,
        fully: true,
      })
      devices.push({
        deviceName: 'iPad Pro (12.9 inch) (2nd generation) Simulator',
        platformVersion: '12.0',
        deviceOrientation: ScreenOrientation.PORTRAIT,
        fully: true,
      })
      devices.push({
        deviceName: 'iPad Pro (10.5 inch) Simulator',
        platformVersion: '11.0',
        deviceOrientation: ScreenOrientation.LANDSCAPE,
        fully: true,
      })
      devices.push({
        deviceName: 'iPad Air Simulator',
        platformVersion: '11.0',
        deviceOrientation: ScreenOrientation.PORTRAIT,
        fully: true,
      })
    }
    return devices
  }

  ;[{page: 'mobile'}, {page: 'desktop'}].forEach(({page}) => {
    describe(`TestPage: ${page}`, function() {
      testSetup._suiteArgs.set('page', page)

      getAndroidDeviceFixtureArgs().forEach(
        ({deviceName, platformVersion, deviceOrientation, fully}) => {
          it(`TestAndroid_SauceLabs {${deviceName},${platformVersion},${deviceOrientation},${fully}}`, async function() {
            testSetup.setTestArguments({deviceName, platformVersion, deviceOrientation, fully})

            await _initEyes(
              new chrome.Options(),
              deviceName,
              platformVersion,
              deviceOrientation,
              fully,
              'Android',
              page,
            )
          })
        },
      )

      getIOSDeviceFixtureArgs().forEach(
        ({deviceName, platformVersion, deviceOrientation, fully}) => {
          it(`TestIOSSafariCrop_SauceLabs {${deviceName},${platformVersion},${deviceOrientation},${fully}}`, async function() {
            testSetup.setTestArguments({deviceName, platformVersion, deviceOrientation, fully})

            await _initEyes(
              new safari.Options(),
              deviceName,
              platformVersion,
              deviceOrientation,
              fully,
              'iOS',
              page,
            )
          })
        },
      )
    })
  })
})
