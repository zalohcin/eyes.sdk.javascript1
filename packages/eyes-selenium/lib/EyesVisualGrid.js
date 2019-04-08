'use strict';

const { makeVisualGridClient } = require('@applitools/visual-grid-client');
const { getProcessPageAndSerializeScript } = require('@applitools/dom-snapshot');
const { ArgumentGuard, TypeUtils } = require('@applitools/eyes-common');

const {
  TestFailedError,
  TestResultsFormatter,
  CorsIframeHandle,
  CorsIframeHandler,
} = require('@applitools/eyes-sdk-core');

const { VisualGridRunner } = require('./visualgrid/VisualGridRunner');
const { BrowserType } = require('./config/BrowserType');
const { Eyes } = require('./Eyes');

const VERSION = require('../package.json').version;

/**
 * @ignore
 */
class EyesVisualGrid extends Eyes {
  /** @var {Logger} EyesVisualGrid#_logger */
  /** @var {Configuration} EyesVisualGrid#_configuration */
  /** @var {ImageMatchSettings} EyesVisualGrid#_defaultMatchSettings */

  /**
   * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
   *
   * @param {string} [serverUrl=EyesBase.getDefaultServerUrl()] - The Eyes server URL.
   * @param {boolean} [isDisabled=false] - Set {@code true} to disable Applitools Eyes and use the WebDriver directly.
   * @param {VisualGridRunner} [visualGridRunner] - Set {@code true} to disable Applitools Eyes and use the WebDriver directly.
   */
  constructor(serverUrl, isDisabled, visualGridRunner = new VisualGridRunner()) {
    super(serverUrl, isDisabled, true);

    /** @type {VisualGridRunner} */ this._visualGridRunner = visualGridRunner;
    this._visualGridRunner._eyes = this;

    /** @type {string} */ this._processPageAndSerializeScript = undefined;
    /** @function */ this._checkWindowCommand = undefined;
    /** @function */ this._closeCommand = undefined;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @override
   * @protected
   * @return {string} - The base agent id of the SDK.
   */
  getBaseAgentId() {
    return `eyes.selenium.visualgrid.javascript/${VERSION}`;
  }

  /**
   * @inheritDoc
   */
  async open(driver, appName, testName, viewportSize, sessionType) {
    ArgumentGuard.notNull(driver, 'driver');

    // noinspection NonBlockStatementBodyJS
    if (appName) this._configuration.setAppName(appName);
    // noinspection NonBlockStatementBodyJS
    if (testName) this._configuration.setTestName(testName);
    // noinspection NonBlockStatementBodyJS
    if (viewportSize) this._configuration.setViewportSize(viewportSize);
    // noinspection NonBlockStatementBodyJS
    if (sessionType) this._configuration.setSessionType(sessionType);

    // noinspection NonBlockStatementBodyJS
    if (this._visualGridRunner.getConcurrentSessions()) {
      this._configuration.setConcurrentSessions(this._visualGridRunner.getConcurrentSessions());
    }

    await this._initDriver(driver);

    const { openEyes } = makeVisualGridClient({
      logger: this._logger,
      apiKey: this._configuration.getApiKey(),
      showLogs: this._configuration.getShowLogs(),
      saveDebugData: this._configuration.getSaveDebugData(),
      proxy: this._configuration.getProxy(),
      serverUrl: this._configuration.getServerUrl(),
      renderConcurrencyFactor: this._configuration.getConcurrentSessions(),
    });

    this._processPageAndSerializeScript = await getProcessPageAndSerializeScript();

    if (this._configuration.getViewportSize()) {
      await this.setViewportSize(this._configuration.getViewportSize());

      if (this._configuration.getBrowsersInfo().length === 0) {
        this._configuration.addBrowser(this._configuration.viewportSize.getWidth(), this._configuration.viewportSize.getHeight(), BrowserType.CHROME);
      }
    }

    const { checkWindow, close } = await openEyes({
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
      agentId: this.getFullAgentId(),
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

    return this._driver;
  }

  /**
   * @param {boolean} [throwEx]
   * @return {Promise<TestResults>}
   */
  async close(throwEx = true) {
    try {
      const results = await this._closeCommand(throwEx);

      for (const result of results) {
        if (result instanceof TestFailedError) {
          return result.getTestResults();
        }
      }

      return results[0];
    } catch (err) {
      if (Array.isArray(err)) {
        for (const result of err) {
          if (result instanceof Error) {
            throw result;
          }
        }

        throw err[0];
      }

      throw err;
    } finally {
      this._isOpen = false;
    }
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @return {Promise<?TestResults>}
   */
  async abortIfNotClosed() {
    return null; // TODO - implement?
  }

  /**
   * @inheritDoc
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
    const results = await this._driver.executeAsyncScript(domCaptureScript);
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
      sizeMode: checkSettings.getSizeMode() === 'viewport' && this.getForceFullPageScreenshot() ? 'full-page' : checkSettings.getSizeMode(),
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
   * @return {VisualGridRunner}
   */
  getRunner() {
    return this._visualGridRunner;
  }
}

exports.EyesVisualGrid = EyesVisualGrid;
