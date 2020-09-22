#!/usr/bin/env node

const args = require('yargs')
  .command(
    ['preversion', 'release-pre-check', 'pre-version'],
    'Run all verification checks pre-release',
  )
  .command(['version'], 'Supportive steps to version a package')
  .command(['postversion, post-version'], 'Supportive steps to after a package has been versioned')
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
const {gitAdd, gitCommit, gitPullWithRebase, gitPushWithTags, isStagedForCommit} = require('../git')
const {yarnInstall, yarnUpgrade, verifyUnfixedDeps} = require('../yarn')

const command = args._[0]

;(async () => {
  try {
    switch (command) {
      case 'lint':
      case 'l':
        return await lint(cwd)
      case 'ls-dry-run':
      case 'ls':
        return lsDryRun()
      case 'postversion':
      case 'post-version':
        await gitPushWithTags()
        if (!args['skip-release-notification']) {
          await sendReleaseNotification(cwd, args.recipient)
        }
        return
      case 'preversion':
      case 'pre-version':
      case 'release-pre-check':
        console.log('git pull')
        await gitPullWithRebase()
        console.log('lint')
        await lint(cwd)
        console.log('verify changelog')
        await verifyChangelog(cwd)
        console.log('verify unfixed dependencies')
        verifyUnfixedDeps(cwd)
        if (!process.env.BONGO_SKIP_VERIFY_COMMITS) {
          console.log('verify commits')
          await verifyCommits({pkgPath: cwd, isForce: process.env.BONGO_VERIFY_COMMITS_FORCE})
        }
        if (!process.env.BONGO_SKIP_VERIFY_VERSIONS) {
          console.log('verify versions')
          await verifyVersions({pkgPath: cwd})
        }
        console.log('yarn install')
        await yarnInstall()
        console.log('yarn upgrade')
        await yarnUpgrade({
          folder: cwd,
          upgradeAll: process.env.BONGO_UPGRADE_ALL,
          skipDev: process.env.BONGO_SKIP_DEV,
        })
        if (!process.env.BONGO_SKIP_VERIFY_INSTALLED_VERSIONS) {
          console.log('verify installed versions')
          createDotFolder(cwd)
          await packInstall(cwd)
          await verifyInstalledVersions({
            pkgPath: cwd,
            installedDirectory: path.join('.bongo', 'dry-run'),
          })
        }
        console.log('done!')
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
        return await verifyCommits({pkgPath: cwd})
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
        return verifyVersions({pkgPath: cwd})
      case 'version':
        writeReleaseEntryToChangelog(cwd)
        return await gitAdd('CHANGELOG.md')
      case 'deps':
        verifyUnfixedDeps(cwd)
        await yarnUpgrade({
          folder: cwd,
          upgradeAll: process.env.BONGO_UPGRADE_ALL,
          skipDev: process.env.BONGO_SKIP_DEV,
        })
        if (!args.skipCommit) {
          await gitAdd('package.json')
          await gitAdd('CHANGELOG.md')
          if (await isStagedForCommit('package.json', 'CHANGELOG.md')) {
            await gitCommit()
          }
        }
        return
      default:
        throw new Error('Invalid option provided')
    }
  } catch (error) {
    if (args.verbose) {
      console.log(error)
    } else {
      console.log(chalk.red(error.message))
      console.log(`run "npx bongo ${command} --verbose" to see stack trace`)
    }
    process.exit(1)
  }
})()
