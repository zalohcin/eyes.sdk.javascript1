/* global fixture */

'use strict'

const {Configuration, StitchMode} = require('@applitools/eyes-common')
const {Eyes, Target, ConsoleLogHandler} = require('../..')

const eyes = new Eyes()
const configuration = new Configuration({
  stitchMode: StitchMode.SCROLL,
  stitchOverlap: 56,
  viewportSize: {width: 1024, height: 768},
})
eyes.setConfiguration(configuration)

if (process.env.APPLITOOLS_SHOW_LOGS || process.env.LIVE) {
  eyes.setLogHandler(new ConsoleLogHandler(true))
}

// (Cannot scroll on Mojave)
fixture`smart-keyboard`.page`https://apple.com/smart-keyboard`.after(async () => await eyes.close())

test('smart-keyboard', async t => {
  await eyes.open(t, 'smart-keyboard', 'smart-keyboard')
  await eyes.check('smart-keyboard', Target.window().fully())
})
