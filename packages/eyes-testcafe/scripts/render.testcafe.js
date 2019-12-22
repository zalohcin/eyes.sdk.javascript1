/* global fixture, test */
const {StitchMode, Configuration} = require('@applitools/eyes-common')
const {Eyes, Target, ConsoleLogHandler} = require('../')

const eyes = new Eyes()
const configuration = new Configuration({viewportSize: {width: 600, height: 500}})
eyes.setConfiguration(configuration)
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
  const eyes = new Eyes()
  const configuration = new Configuration({viewportSize: {width: 1024, height: 768}})
  eyes.setConfiguration(configuration)

  if (process.env.APPLITOOLS_SHOW_LOGS || process.env.LIVE) {
    eyes.setLogHandler(new ConsoleLogHandler(true))
  }
  await eyes.open(t, 'TestCafe Render', `Testcafe Render ${url}`)
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
