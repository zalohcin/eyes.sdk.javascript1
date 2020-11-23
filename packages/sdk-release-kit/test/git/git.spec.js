const assert = require('assert')
const {gitStatus, isChanged} = require('../../src/git')
const path = require('path')
// eslint-disable-next-line node/no-unsupported-features/node-builtins
const fs = require('fs').promises

describe('git', () => {
  afterEach(async () => {
    // await fs.unlink(path.join(__dirname + '/hello.txt'))
  })

  it('should get changed files', async () => {
    await fs.writeFile(path.join(__dirname + '/hello.txt'), 'test')
    const files = ['hello.txt']
    const changed = await isChanged(files)
    assert.strictEqual(changed, true)
  })
})
