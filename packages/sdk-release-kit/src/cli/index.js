#!/usr/bin/env node

const args = require('yargs')
  .command(['preversion', 'release-pre-check'], 'Run all verification checks pre-release')
  // TODO: implement
  // TODO: then update all packages
  //.command(['version'], 'Supportive steps to version a package')
  //.command(['postversion'], 'Supportive steps to after a package has been versioned')
  .command(['lint', 'l'], 'Static code analysis ftw')
  .command(['verify-changelog', 'vch'], 'Verify changelog has unreleased entries')
  .command(
    ['verify-commits', 'vco'],
    'Verify no unreleased changes for internal dependencies exist',
  )
  .command(['verify-versions', 'vv'], 'Verify consistent versions in relevant packages')
  .command(['verify-installed-versions', 'viv'], 'Verify correct dependencies are installable')
  .command(['ls-dry-run', 'ls'], 'Display dependencies from a verify-installed-versions run')
  .command(['update-changelog', 'uc'], 'Create release entry in the changelog')
  .command(
    ['send-release-notification', 'hello-world'],
    'Send a notification that a has been released',
  )
  .demandCommand()
  .help().argv
const chalk = require('chalk')
const cwd = process.cwd()
const path = require('path')
const {verifyChangelog, writeReleaseEntryToChangelog} = require('../changelog')
const {packInstall, lsDryRun} = require('../dry-run')
const {lint} = require('../lint')
const sendReleaseNotification = require('../send-report')
const {createDotFolder} = require('../setup')
const {verifyCommits, verifyInstalledVersions, verifyVersions} = require('../versions')

;(async () => {
  try {
    let isForce
    const command = args._[0]
    switch (command) {
      case 'lint':
      case 'l':
        return await lint(cwd)
      case 'ls-dry-run':
      case 'ls':
        return lsDryRun()
      case 'preversion':
      case 'release-pre-check':
        await lint(cwd)
        await verifyChangelog(cwd)
        await verifyVersions({isFix: args.fix, pkgPath: cwd})
        isForce =
          args.force || process.env.BONGO_VERIFY_COMMITS_FORCE || args['skip-verify-commits']
        await verifyCommits({pkgPath: cwd, isForce})
        createDotFolder(cwd)
        await packInstall(cwd)
        return await verifyInstalledVersions({
          pkgPath: cwd,
          installedDirectory: path.join('.bongo', 'dry-run'),
        })
      case 'send-release-notification':
      case 'hello-world':
        return await sendReleaseNotification(cwd, args.recipient)
      case 'update-changelog':
      case 'uc':
        return writeReleaseEntryToChangelog(cwd)
      case 'verify-changelog':
      case 'vch':
        return await verifyChangelog(cwd)
      case 'verify-commits':
      case 'vco':
        isForce =
          args.force || process.env.BONGO_VERIFY_COMMITS_FORCE || args['skip-verify-commits']
        return await verifyCommits({pkgPath: cwd, isForce})
      case 'verify-installed-versions':
      case 'viv':
        createDotFolder(cwd)
        await packInstall(cwd)
        return await verifyInstalledVersions({
          pkgPath: cwd,
          installedDirectory: path.join('.bongo', 'dry-run'),
        })
      case 'verify-versions':
      case 'vv':
        return await verifyVersions({isFix: args.fix, pkgPath: cwd})
      default:
        throw new Error('Invalid option provided')
    }
  } catch (error) {
    console.log(chalk.red(error.message))
    process.exit(1)
  }
})()
