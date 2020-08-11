const assert = require('assert')
const spec = require('../../src/SpecDriver')
const {Selector} = require('testcafe')

fixture`SpecDriver`.page`https://applitools.github.io/demo/TestPages/FramesTestPage/`

test('isDriver(driver)', driver => {
  return isDriver({driver, expected: true})
})
test('isDriver(wrong)', driver => {
  return isDriver({driver, input: {}, expected: false})
})
test('isSelector(Selector)', driver => {
  return isSelector({driver, input: Selector('//div'), expected: true})
})
test('isSelector(wrong)', driver => {
  return isSelector({driver, input: {}, expected: false})
})
test.skip('executeScript(strings, ...args)', driver => {
  return executeScript({driver})
})
test('isElement(Selector)', driver => {
  return isElement({driver, input: Selector('div'), expected: true})
})
test('isElement(wrong)', async driver => {
  isElement({driver, input: () => ({}), expected: false})
})
test.skip('findElement(string)', async driver => {
  findElement({driver, input: '#overflowing-div'})
})
test.skip('findElement(Selector)', async driver => {
  findElement({driver, input: Selector('#overflowing-div')})
})
test.skip('findElements(string)', async driver => {
  findElements({driver, input: 'div'})
})
test.skip('findElements(Selector)', async driver => {
  findElements({driver, input: Selector('div')})
})
test.skip('findElement(non-existent)', async driver => {
  findElement({driver, input: Selector('non-existent'), expected: null})
})
test.skip('findElements(non-existent)', async driver => {
  findElements({driver, input: Selector('non-existent'), expected: []})
})
test.skip('mainContext()', async driver => {
  mainContext({driver})
})
test.skip('parentContext()', async driver => {
  parentContext({driver})
})
test.skip('childContext(element)', async driver => {
  childContext({driver})
})
test.skip('getTitle()', async driver => {
  getTitle({driver})
})
test.skip('getUrl()', async driver => {
  getUrl({driver})
})
test.skip('visit()', async driver => {
  visit({driver})
})

async function isDriver({driver, input, expected}) {
  const isDriver = await spec.isDriver(input || driver)
  assert.strictEqual(isDriver, expected)
}
async function isElement({_driver, input, expected}) {
  const element = await input()
  const isElement = await spec.isElement(element)
  assert.strictEqual(isElement, expected)
}
async function isSelector({_driver, input, expected}) {
  const isSelector = await spec.isSelector(input)
  assert.strictEqual(isSelector, expected)
}
function toEyesSelector({_driver}) {
  const xpathSelector = Selector('/html[1]/body[1]/div[1]')
  const xpathResult = spec.toEyesSelector(xpathSelector)
  assert.deepStrictEqual(xpathResult, {type: 'xpath', selector: '/html[1]/body[1]/div[1]'})

  const cssSelector = Selector('html > body > div')
  const cssResult = spec.toEyesSelector(cssSelector)
  assert.deepStrictEqual(cssResult, {type: 'css', selector: 'html > body > div'})

  const tagSelector = Selector('text')
  const tagResult = spec.toEyesSelector(tagSelector)
  assert.deepStrictEqual(tagResult, {type: 'css', selector: 'text'})

  const wrongSelector = {isWrong: true}
  const wrongResult = spec.toEyesSelector(wrongSelector)
  assert.deepStrictEqual(wrongResult, {selector: {isWrong: true}})
}
async function executeScript({driver}) {
  const args = [0, 'string', {key: 'value'}, [0, 1, 2, 3]]
  const expected = JSON.stringify(args)
  const result = await spec.executeScript(
    driver,
    args => {
      return args
    },
    ...args,
  )
  debugger
  assert.deepStrictEqual(result, expected)
}
function mainContext({_driver}) {
  return async () => {
    //try {
    //  const mainDocument = await driver.findElement(By.css('html'))
    //  await driver.switchTo().frame(await driver.findElement(By.css('[name="frame1"]')))
    //  await driver.switchTo().frame(await driver.findElement(By.css('[name="frame1-1"]')))
    //  const frameDocument = await driver.findElement(By.css('html'))
    //  assert.ok(!(await spec.isEqualElements(driver, mainDocument, frameDocument)))
    //  await spec.mainContext(driver)
    //  const resultDocument = await driver.findElement(By.css('html'))
    //  assert.ok(await spec.isEqualElements(driver, resultDocument, mainDocument))
    //} finally {
    //  await driver
    //    .switchTo()
    //    .defaultContent()
    //    .catch(() => null)
    //}
  }
}
function parentContext({_driver}) {
  return async () => {
    //try {
    //  await driver.switchTo().frame(await driver.findElement(By.css('[name="frame1"]')))
    //  const parentDocument = await driver.findElement(By.css('html'))
    //  await driver.switchTo().frame(await driver.findElement(By.css('[name="frame1-1"]')))
    //  const frameDocument = await driver.findElement(By.css('html'))
    //  assert.ok(!(await spec.isEqualElements(driver, parentDocument, frameDocument)))
    //  await spec.parentContext(driver)
    //  const resultDocument = await driver.findElement(By.css('html'))
    //  assert.ok(await spec.isEqualElements(driver, resultDocument, parentDocument))
    //} finally {
    //  await driver
    //    .switchTo()
    //    .frame(null)
    //    .catch(() => null)
    //}
  }
}
function childContext({_driver}) {
  return async () => {
    //  try {
    //    const element = await driver.findElement(By.css('[name="frame1"]'))
    //    await driver.switchTo().frame(element)
    //    const expectedDocument = await driver.findElement(By.css('html'))
    //    await driver.switchTo().frame(null)
    //    await spec.childContext(driver, element)
    //    const resultDocument = await driver.findElement(By.css('html'))
    //    assert.ok(await spec.isEqualElements(driver, resultDocument, expectedDocument))
    //  } finally {
    //    await driver
    //      .switchTo()
    //      .frame(null)
    //      .catch(() => null)
    //  }
  }
}
function findElement({_driver, _input, _expected} = {}) {
  return async () => {
    //const result = expected !== undefined ? expected : await driver.findElement(input)
    //const element = await spec.findElement(driver, input)
    //if (element !== result) {
    //  assert.ok(await spec.isEqualElements(driver, element, result))
    //}
  }
}
function findElements({_driver, _input, _expected} = {}) {
  return async () => {
    //const result = expected !== undefined ? expected : await driver.findElements(input)
    //const elements = await spec.findElements(driver, input)
    //assert.strictEqual(elements.length, result.length)
    //for (const [index, element] of elements.entries()) {
    //  assert.ok(await spec.isEqualElements(driver, element, result[index]))
    //}
  }
}
function getTitle({_driver}) {
  return async () => {
    //const expected = await driver.getTitle()
    //const result = await spec.getTitle(driver)
    //assert.deepStrictEqual(result, expected)
  }
}
function getUrl({_driver}) {
  return async () => {
    //const result = await spec.getUrl(driver)
    //assert.deepStrictEqual(result, url)
  }
}
function visit({_driver}) {
  return async () => {
    //const blank = 'about:blank'
    //await spec.visit(driver, blank)
    //const actual = await driver.getCurrentUrl()
    //assert.deepStrictEqual(actual, blank)
    //await driver.get(url)
  }
}
