require('chromedriver')
const {Builder, By} = require('selenium-webdriver')
const {Options: ChromeOptions} = require('selenium-webdriver/chrome')
const {
  Eyes,
  BatchInfo,
  RectangleSize,
  Target,
  StitchMode,
  VisualGridRunner,
} = require('../../index')
const {runCoverageTests} = require('@applitools/sdk-test-kit')

const batch = new BatchInfo('JS Coverage Tests - eyes-selenium')

async function initialize(executionMode) {
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new ChromeOptions().headless())
    .build()
  let eyes
  if (executionMode.isVisualGrid) {
    eyes = new Eyes(new VisualGridRunner())
  } else if (executionMode.isCssStitching) {
    eyes = new Eyes()
    eyes.setStitchMode(StitchMode.CSS)
  } else if (executionMode.isScrollStitching) {
    eyes = new Eyes()
    eyes.setStitchMode(StitchMode.SCROLL)
  }
  eyes.setBatch(batch)
  return {driver, eyes}
}

async function visit({driver}, url) {
  await driver.get(url)
}

async function open({driver, eyes}, options) {
  driver = await eyes.open(
    driver,
    options.appName,
    options.testName,
    RectangleSize.parse(options.viewportSize),
  )
  return driver
}

async function check({eyes}, options = {}) {
  if (options.isClassicApi) {
    options.locator ? await eyes.checkElementBy(By.css(options.locator)) : await eyes.checkWindow()
  } else {
    options.locator
      ? await eyes.check(undefined, Target.region(By.css(options.locator)).fully())
      : await eyes.check(undefined, Target.window().fully())
  }
}

async function close({driver, eyes}, options) {
  await eyes.close(options)
  await driver.close()
}

runCoverageTests({initialize, visit, open, check, close}, [
  'checkRegionClassic',
  'checkRegionFluent',
  'checkWindowClassic',
  'checkWindowFluent',
])
