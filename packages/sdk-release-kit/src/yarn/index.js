'use strict'
const path = require('path')
const pickby = require('lodash.pickby')
const {sh} = require('@applitools/sdk-shared/src/process-commons')
const chalk = require('chalk')

async function yarnInstall() {
  await sh(`yarn install`)
}

async function yarnUpgrade(folder, upgradeAll) {
  const pkgJson = require(path.resolve(folder, 'package.json'))
  const {dependencies} = pkgJson
  const applitoolsDeps = pickby(dependencies, (_, pkg) => pkg.startsWith('@applitools/'))
  const depsToUpgrade = upgradeAll ? dependencies : applitoolsDeps
  const depsStr = Object.keys(depsToUpgrade).join(' ')
  const cmd = `yarn upgrade --exact --latest ${depsStr}`
  console.log(cmd)

  await sh(cmd)
}

function getUnfixedDeps(dependencies) {
  return Object.keys(dependencies).reduce((warnings, pkg) => {
    return isNaN(Number(dependencies[pkg][0])) ? {...warnings, [pkg]: dependencies[pkg]} : warnings
  }, {})
}

function verifyUnfixedDeps(folder) {
  const pkgJson = require(path.resolve(folder, 'package.json'))
  const {dependencies} = pkgJson
  const unfixedDeps = getUnfixedDeps(dependencies)
  const messages = []
  Object.entries(unfixedDeps).forEach(([key, value]) => {
    messages.push(chalk.red(`depenency is not fixed: ${key}@${value}`))
  })
  if (messages.length) {
    throw new Error(messages.join('\n'))
  }
}

module.exports = {
  yarnInstall,
  yarnUpgrade,
  getUnfixedDeps,
  verifyUnfixedDeps,
}
