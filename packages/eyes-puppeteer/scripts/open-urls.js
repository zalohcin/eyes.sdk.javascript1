const fs = require('fs')
const path = require('path')
const urls = fs.readFileSync(path.join(__dirname, 'urls'), {encoding: 'utf-8'}).split('\n')
const {execSync} = require('child_process')

urls.forEach(url => {
  execSync(`open ${url}`)
})
