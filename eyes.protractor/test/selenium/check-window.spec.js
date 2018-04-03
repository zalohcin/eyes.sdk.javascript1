'use strict';

const { ConsoleLogHandler, RectangleSize } = require('@applitools/eyes.sdk.core');
const { Target } = require('@applitools/eyes.selenium');
const { Eyes } = require('../../index');

let eyes = null;
describe('Eyes.Protractor.JavaScript - check window', () => {
  beforeAll(function () {
    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(true));
    eyes.setHideScrollbars(true);
  });

  it('test check window methods', function () {
    return eyes.open(browser, global.appName, global.testName, new RectangleSize(800, 560)).then(() => {
      browser.get('https://astappev.github.io/test-html-pages/');

      eyes.check('Partial window', Target.window());

      eyes.check('Entire window', Target.window().fully());

      return eyes.close();
    });
  });

  afterEach(function () {
    return eyes.abortIfNotClosed();
  });
});
