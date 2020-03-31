const path = require('path')
const {readFileSync} = require('fs')
const {sendNotification} = require('./send-report-util')
const {getLatestReleaseEntries} = require('../changelog/changelog-utils')

async function sendReport({sdkName, sdkVersion, changeLog, testCoverageGap}, recipient) {
  const payload = {
    sdk: sdkName,
    version: sdkVersion,
    changeLog,
    testCoverageGap,
    specificRecipient: recipient,
  }
  const result = await sendNotification(payload)
  if (!result.isSuccessful)
    throw new Error(
      `There was a problem sending the release notification: status ${result.status} with message ${result.message}`,
    )
}

function convertSdkNameToReportName(sdkName) {
  const name = sdkName.includes('@applitools') ? sdkName.split('/')[1] : sdkName
  switch (name) {
    case 'eyes-selenium':
      return 'js_selenium_4'
    case 'eyes.selenium':
      return 'js_selenium_3'
    case 'eyes-webdriverio':
      return 'js_wdio_5'
    case 'eyes.webdriverio':
      return 'js_wdio_4'
    case 'eyes-images':
      return 'js_images'
    default:
      throw new Error('Unsupported SDK')
  }
}

module.exports = async (targetFolder, recipient) => {
  const changelogContents = readFileSync(path.resolve(targetFolder, 'CHANGELOG.md'), 'utf8')
  const {name, version} = require(path.resolve(targetFolder, 'package.json'))
  await sendReport(
    {
      sdkName: convertSdkNameToReportName(name),
      sdkVersion: version,
      changeLog: getLatestReleaseEntries(changelogContents).join('\n'),
      testCoverageGap: 'TODO', // track in a file in the package, get it from there
    },
    recipient,
  )
}
