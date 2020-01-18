const fs = require('fs')
const path = require('path')
const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)

const dir = path.join(__dirname, '..', 'packages')
const packages = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory())

;(async function main() {
  console.log('Setting up packages in the mono\n')
  const start = new Date()
  await Promise.all(
    packages.map(async pkg => {
      await pexec(`cd ${pkg}; npm install`).catch(async () => {
        await pexec(`cd ${pkg}; npm install`).catch(error => {
          console.log(error)
        })
      })
      console.log(`[✓] ${pkg}`)
    }),
  )
  const end = new Date()
  console.log(`\n${packages.length} packages done in ${end - start}ms`)
  process.exit(0)
})().catch(err => {
  console.log(err)
  process.exit(1)
})
