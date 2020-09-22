const assert = require('assert')
const pollify = require('../utils/pollify')
const {delay} = require('@applitools/functional-commons')

describe('pollify', () => {
  it('works', async () => {
    const func = () => new Promise(resolve => setTimeout(resolve, 100, 'result'))
    const funcPoll = pollify(func, {context: {}, key: 'key'})
    assert.strictEqual(typeof func, 'function')
    const r = JSON.parse(funcPoll())
    assert.deepStrictEqual(r, {status: 'WIP'})
    await delay(100)
    const r2 = JSON.parse(funcPoll())
    assert.deepStrictEqual(r2, {status: 'SUCCESS', value: 'result'})
  })

  it('returns error when rejects', async () => {
    const func = () => new Promise((_, reject) => setTimeout(reject, 100, new Error('error')))
    const funcPoll = pollify(func, {context: {}, key: 'key'})
    const r = JSON.parse(funcPoll())
    assert.deepStrictEqual(r, {status: 'WIP'})
    await delay(100)
    const r2 = JSON.parse(funcPoll())
    assert.deepStrictEqual(r2, {status: 'ERROR', error: 'error'})
  })
})
