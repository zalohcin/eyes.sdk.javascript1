const fs = require('fs')
const yaml = require('js-yaml')
const path = require('path')
const {makePackagesList} = require('./packages')

const config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '..', '.travis.yml'), 'utf8'))

function makeJobs() {
  const pkgs = makePackagesList().map(pkg => pkg.path.match(/packages\/(.*)$/)[1])
  const lint = {stage: 'lint', script: 'npm run setup; npm run lint'}
  const test_unit = pkgs.map(pkgName => ({
    name: pkgName,
    script: `cd packages/${pkgName}; npm install; npm run test:unit`,
  }))
  test_unit[0].stage = 'unit tests'
  const test_e2e = pkgs.map(pkgName => ({
    name: pkgName,
    script: `cd packages/${pkgName}; npm install; npm run test:it`,
  }))
  test_e2e[0].stage = 'end-to-end tests'
  return [lint, ...test_unit, ...test_e2e]
}

config.jobs = {include: makeJobs()}
fs.writeFileSync(path.join(__dirname, '..', '.travis.yml'), yaml.safeDump(config))
