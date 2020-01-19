const {findLocalDepsFromPackage} = require('./packages')
const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)

async function execOnLocalDepsForPackage(pkg, cb) {
  const deps = findLocalDepsFromPackage(pkg)
  await Promise.all(deps.map(cb))
}

async function link(pkgPath, depPath) {
  return await pexec(`cd ${pkgPath}; npm link ${depPath}`).catch(
    async () => await pexec(`cd ${pkgPath}; npm link ${depPath}`),
  )
}

async function linkPackage(pkg) {
  await execOnLocalDepsForPackage(pkg, async dep => {
    await link(pkg.path, dep.path)
  })
}

async function unlink(pkgPath, depPath) {
  return await pexec(`cd ${pkgPath}; npm unlink ${depPath}`).catch(async () => {
    await pexec(`cd ${pkgPath}; npm unlink ${depPath}`)
  })
}

async function unlinkPackage(pkg) {
  await execOnLocalDepsForPackage(pkg, async dep => {
    await unlink(pkg.path, dep.path)
  })
}

module.exports = {
  linkPackage,
  unlinkPackage,
}
