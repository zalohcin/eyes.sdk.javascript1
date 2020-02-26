const {readFileSync} = require('fs')
const path = require('path')
const targetFolder = process.argv[2] || process.cwd()
const changeLogFilePath = path.resolve(targetFolder, 'CHANGELOG.md')
const _changelogContents = readFileSync(changeLogFilePath, 'utf8')
const pkgJson = JSON.parse(readFileSync(path.resolve(targetFolder, 'package.json'), 'utf8'))

// TODO: move sendReport & sendNotification into sdk-release-kit
// TODO: make this script (and others like it) a bin in sdk-release kit & add it as a dep to each package
const {sendNotification} = require('../packages/sdk-test-kit/src/coverage-tests/send-report')

// needs to know cwd when invoked
// can accept an optional --recipient
async function run({sdkName, sdkVersion, changelog, testCoverageGap, recipient}) {
  const payload = {
    sdk: sdkName,
    version: sdkVersion,
    changelog, // get from changelog.md -- need to expose a private function from sdk-release-kit
    testCoverageGap, // track in a file in the package, get it from there
    specificRecipient: recipient, // optional pass as arg
  }
  await sendNotification(payload)
}

// try/catch -- log if error
// throw?
// retry?
run({
  sdkName: pkgJson.name, // run through helper function in sdk-test-kit first
  sdkVersion: pkgJson.version,
})
