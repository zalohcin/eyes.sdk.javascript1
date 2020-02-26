// TODO: move sendReport & sendNotification into sdk-release-kit
// TODO: make this script (and others like it) a bin in sdk-release kit & add it as a dep to each package
const {sendNotification} = require('../packages/sdk-test-kit/src/coverage-tests/send-report')

// needs to know cwd when invoked
// can accept an optional --recipient
async function run({sdkName, sdkVersion, changelog, testCoverageGap, recipient}) {
  const payload = {
    sdk: sdkName, // derive correct name from package.json + helper function in sdk-test-kit
    version: sdkVersion, // get from package.json
    changelog, // get from changelog.md
    testCoverageGap, // track in a file in the package, get it from there
    specificRecipient: recipient, // optional pass as arg
  }
  await sendNotification(payload)
}

// try/catch -- log if error
// throw?
// retry?
run()
