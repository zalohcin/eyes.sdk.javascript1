function createFramesPaths({snapshot, path = [], logger}) {
  const paths = snapshot.crossFramesXPaths
    ? snapshot.crossFramesXPaths.map(selector => ({
        path: path.concat(selector),
        parentSnapshot: snapshot,
      }))
    : []

  for (const frame of snapshot.frames) {
    if (frame.selector) {
      paths.push(...createFramesPaths({snapshot: frame, path: path.concat(frame.selector), logger}))
    }
  }

  logger.verbose(
    `frames paths for ${snapshot.crossFramesXPaths}`,
    paths.map(({path}) => path.join('-->')).join(' , '),
  )

  delete snapshot.selector
  delete snapshot.crossFramesXPaths

  return paths
}

module.exports = createFramesPaths
