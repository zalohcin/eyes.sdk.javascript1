/* global fixture */

'use strict'

const {Configuration, StitchMode} = require('@applitools/eyes-common')
const {Eyes, Target, ConsoleLogHandler} = require('../..')

const eyes = new Eyes()
const configuration = new Configuration({
  stitchMode: StitchMode.SCROLL,
  stitchOverlap: 56,
  waitBeforeScreenshots: 2000,
  viewportSize: {width: 1024, height: 768},
})
eyes.setConfiguration(configuration)

if (process.env.APPLITOOLS_SHOW_LOGS || process.env.LIVE) {
  eyes.setLogHandler(new ConsoleLogHandler(true))
}

// HAS ANIMATION BUG / CAN BE FIXED WITH ACTIVATING ALL PAGE ANIMATIONS BEFORE CHECK
fixture.skip`airplay`.page`https://www.apple.com/airplay/`.after(async () => await eyes.close())

test('airplay', async t => {
  await eyes.open(t, 'airplay', 'airplay')
  await eyes.check('airplay', Target.window().fully())
})
