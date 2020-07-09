function createTestFileString(emittedTest, testFrameworkTemplate) {
  return testFrameworkTemplate(emittedTest)
}

module.exports = {
  createTestFileString,
}
