const createTestCafe = require('testcafe')
const stream = require('stream')
const fs = require('fs')
const {
  makeCoverageTests,
  convertExecutionModeToSuffix,
} = require('@applitools/sdk-test-kit').coverageTests
const uuidv4 = require('uuid/v4')

const sdkName = 'eyes-testcafe'
const branchId = uuidv4()

function makeCommands({baselineTestName, cache}) {
  function abort() {}
  function visit(url) {
    cache.visit = url
  }
  function open(options) {
    const viewportSizes = options.viewportSize.split('x')
    cache.testCommands.push(
      `await eyes.open(driver, '${options.appName}', '${baselineTestName}', {width: ${viewportSizes[0]}, height: ${viewportSizes[1]}})`,
    )
  }
  function checkFrame() {}
  function checkRegion() {}
  function checkWindow(options) {
    const isFully = !!(options && options.isFully)
    cache.testCommands.push(`await eyes.check(undefined, Target.window().fully(${isFully}))`)
  }
  function close(_options) {
    cache.testCommands.push(`await eyes.close()`)
  }
  function getAllTestResults() {
    // cache.getAllTestResults = true
  }
  function scrollDown() {}
  function switchToFrame() {}
  function type() {}
  return {
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

function setup({branchName, executionMode}) {
  const setupCommands = [`eyes.setBranchName('${branchName}')`]
  if (executionMode.isCssStitching) {
    setupCommands.push(`eyes.setStitchMode(StitchMode.CSS)`)
  }
  if (executionMode.isScrollStitching) {
    setupCommands.push(`eyes.setStitchMode(StitchMode.SCROLL)`)
  }

  setupCommands.push(`eyes.setBatch('JS Coverage Tests - ${sdkName}', '${branchId}')`)
  return setupCommands
}

function createTestFiles(testFileDir, supportedTests) {
  supportedTests.forEach(async supportedTest => {
    const baselineTestName = `${supportedTest.name}${convertExecutionModeToSuffix(
      supportedTest.executionMode,
    )}`
    const setupCommands = setup({
      branchName: 'master',
      executionMode: supportedTest.executionMode,
    })
    const cache = {setupCommands, testCommands: []}
    const commands = makeCommands({baselineTestName, cache})
    const tests = makeCoverageTests(commands)
    // run test to generate cache
    await tests[supportedTest.name]()
    // emit test contents from cache
    const body = emitTest(supportedTest.name, cache)
    if (!fs.existsSync(testFileDir)) {
      fs.mkdirSync(testFileDir)
    }
    fs.writeFileSync(`${testFileDir}/${baselineTestName}.js`, body)
  })
}

function emitTest(testName, {testCommands, visit, getAllTestResults, setupCommands}) {
  return `const {Eyes, StitchMode, Target} = require('../../../index')
const eyes = new Eyes()

fixture\`${testName}\`
  .page('${visit}')
  .beforeEach(async () => {
    ${setupCommands.join('\n    ')}
  })
  ${getAllTestResults ? '.after(async () => ' + getAllTestResults + ')' : ''}

test('${testName}', async driver => {
  ${testCommands.join('\n  ')}
})`
}

class MyStream extends stream.Writable {
  _write(chunk, _encoding, next) {
    this.report = JSON.parse(chunk.toString('utf8'))
    next()
  }
}

async function run(supportedTests) {
  process.stdout.write('Preparing test files...')
  const testFileDir = `${__dirname}/tmp`
  createTestFiles(testFileDir, supportedTests)
  process.stdout.write(' Done!\n\n')
  console.log(`(you can see them in ${testFileDir})`)
  console.log('Running TestCafe tests...')
  const testCafe = await createTestCafe('localhost', 1337, 1338)
  const runner = testCafe.createRunner()
  const stream = new MyStream()
  await runner
    .src(testFileDir)
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

const supportedTests = [
  // viewport
  {name: 'TestCheckWindow_Fluent', executionMode: {isCssStitching: true}},
  {name: 'TestCheckWindow_Fluent', executionMode: {isScrollStitching: true}},
  // full page
  {name: 'TestCheckPageWithHeader_Window_Fully', executionMode: {isCssStitching: true}},
  {name: 'TestCheckPageWithHeader_Window_Fully', executionMode: {isScrollStitching: true}},
]

run(supportedTests)
