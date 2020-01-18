const {makePackagesList} = require('./packages')
const {unlinkPackage} = require('./link-util')

const packages = makePackagesList()

;(async function main() {
  const pkg = packages.find(p => p.name.includes(process.argv[2]))
  console.log(`Unlinking local dependencies for package ${pkg.name}\n`)
  const start = new Date()
  await unlinkPackage(pkg)
  const end = new Date()
  console.log(`\nDone in ${end - start}ms`)
  process.exit(0)
})().catch(err => {
  console.log(err)
  process.exit(1)
})
