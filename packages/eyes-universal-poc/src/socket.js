const WebSocket = require('ws')
const uuid = require('uuid')
const chalk = require('chalk')

function makeSocket(ws) {
  const listeners = new Map()
  const state = {}
  const ready = new Promise((resolve, reject) => {
    state.resolve = resolve
    state.reject = reject
  })

  function init(ws) {
    if (!ws) return
    if (ws.readyState === WebSocket.CONNECTING) {
      ws.on('open', state.resolve)
      ws.on('error', state.reject)
    } else if (ws.readyState === WebSocket.OPEN) {
      state.resolve()
    } else {
      state.reject()
    }
    ws.on('message', message => {
      const {name, requestId, payload} = deserialize(message)
      const fns = listeners.get(name)
      fns.forEach(fn => fn(payload, requestId))
    })
  }

  function open(address) {
    ws = new WebSocket(address)
    init(ws)
  }

  function close() {
    ws.terminate()
  }

  /**
   * @param {string|{name: string, requestId: string}} type - event type
   * @param {(payload, requestId?: string) => void} fn - event callback
   * @return {() => void} event off function
   */
  function on(type, fn) {
    type = typeof type === 'string' ? {name: type} : {name: type.name, requestId: type.requestId}
    let fns = listeners.get(type.name)
    if (!fns) {
      fns = new Set()
      listeners.set(type.name, fns)
    }
    const handler = type.requestId
      ? (payload, requestId) => requestId === type.requestId && fn(payload, requestId)
      : fn
    fns.add(handler)
    return () => off(type.name, handler)
  }

  /**
   * @param {string|{name: string, requestId: string}} type - event type
   * @param {(payload, requestId?: string) => void} fn - event callback
   * @return {() => void} event off function
   */
  function once(type, fn) {
    const off = on(type, (...args) => (fn(...args), off()))
    return off
  }

  /**
   * @param {string|{name: string, requestId: string}} type - event type
   * @param {(payload, requestId?: string) => void} fn - event callback
   * @return {boolean} true if an event existed and has been removed, or false if the event does not exist.
   */
  function off(name, fn) {
    if (!fn) return listeners.delete(name)
    const fns = listeners.get(name)
    if (!fns) return false
    const existed = fns.delete(fn)
    if (!fns.size) listeners.delete(name)
    return existed
  }

  /**
   * @param {string|{name: string, requestId: string}} type - event type
   * @param {any} payload - event payload
   */
  function emit(type, payload) {
    const message = serialize(type, payload)
    ready.then(() => ws.send(message))
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
      console.log(chalk.blue('[CLIENT REQUEST]'), name, payload)
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

  return {
    open,
    close,
    on,
    once,
    off,
    emit,
    request,
    command,
  }
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

module.exports = makeSocket
