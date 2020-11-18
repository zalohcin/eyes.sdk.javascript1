'use strict';
const chalk = require('chalk');

const statuses = {
  Passed: {
    color: 'green',
    symbol: '\u2713'
  },
  Failed: {
    color: 'red',
    symbol: '\u2716'
  },
  Empty: {
    color: 'yellow',
    symbol: '\u26A0'
  },
  Unresolved: {
    color: 'red',
    symbol: '\u2716'
  }
};

function errorDigest({passed, failed, diffs, empty, logger}) {
  logger.log('errorDigest: diff errors', diffs);
  logger.log('errorDigest: test errors', failed);

  const testLink = diffs.length ? `\n\n${indent(2)}See details at: ${diffs[0].getUrl()}` : '';

  return `Eyes-Cypress detected diffs or errors during execution of visual tests:
${indent(2)}${chalk.green(`Passed - ${passed.length} tests`)}${testResultsToString(passed, true)}
${indent(2)}${chalk.yellow(`Empty - ${empty.length} tests`)}${testResultsToString(empty)}
${indent(2)}${chalk.red(`Diffs detected - ${diffs.length} tests`)}${testResultsToString(diffs)}
${indent(2)}${chalk.red(`Errors - ${failed.length} tests`)}${testResultsToString(
    failed,
  )}${testLink}`;
}

function stringifyTestResults(testResults) {
  const hostDisplaySize = testResults.getHostDisplaySize();
  const viewport = hostDisplaySize ? `[${hostDisplaySize}]` : '';
  return `${testResults.getName()}${viewport}${
    testResults.error ? ` : ${testResults.error}` : ''
  }`;
}

function stringifyError(error) {
  return `[Eyes test not started] : ${error}`;
}

function testResultsToString(testResultsArr, isGood) {
  const resultString = testResultsArr.map(testResults => {
    const formattedResult = getFormattedResult(testResults)
    return `${formattedResult} ${chalk.reset(
      testResults instanceof Error
        ? stringifyError(testResults)
        : stringifyTestResults(testResults),
    )}`
  })
  return testResultsArr.length ? `\n${indent(3)}${resultString.join(`\n${indent(3)}`)}` : '';
}

function getFormattedResult(result) {
  const status = result.getStatus();
  const { color, symbol } = statuses[status];
  return color ? `${chalk[color](symbol)}` : '';
}

function indent(count) {
  return `   ${'  '.repeat(count)}`;
}

module.exports = errorDigest;
