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
test('isSelector(string)', driver => {
  return isSelector({driver, input: '//div', expected: true})
})
test('isSelector(Selector)', driver => {
  return isSelector({driver, input: Selector('//div'), expected: true})
})
test('isSelector(wrong)', driver => {
  return isSelector({driver, input: {}, expected: false})
})
test('executeScript(string|function, ...args)', async driver => {
  await executeScript({driver})
})
test.skip('isElement(Selector)', driver => {
  return isElement({driver, input: Selector('div'), expected: true})
})
test.skip('isElement(wrong)', async driver => {
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
function isSelector({_driver, input, expected}) {
  const isSelector = spec.isSelector(input)
  assert.strictEqual(isSelector, expected)
}
async function executeScript({driver}) {
  let actual
  let expected
  // 1. simple (string)
  expected = 4
  actual = await spec.executeScript(driver, 'return 4')
  assert.deepStrictEqual(actual, expected)
  // 2. simple w/ arguments (string)
  expected = 4 + 5
  actual = await spec.executeScript(driver, 'return arguments[0] + arguments[1]', 4, 5)
  assert.deepStrictEqual(actual, expected)
  // 3. simple w/ arguments (function)
  expected = 4 + 5
  actual = await spec.executeScript(
    driver,
    function() {
      return arguments[0] + arguments[1]
    },
    4,
    5,
  )
  assert.deepStrictEqual(actual, expected)
  // 4. pass Selector and use
  expected = 'visible'
  actual = await spec.executeScript(
    driver,
    "return getComputedStyle(arguments[0]).getPropertyValue('overflow')",
    Selector('html'),
  )
  assert.deepStrictEqual(actual, expected)
  // 5. return and re-use "element"
  expected = await Selector('h1')()
  const result = await spec.executeScript(driver, 'return arguments[0]', Selector('h1'))
  actual = await spec.executeScript(driver, 'return arguments[0]', Selector(result))
  assert.deepStrictEqual(actual.innerText, expected.innerText)
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
