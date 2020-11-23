const assert = require('assert')
const {gitStatus, isChanged} = require('../../src/git')
const path = require('path')
// eslint-disable-next-line node/no-unsupported-features/node-builtins
const fs = require('fs').promises

describe('git', () => {
  it('should get changed files', async () => {
    const json = require('./fixtures/changed.json')
    json.change = 'new value'
    await fs.writeFile(path.join(__dirname, 'fixtures/changed.json'), JSON.stringify(json, null, 2))
    const changed = await isChanged('packages/sdk-release-kit/test/git/fixtures/changed.json')
    assert.strictEqual(changed, true)
  })
})
