const {readFileSync} = require('fs')
const {updateChangelogContents} = require('..')
const path = require('path')
const {writeFileSync} = require('fs')

const targetFolder = process.cwd()
const changeLogFilePath = path.resolve(targetFolder, 'CHANGELOG.md')
const changelogContents = readFileSync(changeLogFilePath, 'utf8')
const version = JSON.parse(readFileSync(path.resolve(targetFolder, 'package.json'), 'utf8')).version

module.exports = () => {
  writeFileSync(changeLogFilePath, updateChangelogContents({changelogContents, version}))
}
