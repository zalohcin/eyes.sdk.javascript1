const assert = require('assert')
const spec = require('../../src/SpecDriver')
const {Selector} = require('testcafe')

describe('SpecDriver', () => {
  describe('prepareArgsFunctionString', () => {
    it('flat arguments', () => {
      const expected = 'let args = [...arguments]\n' + 'args[2] = args[2]()\n' + 'return args'
      assert.deepStrictEqual(spec.prepareArgsFunctionString([1, 2, Selector('html'), 4]), expected)
    })
    it('serialized arguments', () => {
      const expected = `
    let args = [...arguments]
args[0].element = args[0].element()
return args`.trim()
      assert.deepStrictEqual(
        spec.prepareArgsFunctionString([{properties: ['overflow'], element: Selector('html')}]),
        expected,
      )
    })
  })
})
