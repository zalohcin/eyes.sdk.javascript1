'use strict';

const assert = require('assert');
const { Eyes, ClassicRunner, Target, BatchInfo, MatchLevel, VisualGridRunner, Configuration } = require('../../../index');
const { SeleniumUtils } = require('../Utils/SeleniumUtils');
const { TestUtils } = require('../Utils/TestUtils');
const { TestDataProvider } = require('../TestDataProvider');

describe('TestConfigurationSentCorrectlyToServer', function () {
  [
    { useVisualGrid: false, sequenceName: 'Test Sequence', sequenceNameEnvVar: 'Test Sequence Name Env Var' },
    { useVisualGrid: false, sequenceName: 'Test Sequence', sequenceNameEnvVar: null },
    { useVisualGrid: false, sequenceName: null, sequenceNameEnvVar: 'Test Sequence Name Env Var' },
    { useVisualGrid: false, sequenceName: null, sequenceNameEnvVar: null },
    { useVisualGrid: true, sequenceName: 'Test Sequence', sequenceNameEnvVar: 'Test Sequence Name Env Var' },
    { useVisualGrid: true, sequenceName: 'Test Sequence', sequenceNameEnvVar: null },
    { useVisualGrid: true, sequenceName: null, sequenceNameEnvVar: 'Test Sequence Name Env Var' },
    { useVisualGrid: true, sequenceName: null, sequenceNameEnvVar: null },
  ].forEach(({ useVisualGrid, sequenceName, sequenceNameEnvVar }) => {
    describe(`useVisualGrid: ${useVisualGrid}, sequenceName: ${sequenceName}, sequenceNameEnvVar: ${sequenceNameEnvVar},`, function () {
      it('TestEyesConfiguration', async function () {
        const runner = useVisualGrid ? new VisualGridRunner(10) : new ClassicRunner();
        const eyes = new Eyes(runner);

        const driver = SeleniumUtils.createChromeDriver();
        await driver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/');

        const originalBatchSequence = process.env.APPLITOOLS_BATCH_SEQUENCE;
        if (sequenceNameEnvVar != null) {
          process.env.APPLITOOLS_BATCH_SEQUENCE = sequenceNameEnvVar;
        }

        const effectiveSequenceName = sequenceName || sequenceNameEnvVar;

        const batchInfo = new BatchInfo({
          id: `${TestDataProvider.BatchInfo.getId()}_${effectiveSequenceName}`,
          name: `${TestDataProvider.BatchInfo.getName()}_${effectiveSequenceName}`,
        });

        if (sequenceName != null) {
          batchInfo.setSequenceName(sequenceName);
        }

        if (sequenceNameEnvVar != null) {
          process.env.APPLITOOLS_BATCH_SEQUENCE = originalBatchSequence;
        }

        try {
          assert.strictEqual(effectiveSequenceName, batchInfo.getSequenceName());

          const conf = new Configuration();
          const testName = `Test - ${useVisualGrid ? 'Visual Grid' : 'Selenium'}`;
          conf.setAppName('app').setTestName(testName)
            .setHostApp('someHostApp').setHostOS('someHostOs')
            // .setBaselineBranchName("baseline branch")
            // .setBaselineEnvName("baseline env")
            .setEnvironmentName('env name')
            .setBatch(batchInfo);

          eyes.setConfiguration(conf);
          await eyes.open(driver);

          eyes.setMatchLevel(MatchLevel.Layout);
          await eyes.check(null, Target.window());

          eyes.setMatchLevel(MatchLevel.Content);
          await eyes.check(null, Target.window());
        } finally {
          await driver.quit();
        }

        const results = await eyes.close(false);
        const sessionResults = TestUtils.getSessionResults(eyes.getApiKey(), results);

        assert.ok(sessionResults);

        assert.strictEqual('someHostOs', sessionResults.getEnv().getOs());
        assert.strictEqual('someHostApp', sessionResults.getEnv().getHostingApp());

        assert.strictEqual(batchInfo.getSequenceName(), sessionResults.getStartInfo().getBatchInfo().getSequenceName());
        // assert.strictEqual("baseline branch", sessionResults.getBaselineBranchName());
        // assert.strictEqual("baseline env", sessionResults.getBaselineEnvId());

        assert.ok(sessionResults.getActualAppOutput());
        assert.strictEqual(2, sessionResults.getActualAppOutput().length);
        assert.strictEqual(MatchLevel.Layout2, sessionResults.getActualAppOutput()[0].getImageMatchSettings().getMatchLevel());
        assert.strictEqual(MatchLevel.Content, sessionResults.getActualAppOutput()[1].getImageMatchSettings().getMatchLevel());

        const resultsSummary = await runner.getAllTestResults(false);
        await eyes.abort();
      });
    });
  });
});
