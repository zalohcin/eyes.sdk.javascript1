const createTestCafe = require('testcafe')
const stream = require('stream')
const fs = require('fs')

const {
  makeCoverageTests,
  convertExecutionModeToSuffix,
} = require('@applitools/sdk-test-kit').coverageTests

const supportedTests = [
  {name: 'TestCheckWindow_Fluent', executionMode: {isCssStitching: true}},
  {name: 'TestCheckWindow_Fluent', executionMode: {isScrollStitching: true}},
]

function initialize() {
  let baselineTestName
  let branchName
  let output = {}
  function _out() {
    return output
  }
  function _setup(options) {
    baselineTestName = options.baselineTestName
    branchName = options.branchName
  }
  function abort() {}
  function visit(url) {
    output.visit = url
  }
  function open(options) {
    const viewportSizes = options.viewportSize.split('x')
    output.open = `await eyes.open(driver, '${options.appName}', '${baselineTestName}', {width: ${viewportSizes[0]}, height: ${viewportSizes[1]}})`
  }
  function checkFrame() {}
  function checkRegion() {}
  function checkWindow() {
    output.checkWindow = `await eyes.checkWindow()`
  }
  function close(_options) {
    output.close = `eyes.close()`
  }
  function getAllTestResults() {}
  function scrollDown() {}
  function switchToFrame() {}
  function type() {}
  return {
    _out,
    _setup,
    abort,
    checkFrame,
    checkRegion,
    checkWindow,
    close,
    getAllTestResults,
    open,
    scrollDown,
    switchToFrame,
    type,
    visit,
  }
}

function makeTestBody(testName, output) {
  let testCommands = {...output}
  delete testCommands.visit
  delete testCommands.close
  delete testCommands.getAllTestResults
  return `const {Eyes} = require('../../../index')
const eyes = new Eyes()

fixture\`${testName}\`
  .page('${output.visit}')
  .afterEach(async () => ${output.close})
  ${output.getAllTestResults ? '.after(async () => ' + output.getAllTestResults + ')' : ''}

test('${testName}', async driver => {
  ${Object.values(testCommands).join('\n  ')}
})`
}

function compile() {
  supportedTests.forEach(async supportedTest => {
    const commands = initialize()
    const tests = makeCoverageTests(commands)
    const baselineTestName = `${supportedTest.name}${convertExecutionModeToSuffix(
      supportedTest.executionMode,
    )}`
    if (commands._setup) {
      commands._setup({
        baselineTestName,
        branchName: 'master',
      })
    }
    await tests[supportedTest.name]()
    const body = makeTestBody(supportedTest.name, commands._out())
    if (!fs.existsSync(`${__dirname}/tmp`)) {
      fs.mkdirSync(`${__dirname}/tmp`)
    }
    fs.writeFileSync(`${__dirname}/tmp/${baselineTestName}.js`, body)
  })
}

class MyStream extends stream.Writable {
  _write(chunk, _encoding, next) {
    this.report = JSON.parse(chunk.toString('utf8'))
    next()
  }
}

async function run() {
  process.stdout.write('Preparing test files...')
  compile()
  process.stdout.write(' Done!\n\n')
  console.log('Running TestCafe tests...')
  const testCafe = await createTestCafe('localhost', 1337, 1338)
  const runner = testCafe.createRunner()
  const stream = new MyStream()
  await runner
    .src(`${__dirname}/tmp`)
    .browsers('chrome:headless')
    .concurrency(5)
    .reporter('json', stream)
    .run()
    .catch(console.error)
  stream.report.fixtures.forEach(fixture => {
    console.log(fixture.tests)
  })
  testCafe.close()
}

run()
