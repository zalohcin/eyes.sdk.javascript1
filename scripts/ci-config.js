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

function makeJobsForLintStage(stageName = 'lint') {
  return [{stage: stageName, script: `yarn run lint`}]
}

function makeJobsForUnitStage(stageName = 'unit tests') {
  const pkgs = makePackagesList()
  let jobs = []
  pkgs.forEach(pkg => {
    if (pkg.scripts.hasOwnProperty('test:unit')) {
      jobs.push({
        name: pkg.name,
        script: `cd ${pkg.path}; yarn run test:unit`,
      })
    }
  })
  if (jobs.length) jobs[0].stage = stageName
  return jobs
}

function makeJobsForItStage(stageName = 'end-to-end tests') {
  const pkgs = makePackagesList()
  let jobs = []
  pkgs.forEach(pkg => {
    if (pkg.scripts.hasOwnProperty('test:it')) {
      jobs.push({
        name: pkg.name,
        script: `cd ${pkg.path}; yarn run test:it`,
      })
    }
  })
  if (jobs.length) jobs[0].stage = stageName
  return jobs
}

config.jobs = {
  include: [...makeJobsForLintStage(), ...makeJobsForUnitStage(), ...makeJobsForItStage()],
}
fs.writeFileSync(path.join(__dirname, '..', '.travis.yml'), yaml.safeDump(config))
