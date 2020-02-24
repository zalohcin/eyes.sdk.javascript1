const {
  _getEntriesForHeading,
  _getLatestReleaseHeading,
  _getReleaseNumberFromHeading,
  verifyChangelog,
} = require('../src/verify-changelog')
const assert = require('assert')

describe('verify-changelog', () => {
  let changelogContents
  before(() => {
    changelogContents = `
      # Changelog

      ## Unreleased

      - blah
      - also blah

      ## 1.2.3 - date

      - more blah

      ## [3.2.1] - date

      - some more blah as well
    `
  })
  it('should get entries for an explicit heading', () => {
    assert.deepStrictEqual(
      _getEntriesForHeading({changelogContents, targetHeading: '## Unreleased'}),
      ['- blah', '- also blah'],
    )
  })
  it('should get latest release heading', () => {
    assert.deepStrictEqual(_getLatestReleaseHeading(changelogContents), '## 1.2.3 - date')
  })
  it('should get version number from release heading', () => {
    assert.deepStrictEqual(_getReleaseNumberFromHeading('## 1.2.3 - date'), '1.2.3')
    assert.deepStrictEqual(_getReleaseNumberFromHeading('## [3.2.1] - date'), '3.2.1')
  })
  it('should throw if there are unreleased entries', () => {
    assert.throws(() => {
      verifyChangelog({changelogContents})
    }, /Found unreleased entries/)
  })
  it('should throw if there is a matching version entry', () => {
    const _changelogContents = `
      # Changelog

      ## Unreleased

      ## 1.2.3 - date

      - more blah

      ## [3.2.1] - date

      - some more blah as well
    `
    assert.throws(() => {
      verifyChangelog({changelogContents: _changelogContents, version: '1.2.3'})
    }, /Matching version entry found/)
  })
})
