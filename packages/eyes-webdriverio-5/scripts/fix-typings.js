const fs = require('fs')
const dts = fs.readFileSync('./typings/index.d.ts', 'utf-8')
const fixedDts = dts.replace('export type Eyes<TRunner>', 'export type Eyes<TRunner = any>')
fs.writeFileSync('./typings/index.d.ts', fixedDts)
