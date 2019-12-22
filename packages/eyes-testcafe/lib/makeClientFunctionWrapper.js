'use strict'

const {ClientFunction} = require('testcafe')
const {TypeUtils} = require('@applitools/eyes-common')
const EYES_NAME_SPACE = '__EYES__APPLITOOLS__'
const MAX_OBJECT_SIZE = 1024 * 1024 * 4.0 // 4 MB
const {isString} = TypeUtils

/*
 * Split the result to smaller chunks if it is too big.
 * See: https://github.com/DevExpress/testcafe/issues/1110
 */
function makeClientFunctionWrapper({
  clientFunctionExecuter = ClientFunction,
  maxObjectSize = MAX_OBJECT_SIZE,
  logger = {log: () => {}},
  window,
}) {
  return (browserFunction, dependencies = {}) => {
    const getResultMeta = clientFunctionExecuter(
      () => {
        const browserFunctionPromised = browserFunction.then
          ? browserFunction
          : () => Promise.resolve(browserFunction())
        return browserFunctionPromised().then((result = {}) => {
          const resultStr = isString(result) ? result : JSON.stringify(result)
          if (!window[EYES_NAME_SPACE]) {
            window[EYES_NAME_SPACE] = {}
          }
          window[EYES_NAME_SPACE].clientFunctionResult = resultStr
          return {size: resultStr.length, isString: isString(result)}
        })
      },
      {
        dependencies: Object.assign({EYES_NAME_SPACE, browserFunction, isString}, dependencies),
      },
    )

    const getResult = clientFunctionExecuter(
      (start, end) => window[EYES_NAME_SPACE].clientFunctionResult.substring(start, end),
      {dependencies: {EYES_NAME_SPACE}},
    )

    return async t => {
      const getResultMetaWithT = getResultMeta.with({boundTestRun: t})
      const getResultWithT = getResult.with({boundTestRun: t})
      const {size, isString} = await getResultMetaWithT()
      const splits = Math.ceil(size / maxObjectSize)
      logger.log(`starting to collect ClientFunction result of size ${size}`)
      let result = ''
      for (let i = 0; i < splits; i += 1) {
        const start = i * maxObjectSize
        logger.log(`getting ClientFunction result chunk ${i + 1} of ${splits}`)
        result += await getResultWithT(start, start + maxObjectSize)
      }
      return isString ? result : JSON.parse(result)
    }
  }
}

exports.makeClientFunctionWrapper = makeClientFunctionWrapper
