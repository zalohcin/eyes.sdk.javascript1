function generateBaselineName({name, baselineName, config = {}} = {}) {
  const chunks = [baselineName || name]
  if (config.check) {
    chunks.push(config.check === 'classic' ? 'Classic' : 'Fluent')
  }
  if (config.vg) {
    chunks.push('VG')
  } else if (config.stitchMode) {
    chunks.push(config.stitchMode)
  }
  return chunks.join('_')
}

function generateFileName({name, env = {}, config = {}} = {}) {
  const chunks = [name]
  if (config.check) {
    chunks.push(config.check === 'classic' ? 'Classic' : 'Fluent')
  }
  if (config.vg) {
    chunks.push('VG')
  } else if (config.stitchMode) {
    chunks.push(config.stitchMode)
  }
  if (env.browser) {
    chunks.push(env.browser)
  }
  return chunks.join('_')
}

exports.generateBaselineName = generateBaselineName
exports.generateFileName = generateFileName
