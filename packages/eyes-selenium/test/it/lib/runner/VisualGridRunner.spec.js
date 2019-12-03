'use strict';

const assert = require('assert');
const path = require('path');
const { readFileSync, writeFileSync } = require('fs');
const { Eyes, VisualGridRunner } = require('../../../../index');

function parseData(input) {
  return JSON.stringify(
    input,
    null,
    2
  );
}

function getFixture(name) {
  return JSON.parse(readFileSync(path.join(__dirname, '..', '..', '..', 'fixtures', name)));
}

function updateFixture(name, input) {
  if (!process.env.APPLITOOLS_UPDATE_FIXTURES) return;
  writeFileSync(
    path.join(__dirname, '..', '..', '..', 'fixtures', name),
    parseData(input)
  );
}

describe('VisualGridRunner', function () {
  const browsersInfo = [
    {
      width: 800,
      height: 600,
      name: 'firefox',
    },
    {
      deviceName: 'iPhone 4',
      screenOrientation: 'portrait',
    },
  ];

  const conf = {
    apiKey: process.env.APPLITOOLS_API_KEY,
    appName: 'myAppName',
    testName: 'myTestName',
    setSendDom: false,
    browsersInfo,
    batch: {
      id: 'myBatchId',
      name: 'myBatchName',
      notifyOnCompletion: true,
    },
  };

  const eyes = new Eyes(new VisualGridRunner());
  eyes.setConfiguration(conf);

  it('should have a valid open configuration', () => {
    const actual = parseData(eyes._makeOpenEyesConfiguration());

    const fixtureName = 'VisualGridRunner.openEyesConfiguration.json';
    updateFixture(fixtureName, actual);

    assert.deepStrictEqual(actual, getFixture(fixtureName));
  });
});
