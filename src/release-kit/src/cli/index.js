#!/usr/bin/env node

const args = require('yargs').argv

async function execute(cb) {
  try {
    await cb()
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

if (args['verify-changelog']) {
  const verifyChangelog = require('../changelog/scripts/verify-changelog')
  execute(verifyChangelog)
} else if (args['update-changelog']) {
  const updateChangelog = require('../changelog/scripts/update-changelog')
  execute(updateChangelog)
} else if (args['send-release-notification']) {
  const sendReleaseNotification = require('../send-report/scripts/send-release-notification')
  execute(sendReleaseNotification.bind(undefined, args.recipient))
} else if (args['verify-versions']) {
  const verifyVersions = require('../versions/scripts/verify-versions.js')
  execute(verifyVersions.bind(undefined, args.fix))
} else if (args['build']) {
  const copyInternalPackages = require('../build/scripts/copy-internal-packages')
  execute(copyInternalPackages)
} else {
  execute(() => {
    throw 'Invalid option provided'
  })
}
