const fs = require('fs')
const yaml = require('js-yaml')
const path = require('path')

const config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '..', '.travis.yml'), 'utf8'))

function makePackagesList() {
  const dir = path.join(__dirname, '..', 'packages')
  const packages = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory())
  return packages.map(pkgName => {
    const pkgDir = path.join(dir, pkgName)
    const packageJson = require(path.join(pkgDir, 'package.json'))
    return {
      name: packageJson.name,
      folderName: pkgName,
      scripts: {...packageJson.scripts},
    }
  })
}

function makeJobsForLintStage(stageName = 'lint') {
  const pkgs = makePackagesList()
  const jobs = []
  pkgs.forEach(pkg => {
    jobs.push({
      name: pkg.name,
      script: `cd packages/${pkg.folderName}; npm install; npm run lint`,
    })
  })
  if (jobs.length) jobs[0].stage = stageName
  return jobs
}

function makeJobsForUnitStage(stageName = 'unit tests') {
  const pkgs = makePackagesList()
  let jobs = []
  pkgs.forEach(pkg => {
    if (pkg.scripts.hasOwnProperty('test:unit')) {
      jobs.push({
        name: pkg.name,
        script: `cd packages/${pkg.folderName}; npm install; npm run test:unit`,
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
        script: `cd packages/${pkg.folderName}; npm install; npm run test:it`,
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
