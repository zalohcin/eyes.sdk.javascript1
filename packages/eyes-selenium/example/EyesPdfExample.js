'use strict';

require('chromedriver'); // eslint-disable-line node/no-unpublished-require
const { Builder, Capabilities, By } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');
const { GeneralUtils } = require('@applitools/eyes-common'); // should be replaced to '@applitools/eyes-selenium'
const { Eyes, Target, ConsoleLogHandler, StitchMode } = require('../index'); // should be replaced to '@applitools/eyes-selenium'

(async () => {
  // Open a Chrome browser.
  const driver = new Builder()
    // .usingServer('http://localhost:4444/wd/hub')
    .withCapabilities(Capabilities.chrome())
    .setChromeOptions(new ChromeOptions())
    // .addArguments('--load-extension=C:\\Users\\astappiev\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\oemmndcbldboiebfnladdacbdfmadadm\\2.2.191_0'))
    .build();

  // Initialize the eyes SDK and set your private API key.
  const eyes = new Eyes();
  // eyes.setApiKey('Your API Key');
  eyes.setLogHandler(new ConsoleLogHandler(true));
  // eyes.setProxy('http://localhost:8888');
  // eyes.setStitchMode(StitchMode.CSS);

  try {
    await eyes.open(driver, 'Eyes Examples', 'My first PDF test!');

    await driver.get('http://www.pdf995.com/samples/pdf.pdf');

    await GeneralUtils.sleep(1000);

    await eyes.check('Main Page', Target.window().fully());

    await eyes.close();
  } finally {
    await driver.quit();
    await eyes.abort();
  }
})();
