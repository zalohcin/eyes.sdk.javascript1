const path = require('path')

function configLoader({config: configPath}) {
  const config = require(path.join(path.resolve('.'), configPath))
  return {
    ...config,
    outDir: config.outPath || config.output,
    metaDir: config.metaPath,
    resultDir: config.resultPath,
  }
}

exports.configLoader = configLoader
