/* global fixture, test */
// eslint-disable-next-line no-unused-vars
const {StitchMode, Configuration, FileDebugScreenshotsProvider} = require('@applitools/eyes-common')
const {Eyes, Target, ConsoleLogHandler} = require('../')

const eyes = new Eyes()
const configuration = new Configuration({
  stitchMode: StitchMode.CSS,
  // stitchOverlap: 56,
  viewportSize: {width: 1024, height: 768},
})
eyes.setConfiguration(configuration)

// const debugHandler = new FileDebugScreenshotsProvider()
// debugHandler.setPath('./screenshots')
// eyes.setDebugScreenshotsProvider(debugHandler)

if (process.env.APPLITOOLS_SHOW_LOGS || process.env.LIVE) {
  eyes.setLogHandler(new ConsoleLogHandler(true))
}

const url = process.argv[2]
if (url) {
  console.log('Render running for', url)
} else {
  console.error('Render script missing url')
}

fixture`TestCafeRender`.page(process.argv[2])

test('Testcafe Eyes Render', async t => {
  await new Promise(r => setTimeout(r, 1000))
  await eyes.open(t, 'TestCafe Render', `Testcafe Render ${url}`)
  // await eyes._scanPage()
  await eyes.check('page loaded', Target.window().fully())

  // Check results
  const results = await eyes.close(false)
  if (!results) {
    console.log('[render.testcafe.js] error no results returned from waitForResults()')
    return
  }
  if (results instanceof Error) {
    console.log('\nTest error:\n\t', results, '\n\t')
  } else {
    console.log('\nTest resulsts:\n\t', `${results.getStatus()} ${results.getUrl()}`, '\n\t')
  }
})
