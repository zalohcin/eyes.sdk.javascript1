#!/usr/bin/env node

const args = require('yargs').argv
const chalk = require('chalk')
const cwd = process.cwd()
const path = require('path')
const {verifyChangelog, updateChangelog} = require('../changelog')
const {packInstall, lsDryRun} = require('../dry-run')
const {lint} = require('../lint')
const sendReleaseNotification = require('../send-report')
const {createDotFolder} = require('../setup')
const {verifyCommits, verifyInstalledVersions, verifyVersions} = require('../versions')

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
      await lint(cwd)
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
