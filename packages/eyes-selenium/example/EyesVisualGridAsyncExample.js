'use strict';

require('chromedriver'); // eslint-disable-line node/no-unpublished-require
const { Builder, Capabilities } = require('selenium-webdriver');
const { Eyes, VisualGridRunner, Target, ConsoleLogHandler, Configuration, BrowserType, DeviceName, ScreenOrientation } = require('../index'); // should be replaced to '@applitools/eyes-selenium'

function initEyes(visualGridRunner) {
  const eyes = new Eyes(visualGridRunner);
  // eyes.setApiKey('Your API Key');
  eyes.setLogHandler(new ConsoleLogHandler(false));

  const configuration = new Configuration();
  configuration.setConcurrentSessions(3);
  configuration.setAppName('Eyes Examples');
  configuration.setTestName('My first Javascript test!');
  configuration.addBrowser(1200, 800, BrowserType.CHROME);
  configuration.addBrowser(1200, 800, BrowserType.FIREFOX);
  configuration.addDeviceEmulation(DeviceName.iPhone_4, ScreenOrientation.PORTRAIT);
  // configuration.setProxy('http://localhost:8888');
  eyes.setConfiguration(configuration);
  return eyes;
}

async function testUrl(url, visualGridRunner) {
  const driver = new Builder()
    .withCapabilities(Capabilities.chrome())
    .build();

  const eyes = initEyes(visualGridRunner);

  try {
    await eyes.open(driver);

    await driver.get(url);

    await eyes.check('Main Page ' + url, Target.window());

    await eyes.closeAsync();
  } catch (e) {
    console.log('Error', e); // eslint-disable-line
  } finally {
    await driver.quit();
  }
}

(async () => {
  const visualGridRunner = new VisualGridRunner();

  try {
    const urlsToTest = [
      'https://applitools.com/helloworld',
      'http://applitools-dom-capture-origin-1.surge.sh/testWithIframe.html',
      'http://applitools.github.io/demo/TestPages/FramesTestPage/',
    ];

    for (const url of urlsToTest) {
      await testUrl(url, visualGridRunner);
    }

    const results = await visualGridRunner.getAllTestResults(false);
    console.log(results); // eslint-disable-line
  } catch (e) {
    // if results failed, it goes here
    console.log('Error', e); // eslint-disable-line
  }
})();
