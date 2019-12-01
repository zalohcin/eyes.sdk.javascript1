'use strict';

const assert = require('assert');
const { Capabilities, Builder } = require('selenium-webdriver');
const { GeneralUtils, StitchMode, RectangleSize } = require('@applitools/eyes-common');
const { VisualGridRunner, ClassicRunner, Eyes } = require('../../index');

const { TestUtils } = require('./Utils/TestUtils');
const { SeleniumUtils } = require('./Utils/SeleniumUtils');
const { SpecificTestContextRequirements } = require('./Utils/SpecificTestContextRequirements');
const { TestDataProvider } = require('./TestDataProvider');
const { ReportingTestSuite } = require('./ReportingTestSuite');

class TestSetup extends ReportingTestSuite {
  /**
   * @param {string} testSuitName
   * @param {Capabilities} options
   * @param {boolean} useVisualGrid
   * @param {StitchMode} stitchMode
   */
  constructor(testSuitName, options, useVisualGrid = false, stitchMode = StitchMode.CSS) {
    super();

    const testNameSuffix = GeneralUtils.getEnvValue('TEST_NAME_SUFFIX');

    /** @type {Capabilities} */
    this._options = options;
    /** @type {boolean} */
    this._useVisualGrid = useVisualGrid;
    /** @type {StitchMode} */
    this._stitchMode = stitchMode;
    /** @type {string} */
    this._testSuitName = testSuitName + testNameSuffix;
    /** @type {string} */
    this._testedPageUrl = 'https://applitools.github.io/demo/TestPages/FramesTestPage/';
    /** @type {string} */
    this._seleniumServerUrl = undefined;
    /** @type {RectangleSize} */
    this._testedPageSize = new RectangleSize(700, 460);

    /** @type {EyesRunner} */
    this._runner = undefined;

    /** @type {boolean} */
    this._compareExpectedRegion = true;

    /** @type {Map<string, SpecificTestContextRequirements>} */
    this._testDataByTestId = new Map();

    this._currentTestId = 0;

    this._suiteArgs.set('browser', options.getBrowserName());
    this._suiteArgs.set('useVisualGrid', useVisualGrid);
    this._suiteArgs.set('stitchMode', stitchMode);
  }

  /**
   * Identifies a method that is called once to perform setup before any child tests are run.
   *
   * @return {Promise}
   */
  async oneTimeSetup() {
    await super.oneTimeSetup();
    this._runner = this._useVisualGrid ? new VisualGridRunner(10) : new ClassicRunner();
  }

  /**
   * Identifies a method to be called immediately before each test is run.
   *
   * Should be called like this:
   * ```
   * beforeEach(function() {
   *   testSuite.setup(this);
   * });
   *
   * @param {Context} context
   * @return {Promise}
   */
  async setup(context) {
    this._currentTestId += 1;
    await super.setup(context);
    await this._init(context.currentTest.title);
  }

  /**
   * Identifies a method to be called immediately after each test is run.
   *
   * Should be called like this:
   * ```
   * afterEach(function() {
   *   testSuite.tearDown(this, {isVisualGrid: true});
   * });
   * ```
   *
   * @param {Context} context
   * @param {object} [params]
   * @return {Promise}
   */
  async tearDown(context, params) {
    await super.tearDown(context, params);

    try {
      const results = await this.getEyes().close();
      if (results) {
        const sessionResults = await TestUtils.getSessionResults(this.getEyes().getApiKey(), results);

        if (sessionResults) {
          const actualAppOutput = sessionResults.getActualAppOutput();
          if (actualAppOutput.length > 0) {
            const ims = actualAppOutput[0].getImageMatchSettings();
            this._compareRegions(ims);
            this._compareProperties(ims);
          }
        }
        this.getEyes().getLogger().log(`Mismatches: ${results.getMismatches()}`);
      }
    } catch (err) {
      this.getEyes().getLogger().log('Exception:', err);
      // throw err;
    } finally {
      await this.getEyes().abort();
      await this.getWebDriver().quit();
    }
  }

  /**
   * Identifies a method to be called once after all the child tests have run.
   *
   * @return {Promise}
   */
  async oneTimeTearDown() {
    await super.oneTimeTearDown();
  }

  setExpectedIgnoreRegions(...expectedIgnoreRegions) {
    this._testDataByTestId.get(this._currentTestId).setExpectedIgnoreRegions(expectedIgnoreRegions);
  }

  setExpectedLayoutRegions(...expectedLayoutRegions) {
    this._testDataByTestId.get(this._currentTestId).setExpectedLayoutRegions(expectedLayoutRegions);
  }

  setExpectedStrictRegions(...expectedStrictRegions) {
    this._testDataByTestId.get(this._currentTestId).setExpectedStrictRegions(expectedStrictRegions);
  }

  setExpectedContentRegions(...expectedContentRegions) {
    this._testDataByTestId.get(this._currentTestId).setExpectedContentRegions(expectedContentRegions);
  }

  setExpectedFloatingsRegions(...expectedFloatingsRegions) {
    this._testDataByTestId.get(this._currentTestId).setExpectedFloatingRegions(expectedFloatingsRegions);
  }

  setExpectedAccessibilityRegions(...accessibilityRegions) {
    this._testDataByTestId.get(this._currentTestId).setExpectedAccessibilityRegions(accessibilityRegions);
  }

  addExpectedProperty(propertyName, expectedValue) {
    this._testDataByTestId.get(this._currentTestId).getExpectedProperties().set(propertyName, expectedValue);
  }

  /**
   * @param {string} testName
   * @private
   */
  async _init(testName) {
    // Initialize the eyes SDK and set your private API key.
    const eyes = this._initEyes();

    if (eyes.getRunner() instanceof VisualGridRunner) {
      testName += '_VG';
    } else if (this._stitchMode === StitchMode.SCROLL) {
      testName += '_Scroll';
    }

    TestUtils.setupLogging(eyes, `${testName}_${this._options.get('platformName')}`);

    this._testDataByTestId.set(this._currentTestId, new SpecificTestContextRequirements(eyes, testName));

    let webDriver;
    const seleniumServerUrl = this._setupSeleniumServer(testName);
    try {
      eyes.getLogger().log('Trying to create RemoteWebDriver on {0}', seleniumServerUrl);
      webDriver = await new Builder().withCapabilities(this._options).usingServer(seleniumServerUrl).build();
    } catch (err) {
      eyes.getLogger().log('Failed creating RemoteWebDriver on {0}. Creating local WebDriver.', seleniumServerUrl);
      eyes.getLogger().log(`Exception: ${err}`);
      webDriver = await SeleniumUtils.createWebDriver(this._options);
    }
    eyes.addProperty('Selenium Session ID', await (await webDriver.getSession()).getId());

    eyes.addProperty('ForceFPS', eyes.getForceFullPageScreenshot() ? 'true' : 'false');
    eyes.addProperty('Agent ID', eyes.getFullAgentId());

    // IWebDriver webDriver = new RemoteWebDriver(new Uri("http://localhost:4444/wd/hub"), capabilities_);

    eyes.getLogger().log(`navigating to URL: ${this._testedPageUrl}`);

    let driver;
    try {
      this.beforeOpen(eyes);
      driver = await eyes.open(webDriver, this._testSuitName, testName, this._testedPageSize);
    } catch (err) {
      await webDriver.quit();
      throw err;
    }
    // string userProfile = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
    await driver.get(this._testedPageUrl);
    eyes.getLogger().log(`${testName}: ${TestDataProvider.BatchInfo.getName()}`);

    this._testDataByTestId.get(this._currentTestId).setWrappedDriver(driver);
    this._testDataByTestId.get(this._currentTestId).setWebDriver(webDriver);
  }

  /**
   * @param {boolean} [forceFullPageScreenshot]
   * @return {Eyes}
   * @private
   */
  _initEyes(forceFullPageScreenshot) {
    // if (runner_ is VisualGridRunner && eyes_ != null) return;
    const eyes = new Eyes(this._runner);

    if (forceFullPageScreenshot !== undefined) {
      eyes.setForceFullPageScreenshot(forceFullPageScreenshot);
    }

    eyes.setHideScrollbars(true);
    eyes.setStitchMode(this._stitchMode);
    // eyes.setStitchMode( StitchMode.SCROLL);
    // eyes.setMatchLevel(MatchLevel.Layout);
    eyes.setSaveNewTests(false);
    eyes.setBatch(TestDataProvider.BatchInfo);
    return eyes;
  }

  /**
   * @param {string} testName
   * @return {string}
   * @private
   */
  _setupSeleniumServer(testName) {
    if (TestUtils.RUNS_ON_TRAVIS) {
      if (this._options.getBrowserName() !== 'chrome' && this._options.getBrowserName() !== 'firefox') {
        const sauceOptions = {
          username: TestDataProvider.SAUCE_USERNAME,
          accesskey: TestDataProvider.SAUCE_ACCESS_KEY,
          screenResolution: '1920x1080',
          name: `${testName} (${this.getEyes().getFullAgentId()})`,
        };

        if (this._options.getBrowserName() === 'internet explorer') {
          this._options.set('sauce:options', sauceOptions);
          return TestDataProvider.SAUCE_SELENIUM_URL;
        }

        if (this._options.getBrowserName() === 'safari') {
          this._options.set('sauce:options', sauceOptions);
          return TestDataProvider.SAUCE_SELENIUM_URL;
        }
      }
    }

    const seleniumServerUrl = this._seleniumServerUrl || GeneralUtils.getEnvValue('SELENIUM_SERVER_URL');
    if (seleniumServerUrl != null) {
      if (seleniumServerUrl.includes('ondemand.saucelabs.com')) {
        const sauceOptions = {
          username: TestDataProvider.SAUCE_USERNAME,
          accesskey: TestDataProvider.SAUCE_ACCESS_KEY,
          name: `${testName} (${this.getEyes().getFullAgentId()})`,
        };
        if (this._options.getBrowserName() === 'chrome') {
          this._options.set('UseSpecCompliantProtocol', true);
          this._options.set('BrowserVersion', '77.0');
          this._options.set('sauce:options', sauceOptions);
        }
      } else if (seleniumServerUrl.includes('hub-cloud.browserstack.com')) {
        const browserstackOptions = {
          userName: TestDataProvider.BROWSERSTACK_USERNAME,
          accessKey: TestDataProvider.BROWSERSTACK_ACCESS_KEY,
          name: `${testName} (${this.getEyes().getFullAgentId()})`,
        };

        if (this._options.getBrowserName() === 'chrome') {
          this._options.set('UseSpecCompliantProtocol', true);
          this._options.set('BrowserVersion', '77.0');
          this._options.set('bstack:options', browserstackOptions);
        }
      }
    }
    return seleniumServerUrl;
  }

  /**
   * @param {Eyes} eyes
   */
  beforeOpen(eyes) {
    // do nothing
  }

  /**
   * @return {Eyes}
   */
  getEyes() {
    if (this._testDataByTestId.has(this._currentTestId)) {
      return this._testDataByTestId.get(this._currentTestId).getEyes();
    }

    return null;
  }

  /**
   * @return {EyesWebDriver}
   */
  getDriver() {
    if (this._testDataByTestId.has(this._currentTestId)) {
      return this._testDataByTestId.get(this._currentTestId).getWrappedDriver();
    }
    return null;
  }

  /**
   * @return {IWebDriver}
   */
  getWebDriver() {
    if (this._testDataByTestId.has(this._currentTestId)) {
      return this._testDataByTestId.get(this._currentTestId).getWebDriver();
    }
    return null;
  }

  /**
   * @param {boolean} value
   */
  setCompareExpectedRegion(value) {
    this._compareExpectedRegion = value;
  }

  /**
   * @param {string} value
   */
  setTestedPageUrl(value) {
    this._testedPageUrl = value;
  }

  /**
   * @param {RectangleSize} value
   */
  setTestedPageSize(value) {
    this._testedPageSize = value;
  }

  /**
   * @param {ImageMatchSettings} ims
   * @private
   */
  _compareProperties(ims) {
    const expectedProps = this._testDataByTestId.get(this._currentTestId).getExpectedProperties();

    for (const [propertyNamePath, value] of expectedProps.entries()) {
      const properties = propertyNamePath.split('\\.');

      let currentObject = ims;
      for (const propName of properties) {
        currentObject = currentObject[`get${propName}`]();
        if (!currentObject) {
          break;
        }
      }

      assert.strictEqual(currentObject, value);
    }
  }

  /**
   * @param {ImageMatchSettings} ims
   * @private
   */
  _compareRegions(ims) {
    if (!this._compareExpectedRegion) {
      return;
    }

    const testData = this._testDataByTestId.get(this._currentTestId);
    TestSetup._compareSimpleRegionsList(ims.getAccessibilityRegions(), testData.getExpectedAccessibilityRegions(), 'Accessibility');
    TestSetup._compareSimpleRegionsList(ims.getFloatingRegions(), testData.getExpectedFloatingRegions(), 'Floating');
    TestSetup._compareSimpleRegionsList(ims.getIgnoreRegions(), testData.getExpectedIgnoreRegions(), 'Ignore');
    TestSetup._compareSimpleRegionsList(ims.getLayoutRegions(), testData.getExpectedLayoutRegions(), 'Layout');
    TestSetup._compareSimpleRegionsList(ims.getContentRegions(), testData.getExpectedContentRegions(), 'Content');
    TestSetup._compareSimpleRegionsList(ims.getStrictRegions(), testData.getExpectedStrictRegions(), 'Strict');
  }

  /**
   * @param {object[]} actualRegions
   * @param {object[]} expectedRegions
   * @param {string} type
   * @private
   */
  static _compareSimpleRegionsList(actualRegions, expectedRegions, type) {
    const expectedRegionsClone = new Set(expectedRegions);
    if (expectedRegions.length > 0) {
      for (const region of actualRegions) {
        if (!expectedRegionsClone.delete(region)) {
          assert.fail(`actual ${type} region ${region} not found in expected regions list`);
        }
      }
      assert.ok(expectedRegionsClone.size === 0, `not all expected ${type} regions found in actual regions list.`);
    }
  }

  toString() {
    return `${this._testSuitName} (Browser: ${this._options.getBrowserName()}, UseVisualGrid: ${this._useVisualGrid}, StitchMode: ${this._stitchMode})`;
  }
}

exports.TestSetup = TestSetup;
