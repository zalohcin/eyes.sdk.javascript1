#!/usr/bin/env node
/* eslint-disable no-console */

'use strict'

const chalk = require('chalk')
const {makeCheckNetwork} = require('../lib/troubleshoot/checkNetwork')

function print(...msg) {
  process.stdout.write(chalk.cyan(...msg))
}
function printErr(...msg) {
  process.stdout.write(chalk.red(...msg))
}
function printSuccess(...msg) {
  process.stdout.write(chalk.green(...msg))
}
function clearLine() {
  process.stdout.clearLine()
  process.stdout.cursorTo(0)
}

const checkNetwork = makeCheckNetwork({print, printErr, printSuccess, clearLine})
checkNetwork()
