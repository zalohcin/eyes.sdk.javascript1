const fs = require('fs')
const path = require('path')
const {createTestFileString} = require('./render')
const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)

async function createTestFiles(emittedTests, sdkImplementation) {
  const targetDirectory = path.join(process.cwd(), sdkImplementation.out)
  //fs.rmdirSync(targetDirectory, {recursive: true})
  await pexec(`rm -rf ${targetDirectory}`)
  fs.mkdirSync(targetDirectory)

  emittedTests.forEach(test => {
    const payload = createTestFileString(test, sdkImplementation.testFrameworkTemplate)
    const extname = sdkImplementation.ext
    const filePath = path.resolve(targetDirectory, `${test.name}${extname}`)
    fs.writeFileSync(filePath, payload)
  })
}

module.exports = {
  createTestFiles,
}
