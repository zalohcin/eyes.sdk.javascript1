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

fixture`apple-pencil`.page`https://www.apple.com/apple-pencil`.after(async () => await eyes.close())

test('apple-pencil', async t => {
  await eyes.open(t, 'apple-pencil', 'apple-pencil')
  await eyes.check('apple-pencil', Target.window().fully())
})
