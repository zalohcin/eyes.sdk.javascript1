const {readFileSync} = require('fs')
const {
  verifyChangelog: verifyChangelogContents,
  updateChangelogContents,
} = require('./changelog-utils')
const path = require('path')
const {writeFileSync} = require('fs')

function verifyChangelog(targetFolder) {
  const changelogContents = readFileSync(path.resolve(targetFolder, 'CHANGELOG.md'), 'utf8')
  const version = JSON.parse(readFileSync(path.resolve(targetFolder, 'package.json'), 'utf8'))
    .version
  verifyChangelogContents({changelogContents, version})
}

function updateChangelog(targetFolder) {
  const changeLogFilePath = path.resolve(targetFolder, 'CHANGELOG.md')
  const changelogContents = readFileSync(changeLogFilePath, 'utf8')
  const version = JSON.parse(readFileSync(path.resolve(targetFolder, 'package.json'), 'utf8'))
    .version
  writeFileSync(
    changeLogFilePath,
    updateChangelogContents({changelogContents, version, withDate: true}),
  )
}

module.exports = {
  verifyChangelog,
  updateChangelog,
}
