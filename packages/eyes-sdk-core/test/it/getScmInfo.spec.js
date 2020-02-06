'use strict'

const assert = require('assert')
const getScmInfo = require('../../lib/getScmInfo')
const {
  GeneralUtils: {pexec},
} = require('@applitools/eyes-common')
const {resolve} = require('path')

describe('getScmInfo', () => {
  const testRepoPath = resolve(__dirname, '../fixtures/test-git-repo/')

  before(async () => {
    // make test-git-repo dir a valid repo
    const gitDir = resolve(testRepoPath, '.git-dontignore')
    pexec(`mv ${gitDir} ${gitDir.replace('-dontignore', '')}`)
  })

  after(async () => {
    // make test-git-repo a non valid repo so we can commit it
    const gitDir = resolve(testRepoPath, '.git')
    pexec(`mv ${gitDir} ${gitDir}-dontignore`)
  })

  it('works and caches response', async () => {
    const result = await getScmInfo('some-batch-key', 'master', {cwd: testRepoPath})
    const testRepoBaseTime = '2020-02-06T15:20:56+02:00'
    assert.strictEqual(result, testRepoBaseTime)

    const result2 = await getScmInfo('some-batch-key', 'master', {cwd: __dirname})
    assert.strictEqual(result2, testRepoBaseTime)
  })
})
