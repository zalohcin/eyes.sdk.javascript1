const path = require('path')
const fs = require('fs')
const {Eyes, Logger, FileLogHandler} = require('../../index')
const {testServer} = require('@applitools/sdk-shared')
const NUMBER_OF_TESTS = 1
const NUMBER_OF_APP_RESOURCES = 10
const BYTE_SIZE_OF_APP_RESOURCES = 1024 * 1024 * 1

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
    appName: 'eyes-testcafe',
    testName: 'performance benchmarks',
    disableBrowserFetching: true,
  })
  log('eyes open')
  log('check start')
  const checkStart = Date.now()
  await eyes.checkWindow()
  const checkTotal = ((Date.now() - checkStart) / 1000).toFixed(2)
  t.fixtureCtx.stats.checkTimes.push(checkTotal)
  log(`check end, total time: ${checkTotal}s`)
  log('calling close')
  const closeStart = Date.now()
  await eyes.close(false)
  const closeTotal = ((Date.now() - closeStart) / 1000).toFixed(2)
  t.fixtureCtx.stats.closeTimes.push(closeTotal)
  log(`close end, total time: ${closeTotal}s`)
  log('buh-bye')
  logHandler.close()
}

if (process.env.APPLITOOLS_RUN_PERFORMANCE_BENCHMARKS) {
  fixture`perf benchmarks`
    .before(async ctx => {
      console.log('\n')
      console.log('========= init =========')
      console.log(`number of tests: ${NUMBER_OF_TESTS}`)
      console.log(`number of app resources: ${NUMBER_OF_APP_RESOURCES}`)
      console.log(
        `byte size of app resources: ${BYTE_SIZE_OF_APP_RESOURCES} (~${Math.round(
          BYTE_SIZE_OF_APP_RESOURCES / 1000000,
        )}mb)`,
      )
      console.log('========================')
      console.log('\n')
      generateTestAppFiles()
      const staticPath = path.join(__dirname, 'fixtures')
      ctx.server = await testServer({port: 7771, staticPath})
      ctx.suiteStart = Date.now()
      ctx.stats = {
        checkTimes: [],
        closeTimes: [],
      }
    })
    .after(async ctx => {
      await ctx.server.close()
      console.log('\n')
      console.log('========= stats =========')
      ctx.stats.checkTimes.forEach(time => console.log(`check time: ${time}s`))
      ctx.stats.closeTimes.forEach(time => console.log(`close time: ${time}s`))
      console.log(`suite total: ${((Date.now() - ctx.suiteStart) / 1000).toFixed(2)}s`)
      console.log('========================')
      console.log('\n')
      console.log(`log files available in ${path.join(process.cwd(), 'test', 'perf', 'out')}`)
    })
  for (let name in Array.from({length: NUMBER_OF_TESTS})) {
    test(name, async t => {
      await doTest({t, name})
    })
  }
}
