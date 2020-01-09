/* global fixture */

'use strict'

const {Configuration, StitchMode} = require('@applitools/eyes-common')
const {Eyes, Target, ConsoleLogHandler} = require('../..')

const eyes = new Eyes()
const configuration = new Configuration({
  stitchMode: StitchMode.SCROLL,
  stitchOverlap: 56,
  waitBeforeScreenshots: 1200,
  viewportSize: {width: 500, height: 600},
})
eyes.setConfiguration(configuration)

if (process.env.APPLITOOLS_SHOW_LOGS || process.env.LIVE) {
  eyes.setLogHandler(new ConsoleLogHandler(true))
}

// Need ignore region
fixture`apple-watch-nike`.page`https://www.apple.com/apple-watch-nike/`.after(
  async () => await eyes.close(),
)

test('apple-watch-nike', async t => {
  await eyes.open(t, 'apple-watch-nike', 'apple-watch-nike')
  await eyes.check('apple-watch-nike', Target.window().fully())
})
