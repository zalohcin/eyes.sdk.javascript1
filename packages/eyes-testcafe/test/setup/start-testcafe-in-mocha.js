'use strict';

const createTestCafe = require('testcafe');

function startTestCafe({ beforeEach, afterEach }) {
  let testCafe, runner;

  beforeEach(async () => {
    testCafe = await createTestCafe('localhost', 1337);
    runner = testCafe.createRunner();
    runner.screenshots('logs/').browsers('chrome:headless');
  });

  afterEach(async () => {
    await testCafe.close();
  });

  return { runFileInTestCafe };

  async function runFileInTestCafe(filepath) {
    return runner.src(filepath).run();
  }
}

module.exports = startTestCafe; // eslint-disable-line node/exports-style
