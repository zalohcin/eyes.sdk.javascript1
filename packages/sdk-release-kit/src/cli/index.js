#!/usr/bin/env node

const args = require('yargs').argv
const chalk = require('chalk')
const cwd = process.cwd()
const path = require('path')
const verifyChangelog = require('../changelog/scripts/verify-changelog')
const updateChangelog = require('../changelog/scripts/update-changelog')
const sendReleaseNotification = require('../send-report/scripts/send-release-notification')
const verifyVersions = require('../versions/scripts/verify-versions')
const verifyCommits = require('../versions/scripts/verify-commits')
const createDotFolder = require('../setup/scripts/create-dot-folder')
const packInstall = require('../dry-run/scripts/pack-install')
const verifyInstalledVersions = require('../versions/scripts/verify-installed-versions')
const lsDryRun = require('../dry-run/scripts/ls-dry-run.js')
const {lint} = require('../lint')

;(async () => {
  try {
    if (args['verify-changelog']) {
      await verifyChangelog(cwd)
    } else if (args['update-changelog']) {
      updateChangelog(cwd)
    } else if (args['send-release-notification']) {
      await sendReleaseNotification(cwd, args.recipient)
    } else if (args['verify-versions']) {
      await verifyVersions({isFix: args.fix, pkgPath: cwd})
    } else if (args['verify-commits']) {
      const isForce = args.force || process.env.BONGO_VERIFY_COMMITS_FORCE
      await verifyCommits({pkgPath: cwd, isForce})
    } else if (args['verify-installed-versions']) {
      createDotFolder(cwd)
      await packInstall(cwd)
      await verifyInstalledVersions({
        pkgPath: cwd,
        installedDirectory: path.join('.bongo', 'dry-run'),
      })
    } else if (args['release-pre-check']) {
      await lint()
      await verifyChangelog(cwd)
      await verifyVersions({isFix: args.fix, pkgPath: cwd})
      const isForce = args.force || process.env.BONGO_VERIFY_COMMITS_FORCE
      await verifyCommits({pkgPath: cwd, isForce})
      createDotFolder(cwd)
      await packInstall(cwd)
      await verifyInstalledVersions({
        pkgPath: cwd,
        installedDirectory: path.join('.bongo', 'dry-run'),
      })
    } else if (args['ls-dry-run']) {
      lsDryRun()
    } else {
      throw new Error('Invalid option provided')
    }
  } catch (error) {
    console.log(chalk.red(error.message))
    process.exit(1)
  }
})()
