const {readFileSync} = require('fs')
const {verifyChangelog} = require('../packages/sdk-release-kit/src/verify-changelog')
const path = require('path')

const targetFolder = process.argv[2]
const changelogContents = readFileSync(path.resolve(targetFolder, 'CHANGELOG.md'), 'utf8')
const version = JSON.parse(readFileSync(path.resolve(targetFolder, 'package.json'), 'utf8')).version

try {
  verifyChangelog({changelogContents, version})
} catch (error) {
  console.log(error)
  process.exit(1)
}
