'use strict'
const chalk = require('chalk')

if (!process.env.APPLITOOLS_API_KEY_JSSDK) {
  console.log(chalk.red('Missing APPLITOOLS_API_KEY_JSSDK!'))
  process.exit(1)
}
