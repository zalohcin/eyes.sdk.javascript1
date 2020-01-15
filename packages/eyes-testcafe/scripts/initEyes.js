const {
  Eyes,
  ConsoleLogHandler,
  StitchMode,
  Configuration,
  FileDebugScreenshotsProvider,
} = require('../index')

function initEyes({
  stitchMode = StitchMode.CSS,
  stitchOverlap = 56,
  waitBeforeScreenshots = 100,
  viewportSize,
  saveImages,
}) {
  const eyes = new Eyes()
  const configuration = new Configuration({
    stitchMode,
    stitchOverlap,
    waitBeforeScreenshots,
    viewportSize,
  })

  if (saveImages) {
    const debugHandler = new FileDebugScreenshotsProvider()
    debugHandler.setPath('./screenshots')
    eyes.setDebugScreenshotsProvider(debugHandler)
  }

  eyes.setConfiguration(configuration)

  if (process.env.APPLITOOLS_SHOW_LOGS || process.env.LIVE) {
    eyes.setLogHandler(new ConsoleLogHandler(true))
  }
  return eyes
}

module.exports = initEyes
