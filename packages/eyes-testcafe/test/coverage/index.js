const {coverageTestsConfig} = require('@applitools/sdk-shared')

const modifiedConfig = {...coverageTestsConfig}
modifiedConfig.template = './test/coverage/template.hbs'

module.exports = modifiedConfig
