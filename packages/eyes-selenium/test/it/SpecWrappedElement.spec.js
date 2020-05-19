const assert = require('assert')
const {Builder, By, Capabilities, WebElement} = require('selenium-webdriver')
const {Options: ChromeOptions} = require('selenium-webdriver/chrome')
const specs = require('../../src/SpecWrappedElement')

describe('SpecWrappedDriver', async () => {
  let driver

  before(async () => {
    driver = await new Builder()
      .withCapabilities(Capabilities.chrome())
      .setChromeOptions(new ChromeOptions().headless().addArguments('disable-infobars'))
      .build()
    await driver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
  })

  after(async () => {
    await driver.quit()
  })

  it('isCompatible(element)', async () => {
    const element = await driver.findElement(By.css('div'))
    const result = specs.isCompatible(element)
    assert.deepStrictEqual(result, true)
  })

  it('isCompatible(wrong)', async () => {
    const result = specs.isCompatible({isElement: true})
    assert.deepStrictEqual(result, false)
  })

  it('isSelector(by)', async () => {
    const result = specs.isSelector(By.css('div'))
    assert.deepStrictEqual(result, true)
  })

  it('isSelector(wrong)', async () => {
    const result = specs.isSelector({isSelector: true})
    assert.deepStrictEqual(result, false)
  })

  it('extractId(element)', async () => {
    const elementId = 'elementId'
    const element = new WebElement(driver, elementId)
    const result = await specs.extractId(element)
    assert.deepStrictEqual(result, elementId)
  })

  it('isStaleElementReferenceResult(err)', async () => {
    const element = await driver.findElement(By.css('div'))
    await driver.navigate().refresh()
    try {
      await driver.executeScript('return null', element)
    } catch (err) {
      assert.strictEqual(specs.isStaleElementReferenceResult(err), true)
    }
  })
})
