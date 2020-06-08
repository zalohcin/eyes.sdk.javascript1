module.exports =
  process.env.SELENIUM_MAJOR_VERSION === '3'
    ? require('./selenium3/SpecWrappedElement')
    : require('./selenium4/SpecWrappedElement')
