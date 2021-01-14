const path = require('path')
const fs = require('fs')
const {Eyes, Logger, FileLogHandler} = require('../../index')
const {testServer} = require('@applitools/sdk-shared')
const NUMBER_OF_TESTS = 3
const NUMBER_OF_APP_RESOURCES = 10
const BYTE_SIZE_OF_APP_RESOURCES = 1024 * 1024 * 1
let server

function generateTestAppFiles() {
  let markup = ''
  Array.from({length: NUMBER_OF_APP_RESOURCES}).forEach((_entry, index) => {
    fs.writeFileSync(
      path.join(__dirname, 'fixtures', `${index}.txt`),
      new Array(BYTE_SIZE_OF_APP_RESOURCES).join('a'),
    )
    markup += `<object width="300" height="300" type="text/plain" data="${index}.txt"></object>\n`
  })
  fs.writeFileSync(path.join(__dirname, 'fixtures', `index.html`), markup)
}

function doLog(name, msg) {
  console.log(`[test ${name} says] ${msg}`)
}

async function doTest({t, name}) {
  const log = doLog.bind(undefined, name)
  process.env.APPLITOOLS_USE_PRELOADED_CONFIG = true
  const eyes = new Eyes()
  const logger = new Logger()
  const logHandler = new FileLogHandler(true, path.join(__dirname, 'out', `${name}.log`))
  logHandler.open()
  logger.setLogHandler(logHandler)
  logger.prefix = name
  eyes.logger = logger
  await t.setPageLoadTimeout(0)
  log('ohai')
  log('navigating to page')
  await t.navigateTo('http://localhost:7771/index.html')
  log('navigation complete')
  log('opening eyes')
  await eyes.open({
    t,
    appName: 'eyes-testcafe perf',
    testName: 'sandbox',
    disableBrowserFetching: true,
  })
  log('eyes open')
  log('check start')
  const checkStart = Date.now()
  await eyes.checkWindow()
  const checkTotal = Date.now() - checkStart
  log(`check end, total time: ${(checkTotal / 1000).toFixed(2)}s`)
  log('calling close')
  const closeStart = Date.now()
  await eyes.close(false)
  const closeTotal = Date.now() - closeStart
  log(`close end, total time: ${(closeTotal / 1000).toFixed(2)}s`)
  log('buh-bye')
  logHandler.close()
}

if (process.env.APPLITOOLS_RUN_PERFORMANCE_BENCHMARKS) {
  fixture`perf benchmarks`
    .before(async () => {
      console.log('\n')
      console.log('========= init =========')
      console.log(`number of tests: ${NUMBER_OF_TESTS}`)
      console.log(`number of app resources: ${NUMBER_OF_APP_RESOURCES}`)
      console.log(`byte size of app resources: ${BYTE_SIZE_OF_APP_RESOURCES}`)
      console.log('========================')
      generateTestAppFiles()
      const staticPath = path.join(__dirname, 'fixtures')
      server = await testServer({port: 7771, staticPath})
    })
    .after(async () => {
      await server.close()
      console.log('\n')
      console.log('log files available in test/perf/out')
    })
  for (let name in Array.from({length: NUMBER_OF_TESTS})) {
    test(name, async t => {
      await doTest({t, name})
    })
  }
}
