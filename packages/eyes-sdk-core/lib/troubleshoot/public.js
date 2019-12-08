/* eslint-disable no-console */

'use strict'

const axios = require('axios')
const {curlGet, presult} = require('./utils')
require('@applitools/isomorphic-fetch')

const JSON_TEST_URL = 'http://echo.jsontest.com/key/value/one/two'

const validateJsonTestResult = res => {
  if (!res || !res.one || !res.key) {
    throw new Error(`bad json test result ${JSON.stringify(res)}`)
  }
}

const testFetch = () =>
  global
    .fetch(JSON_TEST_URL)
    .then(r => r.json())
    .then(res => validateJsonTestResult(res))

const testCurl = async () => {
  const stdout = await curlGet(JSON_TEST_URL)
  const result = JSON.parse(stdout)
  validateJsonTestResult(result)
}

const testAxios = async () => {
  const options = {
    method: 'GET',
    url: JSON_TEST_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    responseType: 'json',
  }

  const [err, res] = await presult(axios(options))
  if (err) {
    throw err
  }
  validateJsonTestResult(res.data)
}

exports.testAxios = testAxios
exports.testCurl = testCurl
exports.testFetch = testFetch
exports.url = JSON_TEST_URL
