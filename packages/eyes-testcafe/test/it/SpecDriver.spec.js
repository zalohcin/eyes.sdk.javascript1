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
test('executeScript(string|function, ...args)', driver => {
  return executeScript({driver})
})
test('isElement(Selector)', driver => {
  return isElement({driver, input: Selector('div'), expected: true})
})
test('isElement(wrong)', driver => {
  return isElement({driver, input: () => ({}), expected: false})
})
test('findElement(string)', driver => {
  return findElement({driver, input: '#overflowing-div'})
})
test('findElement(Selector)', driver => {
  return findElement({driver, input: Selector('#overflowing-div')})
})
test('findElement(DOM Node snapshot)', async driver => {
  const elSnapshot = await Selector('#overflowing-div')
  findElement({driver, input: elSnapshot})
})
test.skip('findElement(non-existent)', _driver => {})
test('findElements(string)', driver => {
  return findElements({driver, input: 'div'})
})
test('findElements(Selector)', driver => {
  return findElements({driver, input: Selector('div')})
})
test('findElements(DOM Node snapshot)', async driver => {
  const elSnapshot = await Selector('div')()
  findElements({driver, input: elSnapshot})
})
test('findElements(non-existent)', async driver => {
  findElements({driver, input: Selector('non-existent'), expected: false})
})
test('isEqualElements(element, element)', () => {
  return isEqualElements({
    input: async () => ({
      element1: await Selector('h1')(),
      element2: await Selector('h1')(),
    }),
    expected: true,
  })
})
test('isEqualElements(element1, element2)', () => {
  return isEqualElements({
    input: async () => ({
      element1: await Selector('div')(),
      element2: await Selector('h1')(),
    }),
    expected: false,
  })
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
test.skip('takeScreenshot()', async _driver => {})

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
async function isEqualElements({driver, input, expected}) {
  const {element1, element2} = await input()
  const result = spec.isEqualElements(driver, element1, element2)
  assert.deepStrictEqual(result, expected)
}
async function executeScript({driver}) {
  let actual
  let expected
  let elSnapshot
  let result
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

  // 5. pass Selector snapshot and use
  expected = 'visible'
  elSnapshot = await Selector('html')()
  actual = await spec.executeScript(driver, "return arguments[0].style['overflow-y']", elSnapshot)
  assert.deepStrictEqual(actual, expected)

  // 6. return and re-use "element"
  expected = await Selector('h1')()
  result = await spec.executeScript(driver, 'return arguments[0]', Selector('h1'))
  actual = await spec.executeScript(driver, 'return arguments[0]', Selector(result))
  assert.deepStrictEqual(actual.innerText, expected.innerText)

  // 7. return and re-use "element" (when the element changes)
  expected = 'blah'
  result = await spec.executeScript(driver, 'return arguments[0]', Selector('h1'))
  await spec.executeScript(driver, "document.querySelector('h1').textContent = 'blah'")
  actual = await spec.executeScript(driver, 'return arguments[0]', Selector(result))
  assert.deepStrictEqual(actual.innerText, expected)

  // 8. return mixed data-types (Array)
  expected = 2
  result = await spec.executeScript(driver, 'return [0, arguments[0]]', Selector('h1'))
  actual = result.length
  assert.deepStrictEqual(actual, expected)

  // 9. return mixed data-types (Object)
  expected = 2
  result = await spec.executeScript(
    driver,
    "return {element: arguments[0], blah: 'blah'}",
    Selector('h1'),
  )
  actual = Object.entries(result).length
  assert.deepStrictEqual(actual, expected)
}
function findElement({driver, input} = {}) {
  const el = spec.findElement(driver, input)
  isSelector({input: el, expected: true})
}
// HERE
async function findElements({driver, input, expected = true} = {}) {
  const elements = await spec.findElements(driver, input)
  assert.deepStrictEqual(!!elements.length, expected)
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
