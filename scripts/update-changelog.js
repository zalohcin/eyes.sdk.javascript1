const {readFileSync} = require('fs')
const {updateChangelogContents} = require('../packages/sdk-release-kit/src/changelog')
const path = require('path')
const {writeFileSync} = require('fs')

const targetFolder = process.argv[2] || process.cwd()
const changeLogFilePath = path.resolve(targetFolder, 'CHANGELOG.md')
const changelogContents = readFileSync(changeLogFilePath, 'utf8')
const version = JSON.parse(readFileSync(path.resolve(targetFolder, 'package.json'), 'utf8')).version

try {
  writeFileSync(changeLogFilePath, updateChangelogContents({changelogContents, version}))
} catch (error) {
  console.log(error)
  process.exit(1)
}
