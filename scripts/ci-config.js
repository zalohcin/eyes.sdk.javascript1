const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '..', '.travis.yml'), 'utf8'))

function makePackagesList() {
  const packages = require(path.join(__dirname, '..', 'package.json')).workspaces
  return packages.map(pkgPath => {
    const pkgDir = path.join(__dirname, '..', pkgPath)
    const packageJson = require(path.join(pkgDir, 'package.json'))
    return {
      name: packageJson.name,
      path: pkgPath,
      scripts: {...packageJson.scripts},
    }
  })
}

const pkgs = makePackagesList()

function makeStageWithSingleJob(name, script) {
  return {stage: name, script}
}

function makeStageWithJobsForEachPackage(stageName, scriptName, script) {
  let jobs = []
  pkgs.forEach(pkg => {
    const _script = script(pkg.path)
    if (pkg.scripts.hasOwnProperty(scriptName)) {
      jobs.push({
        name: pkg.name,
        script: _script,
      })
    }
  })
  if (jobs.length) jobs[0].stage = stageName
  return jobs
}

function makeJobsForLintStage() {
  return [makeStageWithSingleJob('lint', 'yarn run lint')]
}

function makeJobsForUnitStage() {
  return makeStageWithJobsForEachPackage(
    'unit tests',
    'test:unit',
    pkgPath => `cd ${pkgPath}; yarn run test:unit`,
  )
}

function makeJobsForItStage() {
  return makeStageWithJobsForEachPackage(
    'end-to-end tests',
    'test:it',
    pkgPath => `cd ${pkgPath}; yarn run test:it`,
  )
}

config.jobs = {
  include: [...makeJobsForLintStage(), ...makeJobsForUnitStage(), ...makeJobsForItStage()],
}
fs.writeFileSync(path.join(__dirname, '..', '.travis.yml'), yaml.safeDump(config))
