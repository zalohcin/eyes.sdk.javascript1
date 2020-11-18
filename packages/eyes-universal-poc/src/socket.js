const WebSocket = require('ws')
const uuid = require('uuid')

function makeSocket(ws) {
  let socket = null
  const listeners = new Map()
  const queue = new Set()

  attach(ws)

  function connect(url) {
    const ws = new WebSocket(url)
    attach(ws)
  }

  function attach(ws) {
    if (!ws) return

    if (ws.readyState === WebSocket.CONNECTING) ws.on('open', () => attach(ws))
    else if (ws.readyState === WebSocket.OPEN) {
      socket = ws
      queue.forEach(command => command())
      queue.clear()

      socket.on('message', message => {
        const {name, requestId, payload} = deserialize(message)
        const fns = listeners.get(name)
        if (fns) fns.forEach(fn => fn(payload, requestId))
      })
      socket.on('close', () => {
        const fns = listeners.get('close')
        if (fns) fns.forEach(fn => fn())
      })
    }
  }

  function disconnect() {
    if (!socket) return
    socket.terminate()
    socket = null
  }

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

  function once(type, fn) {
    const off = on(type, (...args) => (fn(...args), off()))
    return off
  }

  function off(name, fn) {
    if (!fn) return listeners.delete(name)
    const fns = listeners.get(name)
    if (!fns) return false
    const existed = fns.delete(fn)
    if (!fns.size) listeners.delete(name)
    return existed
  }

  function emit(type, payload) {
    const command = () => socket.send(serialize(type, payload))
    if (socket) command()
    else queue.add(command)
    return () => queue.delete(command)
  }

  function ref() {
    const command = () => socket._socket.ref()
    if (socket) command()
    else queue.add(command)
    return () => queue.delete(command)
  }

  function unref() {
    const command = () => socket._socket.unref()
    if (socket) command()
    else queue.add(command)
    return () => queue.delete(command)
  }

  return {
    on,
    once,
    off,
    emit,
    request,
    command,
    connect,
    disconnect,
    ref,
    unref,
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
