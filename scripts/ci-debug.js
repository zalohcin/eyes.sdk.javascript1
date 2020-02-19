// script to make running debug jobs on Travis simpler
// https://gist.github.com/tourdedave/3ed6a1efb0eecf13be820e7007f927d4
const {exec} = require('child_process')
const {promisify: p} = require('util')

const pexec = p(exec)
const token = process.env.TRAVIS_ACCESS_TOKEN
if (!token) throw 'No access token for Travis found on environment variable TRAVIS_ACCESS_TOKEN'

const job_id = process.argv[2]
if (!job_id) throw 'No Travis job ID provided (as an argument)'
;(async function() {
  const cmd = `curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "Travis-API-Version: 3" \
    -H "Authorization: token ${token}" \
    -d "{\"quiet\": true}" \
    https://api.travis-ci.org/job/${job_id}/debug`
  const {stdout} = await pexec(cmd)
  console.log('\nRequesting debug:\n', cmd)
  console.log('\nReceived:\n', stdout)
})()
