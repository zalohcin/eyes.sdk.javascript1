'use strict'

const fs = require('fs')
const assert = require('assert')
const {Eyes, ConsoleLogHandler, TestResultsStatus, GeneralUtils} = require('../../index')

let /** @type {Eyes} */ eyes
describe('EyesImages.OCR', function() {
  this.timeout(5 * 60 * 1000)

  before(function() {
    eyes = new Eyes()
    eyes.setLogHandler(new ConsoleLogHandler(false))
    // eyes.setProxy('http://localhost:8888');
  })

  it('ShouldExtractText', async function() {
    const testName = `${this.test.title}_${GeneralUtils.randomAlphanumeric()}`
    const image1 = `${__dirname}/../fixtures/image1.png`
    const image2 = fs.readFileSync(`${__dirname}/../fixtures/image2.png`)

    await eyes.open(this.test.parent.title, testName)
    const texts = await eyes.extractText([
      {image: image1, target: {left: 138, top: 0, width: 100, height: 40}},
      {image: image2, target: {left: 366, top: 0, width: 100, height: 40}, hint: 'features'},
      {
        image: image2.toString('base64'),
        target: {left: 455, top: 0, width: 100, height: 40},
        hint: '\\l+',
      },
    ])
    await eyes.close(false)

    assert.strictEqual(texts.length, 3)
    assert.strictEqual(texts[0], 'applitools')
    assert.strictEqual(texts[1], 'FEATURES')
    assert.strictEqual(texts[2], 'PRICING')
  })

  it('ShouldExtractTextRegions', async function() {
    const testName = `${this.test.title}_${GeneralUtils.randomAlphanumeric()}`
    const image1 = `${__dirname}/../fixtures/image1.png`

    await eyes.open(this.test.parent.title, testName)
    const regions = await eyes.extractTextRegions({
      image: image1,
      patterns: ['applitools', 'customers'],
      ignoreCase: true,
    })
    await eyes.close(false)

    assert.strictEqual(regions['applitools'][0].text, "'Applitools transformed on")
    assert.strictEqual(regions['applitools'][1].text, "'Applitools took us trom 30 hours")
    assert.strictEqual(regions['applitools'][2].text, "they've been singing Applitools'")

    assert.strictEqual(regions['customers'][0].text, 'CUSTOMERS')
  })
})
