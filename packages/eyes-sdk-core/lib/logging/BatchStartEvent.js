'use strict'

const LogEvent = require('./LogEvent')

function BatchStartEvent({concurrency, testConcurrency}) {
  return LogEvent({
    level: 'Notice',
    type: 'batchStart',
    concurrency,
    testConcurrency,
    node: {version: process.version, platform: process.platform, arch: process.arch},
  })
}

module.exports = BatchStartEvent
