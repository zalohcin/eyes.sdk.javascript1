const {makePackagesList} = require('./packages')
const {linkPackage} = require('./link-util')

const packages = makePackagesList()

;(async function main() {
  const pkg = packages.find(p => p.name.includes(process.argv[2]))
  console.log(`Linking local dependencies for package ${pkg.name}`)
  const start = new Date()
  await linkPackage(pkg)
  const end = new Date()
  console.log(`\nDone in ${end - start}ms`)
  process.exit(0)
})().catch(err => {
  console.log(err)
  process.exit(1)
})
