const {EyesElementFinder} = require('../../../index')

function stringifySelector(selector) {
  return `${selector.using}:${selector.value}`
}

class FakeElementFinder extends EyesElementFinder {
  constructor(logger, driver) {
    super()
    this._logger = logger
    this._driver = driver
    this._mock = new Map()
  }

  addMockElement(selector, ...elements) {
    this._mock.set(stringifySelector(selector), elements)
  }

  async findElement(selector) {
    const elements = this._mock.get(stringifySelector(selector))
    return elements ? elements[0] : null
  }
  async findElements(selector) {
    const elements = this._mock.get(stringifySelector(selector))
    return elements ? elements : []
  }
}

module.exports = FakeElementFinder
