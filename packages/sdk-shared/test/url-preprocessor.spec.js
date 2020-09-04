const assert = require('assert')
const preprocessUrl = require('../coverage-tests/util/url-preprocessor')

describe('preprocessUrl', () => {
  const enabledOpts = {isRemote: true, isMac: true}
  const disabledOpts = {isRemote: false, isMac: false}
  it('rewrites localhost url', () => {
    assert.deepStrictEqual(
      preprocessUrl('http://localhost', enabledOpts),
      'http://host.docker.internal',
    )
  })
  it('skips url rewrite on non-Mac/non-remote', () => {
    assert.deepStrictEqual(preprocessUrl('http://localhost', disabledOpts), 'http://localhost')
  })
  it('only rewrites localhost urls', () => {
    assert.deepStrictEqual(preprocessUrl('http://google.com', enabledOpts), 'http://google.com')
  })
  if (!!process.env.CVG_TESTS_REMOTE && process.platform === 'darwin') {
    it('works when called without opts on Mac', () => {
      assert.deepStrictEqual(
        preprocessUrl('http://localhost', enabledOpts),
        'http://host.docker.internal',
      )
    })
  }
})
