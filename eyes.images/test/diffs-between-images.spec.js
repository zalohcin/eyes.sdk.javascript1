'use strict';

const { ConsoleLogHandler } = require('@applitools/eyes.sdk.core');
const { Eyes } = require('../index');

let eyes = null;
describe('Eyes.Images.JavaScript - find diffs between image', function () {
  before(function () {
    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(true));
  });

  it('should be similar', function () {
    const testName = `${this.test.title}_${Math.random().toString(36).substring(2, 12)}`;
    const image1 = `${__dirname}/resources/image2.png`;
    const image2 = `${__dirname}/resources/image2.png`;

    return eyes.open(this.test.parent.title, testName)
      .then(() => eyes.checkImage(image1))
      .then(() => eyes.close(false))
      .then(() => eyes.open(this.test.parent.title, testName)
        .then(() => eyes.checkImage(image2))
        .then(() => eyes.close()));
  });

  afterEach(function () {
    return eyes.abortIfNotClosed();
  });
});
