const fetch = require('node-fetch')

async function sendReport(payload) {
  const result = await fetch('http://sdk-test-results.herokuapp.com/result', {
    method: 'post',
    body: JSON.stringify(payload),
    headers: {'Content-Type': 'application/json'},
  })
  return {isSuccessful: result.status === 200, message: result.statusText}
}

module.exports = {sendReport}
