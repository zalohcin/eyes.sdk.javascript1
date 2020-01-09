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

// Hand (second one) is cut bacuse of css sticthing with this size..
fixture`macbook-air`.page`https://www.apple.com/macbook-air/`.after(async () => await eyes.close())

test('macbook-air', async t => {
  await eyes.open(t, 'macbook-air', 'macbook-air')
  await eyes._scanPage()
  await new Promise(r => setTimeout(r, 5000))
  await eyes.check('macbook-air', Target.window().fully())
})
