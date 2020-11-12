const fs = require('fs')
const path = require('path')
const output = fs.readFileSync(path.join(__dirname, './output'), {encoding: 'utf-8'}).split('\n')

const result = {}

output.forEach((line, index) => {
  if (line.includes('Error')) {
    try {
      const errorType = line
        .match(/^(.*?):/g)[0]
        .trim()
        .replace(/:/, '')
      const jobUrlMatch = line.match(/(http|https)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/)
      const jobUrl = jobUrlMatch !== null ? jobUrlMatch[0] : 'n/a'
      const testName = output[index - 1].trim().replace(/:/, '')
      if (!result[errorType]) result[errorType] = []
      result[errorType].push({name: testName, url: jobUrl})
    } catch (error) {
      debugger
      throw error
    }
  }
})

debugger
console.log(result)
