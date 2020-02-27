const path = require('path')
const {readFileSync} = require('fs')
const {sendNotification} = require('..')
const {getLatestReleaseEntries} = require('../../changelog')

const targetFolder = process.cwd()
const changelogContents = readFileSync(path.resolve(targetFolder, 'CHANGELOG.md'), 'utf8')
const pkgJson = JSON.parse(readFileSync(path.resolve(targetFolder, 'package.json'), 'utf8'))

async function run({sdkName, sdkVersion, changeLog, testCoverageGap}, recipient) {
  const payload = {
    sdk: sdkName,
    version: sdkVersion,
    changeLog,
    testCoverageGap,
    specificRecipient: recipient,
  }
  const result = await sendNotification(payload)
  if (!result.isSuccessful)
    throw `There was a problem sending the release notification: status ${result.status} with message ${result.message}`
}

function convertSdkNameToReportName(sdkName) {
  const name = sdkName.includes('@applitools') ? sdkName.split('/')[1] : sdkName
  switch (name) {
    case 'eyes-selenium':
      return 'js_selenium_4'
    case 'eyes.selenium':
      return 'js_selenium_3'
    case 'eyes.webdriverio.javascript5':
      return 'js_wdio_5'
    case 'eyes.webdriverio.javascript4':
      return 'js_wdio_4'
    case 'eyes-images':
      return 'js_images'
    default:
      throw 'Unsupported SDK'
  }
}

module.exports = run.bind(undefined, {
  sdkName: convertSdkNameToReportName(pkgJson.name),
  sdkVersion: pkgJson.version,
  changeLog: getLatestReleaseEntries(changelogContents).join('\n'),
  testCoverageGap: 'TODO', // track in a file in the package, get it from there
})
