#!/usr/bin/env node

const args = require('yargs').argv
const verifyChangelog = require('../changelog/scripts/verify-changelog')
const updateChangelog = require('../changelog/scripts/update-changelog')
const sendReleaseNotification = require('../send-report/scripts/send-release-notification')
const verifyVersions = require('../versions/scripts/verify-versions.js')

async function execute(cb) {
  try {
    await cb()
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

if (args['verify-changelog']) {
  execute(verifyChangelog)
} else if (args['update-changelog']) {
  execute(updateChangelog)
} else if (args['send-release-notification']) {
  execute(sendReleaseNotification.bind(undefined, args.recipient))
} else if (args['verify-versions']) {
  execute(verifyVersions.bind(undefined, args.fix))
} else {
  execute(() => {
    throw 'Invalid option provided'
  })
}
