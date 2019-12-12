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

fixture`iphone-accessories`.page`https://www.apple.com/shop/iphone/iphone-accessories`.after(
  async () => await eyes.close(),
)

test('iphone-accessories', async t => {
  await eyes.open(t, 'iphone-accessories', 'iphone-accessories')
  await eyes.check('iphone-accessories', Target.window().fully())
})
