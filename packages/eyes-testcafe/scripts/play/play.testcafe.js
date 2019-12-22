/* global fixture */

'use strict'

const {Configuration, StitchMode} = require('@applitools/eyes-common')
const {Eyes, Target, ConsoleLogHandler} = require('../..')

/*
 * Play with configuration and test :
 */

const eyes = new Eyes()
const configuration = new Configuration({
  stitchMode: StitchMode.SCROLL,
  viewportSize: {width: 1024, height: 768},
})
eyes.setConfiguration(configuration)

if (process.env.APPLITOOLS_SHOW_LOGS || process.env.LIVE) {
  eyes.setLogHandler(new ConsoleLogHandler(true))
}

fixture`Play`.page`https://google.com`.after(async () => await eyes.close())

test('Play', async t => {
  await eyes.open(t, 'Play Testcafe', 'play testcafe')

  await new Promise(r => setTimeout(r, 2000))
  await eyes.check('page play', Target.window().fully())
})
