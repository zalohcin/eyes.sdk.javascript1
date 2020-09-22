const chunkify = require('./chunkify')

const STATUSES = {
  WIP: 'WIP',
  SUCCESS: 'SUCCESS',
  SUCCESS_CHUNKED: 'SUCCESS_CHUNKED',
  ERROR: 'ERROR',
}
const DEFAULT_CHUNK_BYTE_LENGTH = 268435456 // 256MB

function createPollResponse(state, {chunkByteLength = DEFAULT_CHUNK_BYTE_LENGTH} = {}) {
  if (!state) {
    return {
      status: STATUSES.ERROR,
      error: 'unexpected poll request received - cannot find state of current operation',
    }
  } else if (state.value) {
    if (chunkByteLength) {
      if (!state.chunks) {
        state.chunks = chunkify(JSON.stringify(state.value), chunkByteLength)
        state.splitted = state.chunks.length > 1
      }
      if (state.splitted) {
        return {
          status: STATUSES.SUCCESS_CHUNKED,
          value: state.chunks.shift(),
          done: state.chunks.length === 0,
        }
      }
    }
    return {status: STATUSES.SUCCESS, value: state.value}
  } else if (state.error) {
    return {status: STATUSES.ERROR, error: state.error}
  } else {
    return {status: STATUSES.WIP}
  }
}

function poll(context, key, options = {}) {
  context = context || {}
  const result = createPollResponse(context[key], options)

  if (
    result.status === STATUSES.SUCCESS ||
    result.status === STATUSES.ERROR ||
    (result.status === STATUSES.SUCCESS_CHUNKED && result.done)
  ) {
    context[key] = null
  }

  return result
}

module.exports = poll
