'use strict';

const { makeVisualGridClient } = require('@applitools/visual-grid-client');
const { getProcessPageAndSerializeScript } = require('@applitools/dom-snapshot');
const { ArgumentGuard, TypeUtils } = require('@applitools/eyes-common');
const { RectangleSize, TestFailedError, TestResultsFormatter, CorsIframeHandle, CorsIframeHandler, EyesAbstract } = require('@applitools/eyes-sdk-core');
const { EyesWebDriver } = require('./wrappers/EyesWebDriver');
const { EyesSeleniumUtils } = require('./EyesSeleniumUtils');

const { RenderingConfiguration } = require('./config/RenderingConfiguration');

class EyesRendering extends EyesAbstract {
  /**
   * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
   *
   * @param {string} [serverUrl=EyesBase.getDefaultServerUrl()] The Eyes server URL.
   * @param {boolean} [isDisabled=false] Set to true to disable Applitools Eyes and use the webdriver directly.
   */
  constructor(serverUrl, isDisabled) {
    super(new RenderingConfiguration());

    this._configuration.setServerUrl(serverUrl);
    this._configuration.setIsDisabled(isDisabled);

    /** @type {boolean} */ this._isOpen = false;
    /** @type {boolean} */ this._isVisualGrid = true;
    /** @type {EyesJsExecutor} */ this._jsExecutor = undefined;
    /** @type {CorsIframeHandle} */ this._corsIframeHandle = CorsIframeHandle.BLANK;
    /** @type {string} */ this._processPageAndSerializeScript = undefined;

    this._checkWindowCommand = undefined;
    this._closeCommand = undefined;
  }

  /**
   * @param {WebDriver} webDriver
   * @param appName
   * @param testName
   * @param viewportSize
   * @param {RenderingConfiguration|Object} configuration
   */
  async open(webDriver, appName, testName, viewportSize, configuration) {
    this._logger.verbose('enter');

    ArgumentGuard.notNull(webDriver, 'webDriver');
    ArgumentGuard.notNull(configuration, 'configuration');

    const newConfiguration = (configuration instanceof RenderingConfiguration) ? configuration : RenderingConfiguration.fromObject(configuration);
    this._configuration.mergeConfig(newConfiguration);

    await this._initDriver(webDriver);

    if (appName) {
      this._configuration.setAppName(appName);
    }

    if (testName) {
      this._configuration.setTestName(testName);
    }

    const { openEyes } = makeVisualGridClient({
      apiKey: this._configuration.getApiKey(),
      showLogs: this._configuration.getShowLogs(),
      saveDebugData: this._configuration.getSaveDebugData(),
      proxy: this._configuration.getProxy(),
      serverUrl: this._configuration.getServerUrl(),
      renderConcurrencyFactor: this._configuration.getConcurrentSessions(),
    });

    this._processPageAndSerializeScript = await getProcessPageAndSerializeScript();

    this._logger.verbose('opening openEyes...');

    viewportSize = viewportSize ? viewportSize : this.getViewportSize();
    if (viewportSize) {
      await this.setViewportSize(viewportSize);
    }

    const { checkWindow, close } = await openEyes({
      logger: this._logger,

      appName: this._configuration.getAppName(),
      testName: this._configuration.getTestName(),
      browser: this._configuration.getBrowsersInfo(),
      properties: this._configuration.getProperties(),
      batchName: this._configuration.getBatch() && this._configuration.getBatch().getName(),
      batchId: this._configuration.getBatch() && this._configuration.getBatch().getId(),
      baselineBranchName: this._configuration.getBaselineBranchName(),
      baselineEnvName: this._configuration.getBaselineEnvName(),
      baselineName: this._configuration.getBaselineEnvName(),
      envName: this._configuration.getEnvironmentName(),
      branchName: this._configuration.getBranchName(),
      saveFailedTests: this._configuration.getSaveFailedTests(),
      saveNewTests: this._configuration.getSaveNewTests(),
      compareWithParentBranch: this._configuration.getCompareWithParentBranch(),
      ignoreBaseline: this._configuration.getIgnoreBaseline(),
      parentBranchName: this._configuration.getParentBranchName(),
      agentId: this._configuration.getAgentId(),
      isDisabled: this._configuration.getIsDisabled(),
      matchTimeout: this._configuration.getMatchTimeout(),

      ignoreCaret: this._defaultMatchSettings.getIgnoreCaret(),
      matchLevel: this._defaultMatchSettings.getMatchLevel(),

      // renderBatch,
      // waitForRenderedStatus,
      // renderThroat,
      // getRenderInfoPromise,
      // getHandledRenderInfoPromise,
      // getRenderInfo,
      // createRGridDOMAndGetResourceMapping,
      // eyesTransactionThroat,
    });

    this._checkWindowCommand = checkWindow;
    this._closeCommand = close;
    this._isOpen = true;
    this._logger.verbose('done');

    return this._driver;
  }

  /**
   * @private
   * @param {WebDriver} webDriver
   */
  async _initDriver(webDriver) {
    if (TypeUtils.hasMethod(webDriver, ['executeScript', 'executeAsyncScript'])) {
      this._jsExecutor = webDriver;
    }

    if (webDriver instanceof EyesWebDriver) {
      this._driver = webDriver;
    } else {
      this._driver = new EyesWebDriver(this._logger, this, webDriver);
    }
  }

  /**
   * Warning! You will get an array of TestResults.
   *
   * @param {boolean} [throwEx]
   * @return {Promise<TestResults[]>}
   */
  async close(throwEx) {
     const results = await this.closeAndReturnResults(throwEx);
     return results && results.length > 0 ? results[0] : null;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @return {TestResults}
   */
  abortIfNotClosed() {
    return null; // TODO - implement?
  }

  /**
   * @return {boolean}
   */
  getIsOpen() {
    return this._isOpen;
  }

  /**
   * @param {boolean} [throwEx]
   * @return {Promise<TestResults[]>}
   */
  async closeAndReturnResults(throwEx = true) {
    try {
      return await this._closeCommand(throwEx);
    } finally {
      this._isOpen = false;
    }
  }

  /**
   * @param {boolean} [throwEx]
   * @return {Promise<*>}
   */
  async closeAndPrintResults(throwEx = true) {
    const results = await this.closeAndReturnResults(throwEx);

    const testResultsFormatter = new TestResultsFormatter(results);
    // eslint-disable-next-line no-console
    console.log(testResultsFormatter.asFormatterString());
  }

  getEyesRunner() {
    const runner = {};
    runner.getAllResults = () => {
      return this.closeAndReturnResults();
    };
    return runner;
  }

  /**
   * @return {boolean}
   */
  isEyesClosed() {
    return this._isOpen;
  }

  /**
   * @param {string} name
   * @param {SeleniumCheckSettings} checkSettings
   */
  async check(name, checkSettings) {
    ArgumentGuard.notNull(checkSettings, 'checkSettings');

    if (TypeUtils.isNotNull(name)) {
      checkSettings.withName(name);
    }

    this._logger.verbose(`Dom extraction starting   (${checkSettings.toString()})   $$$$$$$$$$$$`);

    let targetSelector = await checkSettings.getTargetProvider();
    if (targetSelector) {
      targetSelector = await targetSelector.getSelector(this);
    }

    const domCaptureScript = `var callback = arguments[arguments.length - 1]; return (${this._processPageAndSerializeScript})().then(JSON.stringify).then(callback, function(err) {callback(err.stack || err.toString())})`;
    const results = await this._jsExecutor.executeAsyncScript(domCaptureScript);
    const { cdt, url: pageUrl, blobs, resourceUrls, frames } = JSON.parse(results);

    if (this.getCorsIframeHandle() === CorsIframeHandle.BLANK) {
      CorsIframeHandler.blankCorsIframeSrcOfCdt(cdt, frames);
    }

    const resourceContents = blobs.map(({ url, type, value }) => ({
      url,
      type,
      value: Buffer.from(value, 'base64'),
    }));

    this._logger.verbose(`Dom extracted  (${checkSettings.toString()})   $$$$$$$$$$$$`);

    await this._checkWindowCommand({
      resourceUrls,
      resourceContents,
      // frames
      url: pageUrl,
      cdt,
      tag: checkSettings.getName(),
      sizeMode: checkSettings.getSizeMode(),
      selector: targetSelector,
      region: checkSettings.getTargetRegion(),
      scriptHooks: checkSettings.getScriptHooks(),
      ignore: checkSettings.getIgnoreRegions(),
      floating: checkSettings.getFloatingRegions(),
      sendDom: checkSettings.getSendDom() ? checkSettings.getSendDom() : this.getSendDom(),
      matchLevel: checkSettings.getMatchLevel() ? checkSettings.getMatchLevel() : this.getMatchLevel(),
    });
  }

  /**
   * @return {RectangleSize}
   */
  getViewportSize() {
    return this._configuration.getViewportSize();
  }

  /**
   * @param {RectangleSize} viewportSize
   */
  async setViewportSize(viewportSize) {
    ArgumentGuard.notNull(viewportSize, 'viewportSize');
    viewportSize = new RectangleSize(viewportSize);
    this._configuration.setViewportSize(viewportSize);

    if (this._driver) {
      const originalFrame = this._driver.getFrameChain();
      await this._driver.switchTo().defaultContent();

      try {
        await EyesSeleniumUtils.setViewportSize(this._logger, this._driver, viewportSize);
      } catch (err) {
        await this._driver.switchTo().frames(originalFrame); // Just in case the user catches that error
        throw new TestFailedError('Failed to set the viewport size', err);
      }

      await this._driver.switchTo().frames(originalFrame);
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  isVisualGrid() {
    return this._isVisualGrid;
  }

  /**
   * @param corsIframeHandle
   */
  setCorsIframeHandle(corsIframeHandle) {
    this._corsIframeHandle = corsIframeHandle;
  }

  /**
   * @return {CorsIframeHandle}
   */
  getCorsIframeHandle() {
    return this._corsIframeHandle;
  }
}

exports.EyesRendering = EyesRendering;
