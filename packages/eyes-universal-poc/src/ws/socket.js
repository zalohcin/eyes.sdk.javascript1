const uuid = require('uuid')

function socket(ws) {
  const listeners = new Map()

  ws.on('message', message => {
    const {name, requestId, payload} = deserialize(message)
    const fns = listeners(toKey({name, requestId}))
    fns.forEach(fn => fn(payload, requestId))
  })

  return {
    on,
    once,
    off,
    emit,
    request,
    command,
  }

  /**
   * @param {string|{name: string, requestId: string}} type - event type
   * @param {(payload, requestId?: string) => void} fn - event callback
   * @return {() => void} event off function
   */
  function on(type, fn) {
    const key = toKey(type)
    let fns = listeners.get(key)
    if (!fns) {
      fns = new Set()
      listeners.set(key, fns)
    }
    fns.add(fn)
    return () => off(type, fn)
  }

  /**
   * @param {string|{name: string, requestId: string}} type - event type
   * @param {(payload, requestId?: string) => void} fn - event callback
   * @return {() => void} event off function
   */
  function once(type, fn) {
    const off = on(type, () => (fn(), off()))
    return off
  }

  /**
   * @param {string|{name: string, requestId: string}} type - event type
   * @param {(payload, requestId?: string) => void} fn - event callback
   * @return {boolean} true if an event existed and has been removed, or false if the event does not exist.
   */
  function off(type, fn) {
    const key = toKey(type)
    if (!fn) return listeners.delete(key)
    const fns = listeners.get(key)
    if (!fns) return false
    const existed = fns.delete(fn)
    if (!fns.size) listeners.delete(key)
    return existed
  }

  /**
   * @param {string|{name: string, requestId: string}} type - event type
   * @param {any} payload - event payload
   */
  function emit(type, payload) {
    const message = serialize(type, payload)
    ws.send(message)
  }

  /**
   * Send request with given name and waits for response
   * @param {string} name - request name
   * @param {any} payload - request payload
   * @return {Promise<any>} request response
   */
  function request(name, payload) {
    return new Promise((resolve, reject) => {
      const requestId = uuid.v4()
      emit({name, requestId}, payload)
      once({name, requestId}, response => {
        if (response.error) return reject(response.error)
        return resolve(response.result)
      })
    })
  }

  /**
   * Register command with given name to process requests and send responses
   * @param {string} name - command name
   * @param {(payload) => any} fn - command body
   */
  function command(name, fn) {
    on(name, async (payload, requestId) => {
      try {
        const result = await fn(payload)
        emit({name, requestId}, {result})
      } catch (error) {
        emit({name, requestId}, {error})
      }
    })
  }
}

function toKey(type) {
  if (typeof type === 'string') return type
  if (type.requestId) return `${type.name}/${type.requestId}`
  return type.name
}

function serialize(type, payload) {
  const message =
    typeof type === 'string'
      ? {name: type, payload}
      : {name: type.name, requestId: type.requestId, payload}
  return JSON.stringify(message)
}

function deserialize(message) {
  return JSON.parse(message)
}

module.export = socket
