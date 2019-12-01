'use strict';

const path = require('path');
const axios = require('axios');

const { GeneralUtils, FileLogHandler, BatchInfo, TypeUtils, ConsoleLogHandler, FileDebugScreenshotsProvider, DateTimeUtils } = require('@applitools/eyes-common');
const { SessionResults } = require('@applitools/eyes-sdk-core').metadata;

class TestUtils {
  /**
   * @param {string} testName
   * @return {string}
   */
  static initLogPath(testName) {
    const dateString = DateTimeUtils.toLogFileDateTime();
    const extendedTestName = `${testName}_${dateString}`;
    const logsPath = process.env.APPLITOOLS_LOGS_PATH || '.';
    return path.join(logsPath, 'JS4', extendedTestName);
  }

  /**
   * @param {string} [testName]
   * @param {string} [logPath]
   * @return {LogHandler}
   */
  static initLogHandler(testName, logPath) {
    if (!TestUtils.RUNS_ON_CI) {
      logPath = logPath || TestUtils.initLogPath(testName);
      return new FileLogHandler(true, path.join(logPath, 'log.log'), true);
    }
    // return new NunitLogHandler(false);
    return new ConsoleLogHandler();
  }

  /**
   * @param {Eyes} eyes
   * @param {string} [testName]
   */
  static setupLogging(eyes, testName) {
    let logHandler = null;

    if (!TestUtils.RUNS_ON_CI) {
      const logPath = TestUtils.initLogPath(testName);
      eyes.setDebugScreenshotsProvider(new FileDebugScreenshotsProvider());
      eyes.setDebugScreenshotsPath(logPath);
      eyes.setDebugScreenshotsPrefix(`${testName}_`);
      logHandler = new FileLogHandler(true, path.join(logPath, `${testName}.log`), true);
    } else {
      // logHandler = new NunitLogHandler(false);
      logHandler = new ConsoleLogHandler();
    }

    if (logHandler) {
      eyes.setLogHandler(logHandler);
    }

    // Eyes.moveWindow_ = typeof v8debug !== 'object';
  }

  /**
   * @param {string} apiKey
   * @param {TestResults} testResults
   * @return {SessionResults}
   */
  static async getSessionResults(apiKey, testResults) {
    const apiSessionUrl = testResults && testResults.getApiUrls() && testResults.getApiUrls().getSession() ?
      testResults.getApiUrls().getSession() :
      null;

    if (TypeUtils.isNull(apiSessionUrl)) {
      return null;
    }

    const response = await axios({
      method: 'get',
      url: apiSessionUrl,
      params: {
        format: 'json',
        AccessToken: testResults.getSecretToken(),
        apiKey,
      },
    });

    return new SessionResults(response.data);
  }

  /**
   * @param {Eyes} eyes
   * @return {BatchInfo}
   */
  static async getBatchInfo(eyes) {
    const response = await axios({
      method: 'get',
      url: `api/sessions/batches/${eyes.getBatch().getId()}/bypointerid`,
      baseURL: eyes.getServerUrl(),
      params: {
        apiKey: eyes.getApiKey(),
      },
    });

    return new BatchInfo(response.data);
  }

  /**
   * @param {TestResultReportSummary} reportSummary
   * @return {void}
   */
  static async sendReport(reportSummary) {
    const options = {
      method: 'POST',
      url: '/result',
      baseURL: 'http://sdk-test-results.herokuapp.com',
      data: reportSummary.toJSON(),
    };

    // TODO: this throws an error and says that JS4 SDK is not registered
    // await axios(options).catch((err) => {
    //   console.error(err);
    // });
  }
}

TestUtils.RUNS_ON_CI = GeneralUtils.getEnvValue('CI') !== undefined;
TestUtils.RUNS_ON_TRAVIS = GeneralUtils.getEnvValue('TRAVIS', true) === true;
TestUtils.RUN_HEADLESS = typeof v8debug !== 'object' || TestUtils.RUNS_ON_CI;

exports.TestUtils = TestUtils;
