#!/usr/bin/env node

const chalk = require('chalk')
const cwd = process.cwd()
const path = require('path')
const fs = require('fs')
const {verifyChangelog, writeReleaseEntryToChangelog} = require('../changelog')
const {packInstall, lsDryRun} = require('../dry-run')
const {lint} = require('../lint')
const sendReleaseNotification = require('../send-report')
const {createDotFolder} = require('../setup')
const {verifyCommits, verifyInstalledVersions, verifyVersions} = require('../versions')
const {gitAdd, gitCommit, gitPushWithTags, isChanged} = require('../git')
const {yarnInstall, yarnUpgrade, verifyUnfixedDeps} = require('../yarn')

const args = require('yargs')
  .command(
    ['preversion', 'release-pre-check', 'pre-version'],
    'Run all verification checks pre-release',
    {
      skipVerifyInstalledVersions: {alias: 'sviv', type: 'boolean'},
      skipVerifyVersions: {alias: 'svv', type: 'boolean'},
      skipDeps: {alias: 'sd', type: 'boolean'},
    },
    async args => {
      if (!args.skipDeps) {
        console.log('[bongo preversion] yarn install')
        await yarnInstall()
      }
      console.log('[bongo preversion] lint')
      await lint(cwd)
      console.log('[bongo preversion] verify changelog')
      verifyChangelog(cwd)
      console.log('[bongo preversion] verify unfixed dependencies')
      verifyUnfixedDeps(cwd)
      if (!args.skipVerifyVersions) {
        console.log('[bongo preversion] verify commits')
        await verifyCommits({pkgPath: cwd}).catch(err => console.log(err.message))
      }
      try {
        console.log('[bongo preversion] verify versions')
        verifyVersions({pkgPath: cwd})
      } catch (err) {
        console.log(chalk.yellow(err.message))
      }
      if (!args.skipVerifyInstalledVersions) {
        console.log('[bongo preversion] verify installed versions')
        createDotFolder(cwd)
        await packInstall(cwd)
        await verifyInstalledVersions({
          pkgPath: cwd,
          installedDirectory: path.join('.bongo', 'dry-run'),
        })
      }
      await commitFiles()
      console.log('[bongo preversion] done!')
      return
    },
  )
  .command(['version'], 'Supportive steps to version a package', {}, async () => {
    writeReleaseEntryToChangelog(cwd)
    await gitAdd('CHANGELOG.md')
  })
  .command(
    ['postversion, post-version'],
    'Supportive steps to after a package has been versioned',
    {recipient: {alias: 'r', type: 'string'}},
    async args => {
      await gitPushWithTags()
      if (!args.skipReleaseNotification) {
        await sendReleaseNotification(cwd, args.recipient)
      }
    },
  )
  .command(['lint', 'l'], 'Static code analysis ftw', {}, async () => await lint(cwd))
  .command(['verify-changelog', 'vch'], 'Verify changelog has unreleased entries', {}, () =>
    verifyChangelog(cwd),
  )
  .command(
    ['verify-commits', 'vco'],
    'Verify no unreleased changes for internal dependencies exist',
    {},
    async () => await verifyCommits({pkgPath: cwd}),
  )
  .command(
    ['verify-versions', 'vv'],
    'Verify consistent versions in relevant packages',
    {},
    async () => {
      try {
        verifyVersions({pkgPath: cwd})
      } catch (err) {
        console.log(chalk.yellow(err.message))
      }
    },
  )
  .command(
    ['verify-installed-versions', 'viv'],
    'Verify correct dependencies are installable',
    {},
    async () => {
      createDotFolder(cwd)
      await packInstall(cwd)
      await verifyInstalledVersions({
        pkgPath: cwd,
        installedDirectory: path.join('.bongo', 'dry-run'),
      })
    },
  )
  .command(
    ['ls-dry-run', 'ls'],
    'Display dependencies from a verify-installed-versions run',
    {},
    () => lsDryRun(),
  )
  .command(['update-changelog', 'uc'], 'Create release entry in the changelog', {}, () =>
    writeReleaseEntryToChangelog(cwd),
  )
  .command(
    ['send-release-notification', 'hello-world'],
    'Send a notification that a has been released',
    {recipient: {alias: 'r', type: 'string'}},
    async () => await sendReleaseNotification(cwd, args.recipient),
  )
  .command(['deps', 'd'], 'update internal deps', {}, async () => {
    verifyUnfixedDeps(cwd)
    await yarnUpgrade({
      folder: cwd,
      upgradeAll: args.upgradeAll,
    })
    await commitFiles()
  })
  .demandCommand(1, 'exit')
  .fail((msg, error, args) => {
    if (msg === 'exit') {
      return args.showHelp()
    }
    const command = process.argv[2]
    if (process.argv.includes('--verbose')) {
      console.log(error)
    } else {
      console.log(chalk.red(error.message))
      console.log(`run "npx bongo ${command} --verbose" to see stack trace`)
    }
    process.exit(1)
  })
  .wrap(150)
  .help().argv

async function commitFiles(shouldCommit = true) {
  if (shouldCommit) {
    const files = ['package.json', 'CHANGELOG.md', 'yarn.lock']
    for (const file of files) {
      // git add fails when trying to add files that weren't changed
      if (await isChanged(file)) {
        await gitAdd(file)
      }
    }

    // git commit fails when trying to commit files that weren't changed
    if (await isChanged(...files)) {
      const pkgName = JSON.parse(fs.readFileSync(path.resolve(cwd, 'package.json'))).name
      await gitCommit(`[auto commit] ${pkgName}: upgrade deps`)
    }
  }
}
