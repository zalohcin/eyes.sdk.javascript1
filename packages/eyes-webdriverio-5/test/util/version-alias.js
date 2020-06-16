const alias = require('module-alias')

if (!process.env.APPLITOOLS_WDIO_MAJOR_VERSION) {
  process.env.APPLITOOLS_WDIO_MAJOR_VERSION = '6'
}

alias.addAlias(
  'selenium-webdriver',
  `selenium-webdriver-${process.env.APPLITOOLS_WDIO_MAJOR_VERSION}`,
)
