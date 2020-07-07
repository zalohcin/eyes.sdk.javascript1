'use strict'
const cwd = process.cwd()
const {
  StitchMode,
  BatchInfo,
  Configuration,
  Eyes,
  VisualGridRunner,
  ConsoleLogHandler,
} = require(cwd)

const SAUCE_SERVER_URL = 'https://ondemand.saucelabs.com:443/wd/hub'

const Browsers = {
  chrome({headless = !process.env.NO_HEADLESS} = {}) {
    const args = []
    if (headless) args.push('headless')
    return {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args,
      },
    }
  },
  firefox({headless = !process.env.NO_HEADLESS} = {}) {
    const args = []
    if (headless) args.push('headless')
    return {
      browserName: 'firefox',
      'moz:firefoxOptions': {
        args,
      },
    }
  },
}

const Remotes = {
  sauce({w3c = true} = {}) {
    return {
      username: process.env.SAUCE_USERNAME,
      accessKey: process.env.SAUCE_ACCESS_KEY,
      url: 'https://ondemand.saucelabs.com/wd/hub',
      w3c,
    }
  },
  bstack({w3c = true} = {}) {
    return {
      username: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
      url: 'https://hub-cloud.browserstack.com/wd/hub',
      w3c,
    }
  },
}

const batch = new BatchInfo(process.env.APPLITOOLS_BATCH_NAME || 'JS Coverage Tests')

function getEyes({isVisualGrid, isCssStitching, configuration, branchName = 'master'} = {}) {
  const eyes = new Eyes(isVisualGrid ? new VisualGridRunner(10) : undefined)
  const conf = Object.assign(
    {
      apiKey: process.env.APPLITOOLS_API_KEY_SDK,
      batch,
      branchName,
      parentBranchName: 'master',
      dontCloseBatches: true,
      matchTimeout: 0,
      stitchMode: isCssStitching ? StitchMode.CSS : StitchMode.SCROLL,
    },
    configuration,
  )
  eyes.setConfiguration(new Configuration(conf))

  if (process.env.APPLITOOLS_SHOW_LOGS) {
    eyes.setLogHandler(new ConsoleLogHandler(true))
  }

  return eyes
}

module.exports = {
  Browsers,
  Remotes,
  getEyes,
  batch,
  sauceUrl: SAUCE_SERVER_URL,
}
