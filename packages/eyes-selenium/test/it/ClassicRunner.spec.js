'use strict';

require('chromedriver');
const assert = require('assert');
const { Builder, Capabilities } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');
const { Eyes, ClassicRunner, Target, Configuration, BatchInfo, ConsoleLogHandler } = require('../../index');

const batchInfo = new BatchInfo('ClassicRunner batch');

function initializeEyes({ runner, testName }) {
  const eyes = new Eyes(runner);
  eyes.setLogHandler(new ConsoleLogHandler(false));

  const configuration = new Configuration();
  configuration.setAppName('ClassicRunner');
  configuration.setTestName(testName);
  configuration.setBatch(batchInfo);

  eyes.setConfiguration(configuration);
  return eyes;
}

async function runTest({ url, runner, testName }) {
  const eyes = initializeEyes({ runner, testName });

  const driver = new Builder()
    .withCapabilities(Capabilities.chrome())
    .setChromeOptions(new ChromeOptions().headless())
    .build();

  try {
    await driver.get(url);
    await eyes.open(driver);
    await eyes.check(`Main Page ${url}`, Target.window());
    await eyes.close(false);
  } catch (error) {
    console.error(error);
  } finally {
    await driver.quit();
  }
}

describe('ClassicRunner', function () {
  this.timeout(5 * 60 * 1000);

  it('test multiple pages and get merged results', async function () {
    const urlsToTest = [
      'https://applitools.com/helloworld',
      'http://applitools-dom-capture-origin-1.surge.sh/testWithIframe.html',
      'http://applitools.github.io/demo/TestPages/FramesTestPage/',
    ];

    const runner = new ClassicRunner();
    for (const url of urlsToTest) {
      const testName = (urlsToTest.indexOf(url)).toString();
      await runTest({ url, runner, testName }).catch(console.error);
    }

    const results = await runner.getAllTestResults(false);
    assert.strictEqual(results.getAllResults().length, 3);
  });
});
