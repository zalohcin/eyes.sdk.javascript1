'use strict'
const {URL} = require('url')
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

const SAUCE_DEVICES = {
  'iPhone XS': {
    deviceName: 'iPhone XS Simulator',
    platformName: 'iOS',
    platformVersion: '13.2',
    deviceOrientation: 'portrait',
  },
  'Pixel 3a XL': {
    deviceName: 'Google Pixel 3a XL GoogleAPI Emulator',
    platformName: 'Android',
    platformVersion: '10.0',
    deviceOrientation: 'portrait',
  },
  'Android Emulator': {
    deviceName: 'Android Emulator',
    platformName: 'Android',
    platformVersion: '6.0',
    deviceOrientation: 'landscape',
    clearSystemFiles: true,
    noReset: true,
  },
  'Samsung Galaxy S8': {
    browserName: '',
    name: 'Android Demo',
    platformName: 'Android',
    platformVersion: '7.0',
    appiumVersion: '1.17.1',
    deviceName: 'Samsung Galaxy S8 FHD GoogleAPI Emulator',
    automationName: 'uiautomator2',
  },
}

const SAUCE_BROWSERS = {
  ie11: {
    browserName: 'internet explorer',
    browserVersion: '11.285',
    platformName: 'Windows 10',
    'sauce:options': {
      screenResolution: '1920x1080',
    },
  },
  safari11: {
    seleniumVersion: '3.4.0',
    browserName: 'safari',
    version: '11.0',
    platform: 'macOS 10.12',
  },
  safari12: {
    seleniumVersion: '3.4.0',
    browserName: 'safari',
    version: '12.1',
    platform: 'macOS 10.13',
  },
  edge18: {
    browserName: 'MicrosoftEdge',
    browserVersion: '18',
    platformName: 'Windows 10',
    'sauce:options': {
      screenResolution: '1920x1080',
    },
  },
  firefox: {
    browserName: 'firefox',
    'sauce:options': {
      seleniumVersion: '3.141.59',
    },
  },
}

function Env({
  browser = null,
  app = null,
  device = null,
  protocol = 'wd',
  remote = 'local',
  url = process.env.CVG_TESTS_REMOTE,
  headless = !process.env.NO_HEADLESS,
  ...options
} = {}) {
  const env = {browser, device, headless, protocol, ...options}
  if (protocol === 'wd') {
    if (remote === 'local') {
      env.url = new URL(url)
    } else if (remote === 'sauce') {
      env.url = new URL('https://ondemand.saucelabs.com/wd/hub')
      env.credentials = {
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
      }
      env.capabilities = {
        ...(SAUCE_DEVICES[device] || SAUCE_BROWSERS[browser]),
        ...env.capabilities,
      }
      if (app) {
        env.capabilities.app = app
      }
    } else if (remote === 'bstack') {
      env.url = new URL('https://hub-cloud.browserstack.com/wd/hub')
      env.credentials = {
        username: process.env.BROWSERSTACK_USERNAME,
        accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
      }
    }
  }
  return env
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
      saveNewTests: false,
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
  Env,
  getEyes,
  batch,
  sauceUrl: SAUCE_SERVER_URL,
}
