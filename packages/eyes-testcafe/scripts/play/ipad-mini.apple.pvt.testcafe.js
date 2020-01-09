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

fixture`ipad-mini`.page`https://apple.com/ipad-mini`.after(async () => await eyes.close())

test('ipad-mini', async t => {
  await eyes.open(t, 'ipad-mini', 'ipad-mini')
  await eyes.check('ipad-mini', Target.window().fully())
})
