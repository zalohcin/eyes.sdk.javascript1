'use strict';

const { ConsoleLogHandler, RectangleSize, Region } = require('@applitools/eyes.sdk.core');
const { Target } = require('@applitools/eyes.selenium');
const { Eyes } = require('../../index');

let eyes = null;
describe('Eyes.Protractor.JavaScript - check region', () => {
  beforeAll(function () {
    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(true));
  });

  it('test check region methods', function () {
    return eyes.open(browser, global.appName, global.testName, new RectangleSize(800, 560)).then(() => {
      browser.get('https://astappev.github.io/test-html-pages/');

      // Region by rect, equivalent to eyes.checkFrame()
      eyes.check('Region by rect', Target.region(new Region(50, 50, 200, 200)));

      // Region by element, equivalent to eyes.checkRegionByElement()
      eyes.check('Region by element', Target.region(element(by.css('body > h1'))));

      // Region by locator, equivalent to eyes.checkRegionBy()
      eyes.check('Region by locator', Target.region(by.id('overflowing-div-image')));

      // Entire element by element, equivalent to eyes.checkElement()
      eyes.check('Entire element by element', Target.region(element(by.id('overflowing-div-image'))).fully());

      // Entire element by locator, equivalent to eyes.checkElementBy()
      eyes.check('Entire element by locator', Target.region(by.id('overflowing-div')).fully());

      // Entire frame by locator, equivalent to eyes.checkFrame()
      eyes.check('Entire frame by locator', Target.frame(by.name('frame1')));

      // Entire region in frame by frame name and region locator, equivalent to eyes.checkRegionInFrame()
      eyes.check('Entire region in frame by frame name and region locator', Target.region(by.id('inner-frame-div'), 'frame1').fully());

      return eyes.close();
    });
  });

  afterEach(function () {
    return eyes.abortIfNotClosed();
  });
});
