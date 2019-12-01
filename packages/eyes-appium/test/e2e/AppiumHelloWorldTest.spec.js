'use strict';

const { Builder, By, Capabilities, Capability } = require('selenium-webdriver');
const { Eyes } = require('../../index');

describe('AppiumHelloWorldTest', function () {
  this.timeout(5 * 60 * 1000);

  it('HelloWorld', async function () {
    // This is your api key, make sure you use it in all your tests.
    const eyes = new Eyes();

    // Set the desired capabilities.
    const caps = new Capabilities();
    caps.set('platformName', 'Android');
    caps.set('platformVersion', '6.0.1');
    caps.set('deviceName', 'LGE Nexus 5');
    caps.set('browserName', 'Chrome');
    // caps.set('chromedriverExecutable', 'C:/Users/USER/devel/Eyes.Sdk.DotNet/bin/deps/WebDriver/chromedriver.exe');

    const driver = new Builder()
      .usingServer('http://127.0.0.1:4723/wd/hub')
      .withCapabilities(caps)
      .build();

    await driver.sleep(120 * 1000);

    try {
      // Start visual testing.
      await eyes.open(driver, 'Hello World!', 'My first Appium C# test!');

      // Navigate the browser to the "hello world!" web-site.
      await driver.get('https://applitools.com/helloworld');

      // Visual checkpoint #1.
      await eyes.checkWindow('Hello!');

      // Click the "Click me!" button.
      await driver.findElement(By.tagName('button')).click();

      // Visual checkpoint #2.
      await eyes.checkWindow('Click!');

      // End the test.
      await eyes.close();
    } catch (err) {
      console.log(err);
    } finally {
      // Close the browser.
      await driver.quit();

      // If the test was aborted before eyes.Close was called, ends the test as aborted.
      await eyes.abortIfNotClosed();
    }
  });
});
