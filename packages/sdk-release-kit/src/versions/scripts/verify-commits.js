'use strict'

const path = require('path')
const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)
const chalk = require('chalk')

module.exports = async pkgPath => {
  const packageJson = require(path.resolve(pkgPath, 'package.json'))
  const {name, version} = packageJson
  const tagName = `${name}@${version}`
  let output
  try {
    output = (await pexec(`git log --oneline ${tagName}..HEAD -- ${pkgPath}`)).stdout
  } catch (ex) {
    if (/bad revision/.test(ex.message)) {
      const tagNameCyan = chalk.cyan(tagName)
      const versionCyan = chalk.cyan(version)
      console.log(
        chalk.yellow(
          `Warning: unable to detect unreleased commits because tag ${tagNameCyan} is missing from git.
Please make sure there are no additional commits to this package since the release of version ${versionCyan}!`,
        ),
      )
    } else {
      throw ex
    }
  }
  if (output) {
    throw new Error('There are unreleased commits in this package:\n' + output)
  }
}
