const EyesSDK = require('./EyesSDK')
const ClassicRunner = require('../runner/ClassicRunner')
const VisualGridRunner = require('../runner/VisualGridRunner')
const closeBatch = require('../close/closeBatch')

function makeSDK({name, version, spec, VisualGridClient}) {
  const sdk = EyesSDK({name, version, spec, VisualGridClient})

  return {makeEyes, setViewportSize, closeBatch}

  function makeEyes({type = 'classic', concurrency, legacy} = {}) {
    const runner =
      type === 'vg'
        ? new VisualGridRunner(legacy ? concurrency : {testConcurrency: concurrency})
        : new ClassicRunner()

    return async function open(driver, config) {
      const eyes = new sdk.EyesFactory(runner)
      eyes.setConfiguration(config)
      await eyes.open(driver, config.appName, config.testName, config.viewportSize)

      return {check, close, abort}

      async function check(settings) {
        const result = await eyes.check(settings)
        return result.toJSON()
      }

      async function close() {
        const result = await eyes.close(false)
        return result.toJSON()
      }

      async function abort() {
        const result = await eyes.abort()
        return result.toJSON()
      }
    }
  }

  async function setViewportSize(driver, size) {
    await sdk.EyesFactory.setViewportSize(driver, size)
  }
}

module.exports = makeSDK
