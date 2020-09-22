const Handlebars = require('handlebars')
const {readFileSync} = require('fs')

const getFilePath = (url, staticPath) => {
  url = !url.includes('.hbs') ? `${url}.hbs` : url
  return `${staticPath}${url.replace('/handles', '')}`
}

module.exports = ({hbData, staticPath}) => (req, res, next) => {
  if (req.url.startsWith('/handles')) {
    const data = JSON.parse(hbData)
    const filePath = getFilePath(req.url, staticPath)
    const file = readFileSync(filePath).toString()
    const compiled = Handlebars.compile(file)({...data})
    res.send(compiled)
  } else {
    next()
  }
}
