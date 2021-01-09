const {EyesFactory} = require('./src/sdk')

process.env.APPLITOOLS_SCRIPT_RESULT_MAX_BYTE_LENGTH = 4718592 // 4.5 MB

module.exports = EyesFactory
module.exports.default = EyesFactory
