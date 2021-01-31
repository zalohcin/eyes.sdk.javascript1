const fetch = require('fetch');
const {URL} = require('url');

async function getBatchInfo(
    testResults,
    apiKey = process.env.APPLITOOLS_API_KEY_SDK || process.env.APPLITOOLS_API_KEY,
  ) {
    const sessionUrl = new URL(testResults.getAppUrls().getSession())
    const accountId = sessionUrl.searchParams.get('accountId')
    const url = `${sessionUrl.origin}/api/sessions/batches/${testResults.getBatchId()}&apiKey=${apiKey}?accountId=${accountId}`
    
    const response = await fetch(url)
    return response.json()
}

module.exports = {getBatchInfo}