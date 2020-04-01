const {readFileSync} = require('fs')
const {verifyChangelogContents} = require('./query')
const {addUnreleasedItem, createReleaseEntry} = require('./update')
const path = require('path')
const {writeFileSync} = require('fs')

function verifyChangelog(targetFolder) {
  const changelogContents = readFileSync(path.resolve(targetFolder, 'CHANGELOG.md'), 'utf8')
  const {version} = require(path.resolve(targetFolder, 'package.json'))
  verifyChangelogContents({changelogContents, version})
}

function writeReleaseEntryToChangelog(targetFolder) {
  const changeLogFilePath = path.resolve(targetFolder, 'CHANGELOG.md')
  const changelogContents = readFileSync(changeLogFilePath, 'utf8')
  const {version} = require(path.resolve(targetFolder, 'package.json'))
  writeFileSync(changeLogFilePath, createReleaseEntry({changelogContents, version, withDate: true}))
}

function writeUnreleasedItemToChangelog({targetFolder, entry}) {
  const changeLogFilePath = path.resolve(targetFolder, 'CHANGELOG.md')
  const changelogContents = readFileSync(changeLogFilePath, 'utf8')
  writeFileSync(changeLogFilePath, addUnreleasedItem({changelogContents, entry}))
}

module.exports = {
  verifyChangelog,
  writeReleaseEntryToChangelog,
  writeUnreleasedItemToChangelog,
}
