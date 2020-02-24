const {readFileSync} = require('fs')
const {verifyChangelog} = require('../packages/sdk-release-kit/src/verify-changelog')

const filePath = process.argv[2]
const version = process.argv[3]
const changelogContents = readFileSync(filePath, 'utf8')

try {
  verifyChangelog({changelogContents, version})
} catch (error) {
  console.log(error)
  process.exit(1)
}
