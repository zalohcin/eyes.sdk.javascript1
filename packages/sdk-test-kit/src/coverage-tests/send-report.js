const fetch = require('node-fetch')

async function sendReport(payload) {
  return await fetch('http://sdk-test-results.herokuapp.com/result', {
    method: 'post',
    body: JSON.stringify(payload),
    headers: {'Content-Type': 'application/json'},
  })
}

module.exports = {sendReport}
