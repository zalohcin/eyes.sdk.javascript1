'use strict'
const path = require('path')
const cwd = process.cwd()
const packageJson = require(path.resolve(cwd, 'package.json'))
const sdkName = packageJson.name.replace('@applitools/', '')
const {
  Eyes,
  ClassicRunner,
  VisualGridRunner,
  ConsoleLogHandler,
  StitchMode,
  BatchInfo,
} = require(cwd)
const defaultArgs = process.env.NO_HEADLESS ? [] : ['headless']

const SAUCE_SERVER_URL = 'https://ondemand.saucelabs.com:443/wd/hub'

const Browsers = {
  CHROME: {
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: defaultArgs,
    },
  },
  FIREFOX: {
    browserName: 'firefox',
    'moz:firefoxOptions': {
      args: defaultArgs,
    },
  },
}

const batch = new BatchInfo(`JS Coverage Tests - ${sdkName}`)

function getEyes(runnerType, stitchMode, options) {
  let runner, eyes
  switch (runnerType) {
    case 'VG':
    case 'visualGrid':
      runner = new VisualGridRunner(10)
      eyes = new Eyes(runner)
      break
    case 'classic':
      runner = new ClassicRunner()
      eyes = new Eyes(runner)
      setStitchMode()
      break
    default:
      eyes = new Eyes()
      setStitchMode()
  }
  if (options) {
    if (options.branchName) eyes.setBranchName(options.branchName)
    else eyes.setBranchName('master')
    if (options.config) eyes.setConfiguration(options.config)
  } else setDefault()

  if (process.env.APPLITOOLS_SHOW_LOGS) {
    eyes.setLogHandler(new ConsoleLogHandler(true))
  }
  return {eyes: eyes, runner: runner}

  function setStitchMode() {
    stitchMode === 'CSS'
      ? eyes.setStitchMode(StitchMode.CSS)
      : eyes.setStitchMode(StitchMode.SCROLL)
  }

  function setDefault() {
    eyes.setParentBranchName('master')
    eyes.setBatch(batch)
  }
}

function getBatch() {
  return batch
}

module.exports = {
  getEyes: getEyes,
  Browsers,
  getBatch: getBatch,
  sauceUrl: SAUCE_SERVER_URL,
}
