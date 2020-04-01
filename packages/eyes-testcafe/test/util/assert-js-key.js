'use strict'
const chalk = require('chalk')

if (!process.env.APPLITOOLS_API_KEY_JSSDK) {
  console.log(chalk.red('Missing APPLITOOLS_API_KEY_JSSDK!'))
  process.exit(1)
}
console.log(
  chalk.yellow(
    `Overriding APPLITOOLS_API_KEY (${process.env.APPLITOOLS_API_KEY}) with APPLITOOLS_API_KEY_JSSDK.`,
  ),
)
