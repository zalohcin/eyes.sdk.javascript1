const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const {convertJunitXmlToResultSchema} = require('./xml')
const {sendReport} = require('./send')
const uploadToStorage = require('./upload')

function convertSdkNameToReportName(sdkName) {
  switch (sdkName) {
    case 'eyes-selenium':
      return 'js_selenium_4'
    case 'eyes-selenium-3':
      return 'js_selenium_3'
    case 'eyes.webdriverio.javascript5':
      return 'js_wdio_5'
    case 'eyes.webdriverio.javascript4':
      return 'js_wdio_4'
    case 'eyes-images':
      return 'js_images'
    case 'eyes-testcafe':
      return 'testcafe'
    case 'eyes-protractor':
      return 'js_protractor'
    case 'eyes_selenium_python':
      return 'python'
    case 'eyes_selenium_ruby':
      return 'ruby'
    case 'eyes_selenium_java':
      return 'java'
    case 'eyes_selenium_dotnet':
      return 'dotnet'
    case 'playwright':
      return 'playwright'
    default:
      throw new Error('Unsupported SDK')
  }
}

const DEFAULT_CONFIG = {
  metaPath: '',
  resultPath: '',
}

async function report({configPath, ...options}) {
  const config = {
    ...DEFAULT_CONFIG,
    ...require(path.join(path.resolve('.'), configPath)),
    ...options,
  }
  const results = fs.readFileSync(
    path.resolve(process.cwd(), config.resultPath, 'coverage-test-report.xml'),
    {encoding: 'utf-8'},
  )
  const meta = fs.readFileSync(
    path.resolve(process.cwd(), config.metaPath, 'coverage-tests-metadata.json'),
    {encoding: 'utf-8'},
  )
  const isSandbox = config.sendReport === 'sandbox'
  process.stdout.write(`\nSending report to QA dashboard ${isSandbox ? '(sandbox)' : ''}... `)
  const report = {
    sdk: convertSdkNameToReportName(config.name),
    // group: group ? group : 'selenium',
    sandbox: isSandbox,
    results: convertJunitXmlToResultSchema({results, meta: JSON.parse(meta)}),
    id: config.reportId,
  }

  const result = await sendReport(report)
  process.stdout.write(result.isSuccessful ? 'Done!\n' : 'Failed!\n')
  if (!result.isSuccessful) {
    console.log(result.message)
  }
  await uploadToStorage({
    sdkName: config.name,
    reportId: config.reportId,
    isSandbox,
    payload: JSON.stringify(report),
  }).catch(err => {
    console.log(chalk.gray('Error uploading results to Azure:', err.message))
  })
}

module.exports = report
