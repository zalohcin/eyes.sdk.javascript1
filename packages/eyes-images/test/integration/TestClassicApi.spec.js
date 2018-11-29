'use strict';

const { ConsoleLogHandler, Region, MouseTrigger, Location } = require('@applitools/eyes-sdk-core');
const { Eyes } = require('../../index');

let /** @type {Eyes} */ eyes;
describe('EyesImages.TestClassicApi', function () {
  this.timeout(5 * 60 * 1000);

  before(function () {
    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(true));
    // eyes.setProxy('http://localhost:8888');

    eyes.setHostOS('Mac OS X 10.10');
    eyes.setHostApp('My browser');
  });

  beforeEach(async function () {
    await eyes.open(this.test.parent.title, this.currentTest.title);
  });

  it('TestImage', async function () {
    eyes.addMouseTrigger(MouseTrigger.MouseAction.Click, new Region(288, 44, 92, 36), new Location(10, 10));

    await eyes.checkImage(`${__dirname}/../resources/image1.png`, this.test.title);
    await eyes.close();
  });

  it('TestRegion', async function () {
    eyes.addMouseTrigger(MouseTrigger.MouseAction.Click, new Region(288, 44, 92, 36), new Location(10, 10));

    await eyes.checkRegion(`${__dirname}/../resources/image1.png`, new Region(309, 227, 381, 215), this.test.title);
    await eyes.close();
  });

  afterEach(async function () {
    await eyes.abortIfNotClosed();
  });
});
