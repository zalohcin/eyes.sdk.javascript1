#!/usr/bin/env node

const args = require('yargs').argv
const verifyChangelog = require('../changelog/scripts/verify-changelog')
const updateChangelog = require('../changelog/scripts/update-changelog')

function execute(cb) {
  try {
    cb()
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

if (args['verify-changelog']) {
  execute(verifyChangelog)
} else if (args['update-changelog']) {
  execute(updateChangelog)
} else {
  execute(() => {
    throw 'Invalid option provided'
  })
}
