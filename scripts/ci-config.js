const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const makePackagesList = require('./package-list')

const config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '..', '.travis.yml'), 'utf8'))
const pkgs = makePackagesList()

config.jobs = {
  include: [...makeJobsForLintStage(), ...makeJobsForTestStage()],
}

fs.writeFileSync(path.join(__dirname, '..', '.travis.yml'), yaml.safeDump(config))

function makeJobsForLintStage() {
  return makeStageWithSingleJob({stageName: 'lint', scriptName: 'lint'})
}

function makeJobsForTestStage() {
  return makeStageWithJobsForEachPackage({stageName: 'test', scriptName: 'test'})
}

function makeStageWithSingleJob({stageName, scriptName}) {
  return [{stage: stageName, script: `yarn ${scriptName}`}]
}

function makeStageWithJobsForEachPackage({stageName, scriptName}) {
  let jobs = []
  pkgs.forEach(pkg => {
    const {scripts} = require(path.resolve(__dirname, '..', pkg.path, 'package.json'))
    if (scripts.hasOwnProperty(scriptName)) {
      jobs.push({
        name: pkg.name,
        script: `cd ${pkg.path}; yarn ${scriptName}`,
      })
    }
  })
  if (jobs.length) jobs[0].stage = stageName
  return jobs
}
