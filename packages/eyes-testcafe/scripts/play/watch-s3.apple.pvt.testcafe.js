/* global fixture */

'use strict'

const {Configuration, StitchMode} = require('@applitools/eyes-common')
const {Eyes, Target, ConsoleLogHandler} = require('../..')

const eyes = new Eyes()
const configuration = new Configuration({
  stitchMode: StitchMode.CSS,
  stitchOverlap: 56,
  viewportSize: {width: 1024, height: 768},
})
eyes.setConfiguration(configuration)

if (process.env.APPLITOOLS_SHOW_LOGS || process.env.LIVE) {
  eyes.setLogHandler(new ConsoleLogHandler(true))
}

fixture`apple-watch-series-3`.page`https://www.apple.com/apple-watch-series-3/`.after(
  async () => await eyes.close(),
)

test('apple-watch-series-3', async t => {
  await eyes.open(t, 'apple-watch-series-3', 'apple-watch-series-3')
  await eyes.check('apple-watch-series-3', Target.window().fully())
})
