function makeChromeDriver() {
  switch (process.env.CHROME_MAJOR_VERSION) {
    case 'latest':
      return require('chromedriver83')
    case '-1':
      return require('chromedriver81')
    case '-2':
      return require('chromedriver80')
    default:
      return require('chromedriver83')
  }
}

module.exports = {
  makeChromeDriver,
}
