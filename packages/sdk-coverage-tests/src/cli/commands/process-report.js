const path = require('path')
const {readFileSync} = require('fs')
const {createReport} = require('../../report')
const {sendReport} = require('../../send-report')
const {logDebug} = require('../../log')

async function processReport(args) {
  const {name: sdkName, meta: metaPath} = require(path.join(process.cwd(), args.path))
  logDebug(args.reportName)
  const results = readFileSync(path.resolve(process.cwd(), args.reportName), {
    encoding: 'utf-8',
  })
  const metaDataFile = readFileSync(
    path.resolve(process.cwd(), metaPath || 'coverage-tests-metadata.json'),
  )
  const metaData = JSON.parse(metaDataFile)
  logDebug(metaData)
  const isSandbox = args.sendReport === 'sandbox'
  process.stdout.write(`\nSending report to QA dashboard ${isSandbox ? '(sandbox)' : ''}... `)
  const report = createReport({
    sdkName,
    xmlResult: results,
    sandbox: isSandbox,
    id: args.reportId,
    metaData: metaData,
  })
  logDebug(report)
  const result = await sendReport(report)
  process.stdout.write(result.isSuccessful ? 'Done!\n' : 'Failed!\n')
}

module.exports = {
  processReport,
}
