'use strict'
const {Builder} = require('selenium-webdriver')
const {Eyes, ClassicRunner, VisualGridRunner, StitchMode} = require('../../../../index')
const defaultArgs = process.env.HEADLESS === 'true' ? ['headless'] : []

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

const SETUPS = {
  default: {stitchMode: 'CSS', runnerType: 'classic', title: ''},
  scroll: {stitchMode: 'SCROLL', runnerType: 'classic', title: '_SCROLL'},
  VG: {stitchMode: 'none', runnerType: 'visualGrid', title: '_VG'},
}

async function getDriver(browser) {
  let capabilities = Browsers[browser]
  return new Builder().withCapabilities(capabilities).build()
}

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
  }
  return {eyes: eyes, runner: runner}

  function setStitchMode() {
    stitchMode === 'CSS'
      ? eyes.setStitchMode(StitchMode.CSS)
      : eyes.setStitchMode(StitchMode.SCROLL)
  }
}

function getSetups(...args) {
  let setups = []
  if (args.length !== 0) {
    args.forEach(arg => setups.push(SETUPS[arg]))
  } else {
    setups.push(SETUPS.default, SETUPS.scroll, SETUPS.VG)
  }
  return setups
}

module.exports = {
  getDriver: getDriver,
  getEyes: getEyes,
  getSetups: getSetups,
}
