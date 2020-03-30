'use strict'
const chalk = require('chalk')

if (!process.env.APPLITOOLS_API_KEY_SDK) {
  console.log(chalk.red('Missing APPLITOOLS_API_KEY_SDK!'))
  exit(1)
}

const origApiKey = process.env.APPLITOOLS_API_KEY
if (process.env.APPLITOOLS_API_KEY_SDK !== origApiKey) {
  console.log(
    chalk.yellow(
      `Overriding APPLITOOLS_API_KEY with APPLITOOLS_API_KEY_SDK, original key was ${origApiKey}.`,
    ),
  )
  process.env.APPLITOOLS_API_KEY = process.env.APPLITOOLS_API_KEY_SDK
}
