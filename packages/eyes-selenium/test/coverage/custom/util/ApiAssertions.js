'use strict'
const axios = require('axios')
const {expect} = require('chai')

const RegionType = ['ignore', 'strict', 'content', 'layout', 'floating', 'accessibility']

async function ApiAssertion(testSummary, expected) {
  let results = await getTestResults()
  let data = await getApiData(results.getApiUrls().getSession(), results.getSecretToken())
  let imageMatchSettings = data.actualAppOutput[0].imageMatchSettings // can be reconsidered but in the DotNet suite only first one is used for assertions
  assertProperties()
  assertRegions()

  async function getTestResults() {
    let testResultContainer = await testSummary.getAllResults()
    return testResultContainer[0].getTestResults()
  }

  async function getApiData(url, token) {
    let response = await axios.get(
      `${url}?format=json&AccessToken=${token}&apiKey=${process.env.APPLITOOLS_API_KEY}`,
    )
    return response.data
  }

  function assertRegions() {
    RegionType.forEach(type => {
      if (expected[type]) expect(imageMatchSettings[type]).include.deep.members(expected[type])
    })
  }

  function assertProperties() {
    for (let property in expected) {
      if (!Array.isArray(expected[property]) && expected.hasOwnProperty(property)) {
        expect(imageMatchSettings[property]).to.be.equal(expected[property])
      }
    }
  }
}

module.exports.ApiAssertion = ApiAssertion
