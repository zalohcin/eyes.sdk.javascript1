/* global fixture */

'use strict';

const { Configuration } = require('@applitools/eyes-common');
const { Eyes, Target } = require('../../../');

fixture`Hello world`.page`https://applitools.com/helloworld`; // eslint-disable-line no-unused-expressions

test('helloworld viewport', async (t) => {
  const eyes = new Eyes();
  eyes.setConfiguration(new Configuration({ showLogs: !!process.env.APPLITOOLS_SHOW_LOGS, viewportSize: { width: 800, height: 600 } }));
  await eyes.open(t, 'Applitools helloworld', 'eyes-testcafe e2e - viewport');
  await eyes.check('some tag', Target.window());
  await eyes.close();
});
