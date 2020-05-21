'use strict'

const path = require('path')

const {
  FileLogHandler,
  NullLogHandler,
  FileDebugScreenshotsProvider,
  DateTimeUtils,
} = require('@applitools/eyes-selenium')

class TestUtils {
  /**
   * @param {string} testName
   * @return {string}
   */
  static initLogPath(testName) {
    const dateString = DateTimeUtils.toLogFileDateTime()
    const extendedTestName = `${testName}_${dateString}`
    const logsPath = process.env.APPLITOOLS_LOGS_PATH || '.'
    return path.join(logsPath, 'JS4', extendedTestName)
  }

  /**
   * @param {string} [testName]
   * @param {string} [logPath]
   * @return {LogHandler}
   */
  static initLogHandler(testName, logPath) {
    if (!TestUtils.RUNS_ON_CI) {
      logPath = logPath || TestUtils.initLogPath(testName)
      return new FileLogHandler(true, path.join(logPath, 'log.log'), true)
    }
    // return new NunitLogHandler(false);
    return new NullLogHandler()
  }

  /**
   * @param {Eyes} eyes
   * @param {string} [testName]
   */
  static setupLogging(eyes, testName) {
    let logHandler = null

    if (!TestUtils.RUNS_ON_CI) {
      const logPath = TestUtils.initLogPath(testName)
      eyes.setDebugScreenshotsProvider(new FileDebugScreenshotsProvider())
      eyes.setDebugScreenshotsPath(logPath)
      eyes.setDebugScreenshotsPrefix(`${testName}_`)
      logHandler = new FileLogHandler(true, path.join(logPath, `${testName}.log`), true)
    } else {
      // logHandler = new NunitLogHandler(false);
      logHandler = new NullLogHandler()
    }

    if (logHandler) {
      eyes.setLogHandler(logHandler)
    }

    // Eyes.moveWindow_ = typeof v8debug !== 'object';
  }
}

TestUtils.RUNS_ON_CI = process.env.CI != null

exports.TestUtils = TestUtils
