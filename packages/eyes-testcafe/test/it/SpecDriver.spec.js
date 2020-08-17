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
test('executeScript(string)', driver => {
  return executeScript({driver, script: 'return 4', expected: 4})
})
test('executeScript(string, ...args)', driver => {
  return executeScript({
    driver,
    script: 'return arguments[0] + arguments[1]',
    args: [4, 5],
    expected: 9,
  })
})
test('executeScript(function, ...args)', driver => {
  const script = function() {
    return arguments[0] + arguments[1]
  }
  return executeScript({driver, script, args: [4, 5], expected: 9})
})
test('executeScript w/ Selector', driver => {
  return executeScript({
    driver,
    script: "return getComputedStyle(arguments[0]).getPropertyValue('overflow')",
    args: Selector('html'),
    expected: 'visible',
  })
})
test('executeScript w/ DOM Node Snapshot', async driver => {
  const elSnapshot = await Selector('html')()
  return executeScript({
    driver,
    script: "return arguments[0].style['overflow-y']",
    args: elSnapshot,
    expected: 'visible',
  })
})
test('executeScript re-use returned element', async driver => {
  const expected = await Selector('h1')()
  const result = await spec.executeScript(driver, 'return arguments[0]', Selector('h1'))
  const actual = await spec.executeScript(driver, 'return arguments[0]', Selector(result))
  assert.deepStrictEqual(actual.innerText, expected.innerText)
})
test('executeScript re-use returned element (when the element changes)', async driver => {
  const expected = 'blah'
  const result = await spec.executeScript(driver, 'return arguments[0]', Selector('h1'))
  await spec.executeScript(driver, "document.querySelector('h1').textContent = 'blah'")
  const actual = await spec.executeScript(driver, 'return arguments[0]', Selector(result))
  assert.deepStrictEqual(actual.innerText, expected)
})
test('executeScript return mixed data-types (Array)', async driver => {
  const expected = 2
  const result = await spec.executeScript(driver, 'return [0, arguments[0]]', Selector('h1'))
  const actual = result.length
  assert.deepStrictEqual(actual, expected)
})
test('executeScript return mixed data-types (Object)', async driver => {
  const expected = 2
  const result = await spec.executeScript(
    driver,
    "return {element: arguments[0], blah: 'blah'}",
    Selector('h1'),
  )
  const actual = Object.entries(result).length
  assert.deepStrictEqual(actual, expected)
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
test('findElement(non-existent)', driver => {
  return findElement({driver, input: Selector('non-existent'), expected: false})
})
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
test.only('mainContext()', driver => {
  return mainContext({driver})
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
async function executeScript({driver, script, args = [], expected}) {
  const actual =
    args && args.length
      ? await spec.executeScript(driver, script, ...args)
      : await spec.executeScript(driver, script, args)
  assert.deepStrictEqual(actual, expected)
}
async function findElement({driver, input, expected = true} = {}) {
  const el = await spec.findElement(driver, input)
  isSelector({input: el, expected})
}
async function findElements({driver, input, expected = true} = {}) {
  const elements = await spec.findElements(driver, input)
  assert.deepStrictEqual(!!elements.length, expected)
}
async function mainContext({driver}) {
  try {
    const mainDocument = await Selector('html')()
    await driver.switchToIframe('[name="frame1"]')
    await driver.switchToIframe('[name="frame1-1"]')
    const frameDocument = await Selector('html')()
    assert.ok(!spec.isEqualElements(driver, mainDocument, frameDocument))
    await spec.mainContext(driver)
    const resultDocument = await Selector('html')()
    assert.ok(spec.isEqualElements(driver, resultDocument, mainDocument))
  } finally {
    driver.switchToMainWindow().catch(() => null)
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
