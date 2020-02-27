const {readFileSync} = require('fs')
const {verifyChangelog} = require('..')
const path = require('path')

const targetFolder = process.cwd()
const changelogContents = readFileSync(path.resolve(targetFolder, 'CHANGELOG.md'), 'utf8')
const version = JSON.parse(readFileSync(path.resolve(targetFolder, 'package.json'), 'utf8')).version

module.exports = verifyChangelog.bind(undefined, {changelogContents, version})
