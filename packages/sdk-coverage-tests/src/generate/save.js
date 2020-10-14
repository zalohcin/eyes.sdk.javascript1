const fs = require('fs')
const path = require('path')

async function createTestFiles(tests, {out, ext, testFrameworkTemplate} = {}) {
  const targetDirectory = path.join(process.cwd(), out)

  fs.rmdirSync(targetDirectory, {recursive: true})
  fs.mkdirSync(targetDirectory, {recursive: true})

  tests.forEach(test => {
    const payload = testFrameworkTemplate(test)
    const filePath = path.resolve(targetDirectory, `${test.filename}${ext}`)
    fs.writeFileSync(filePath, payload)
  })
}

async function createTestMetaData(tests, {metaPath = ''} = {}) {
  const targetDirectory = path.resolve(process.cwd(), metaPath)
  fs.mkdirSync(targetDirectory, {recursive: true})

  const meta = tests.reduce((meta, test) => {
    meta[test.filename] = {isGeneric: true}
    return meta
  }, {})

  const filePath = path.resolve(targetDirectory, 'coverage-tests-metadata.json')
  fs.writeFileSync(filePath, JSON.stringify(meta, null, '\t'))
}

exports.createTestFiles = createTestFiles
exports.createTestMetaData = createTestMetaData
