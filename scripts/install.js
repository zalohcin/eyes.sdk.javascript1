const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)
const {makePackagesList} = require('./packages')
const {linkPackage} = require('./link-util')

const packages = makePackagesList()

async function installPackage(pkg) {
  await pexec(`cd ${pkg.path}; npm install`).catch(async () => {
    await pexec(`cd ${pkg.path}; npm install`).catch(error => {
      console.log(error)
    })
  })
}

;(async function main() {
  console.log('Setting up packages in the mono\n')
  const start = new Date()
  await Promise.all(
    packages.map(async pkg => {
      await installPackage(pkg)
      console.log(`[✓] ${pkg.name} (installed)`)
    }),
  )
  await Promise.all(
    packages.map(async pkg => {
      await linkPackage(pkg)
      console.log(`[✓] ${pkg.name} (linked)`)
    }),
  )
  const end = new Date()
  console.log(`\n${packages.length} packages done in ${end - start}ms`)
  process.exit(0)
})().catch(err => {
  console.log(err)
  process.exit(1)
})
