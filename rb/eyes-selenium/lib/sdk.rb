require('eventmachine')
require_relative('socket')
require_relative('spec-driver')
require_relative('refer')
@refer = Refer.new

# TODO:
# - implement openEyes w/ check, close, abort
# - implement takeScreenshot
# - e2e test (classic and VG)
# - spawn server in unref'd child process
# - look into `unref` equivalent for socket library (if necessary)
# - establish minimal Eyes API in gem namespace
# - add colorized logging to be consistent w/ JS POC
# - test concurrency
EM.run do
  socket = ::Applitools::Socket.new
  socket.connect('ws://localhost:2107/eyes')
  socket.emit('Session.init', {:commands => SpecDriver.commands})
  socket.command('Driver.isEqualElements', ->(params) {
    SpecDriver.isEqualElements(params[:context], @refer.deref(params[:element1]), @refer.deref(params[:element2]))
  })
  socket.command('Driver.executeScript', ->(params) {
    args = params[:args].map {|arg| @refer.isRef(arg) ? @refer.deref(arg) : arg}
    result = SpecDriver.executeScript(params[:context], params[:script], *args)
    # TODO: ref elements in return
    # e.g., from JS POC
    #async function serialize(result) {
    #  const [_, type] = result.toString().split('@')
    #  if (type === 'array') {
    #    const map = await result.getProperties()
    #    return Promise.all(Array.from(map.values(), serialize))
    #  } else if (type === 'object') {
    #    const map = await result.getProperties()
    #    const chunks = await Promise.all(
    #      Array.from(map, async ([key, handle]) => ({[key]: await serialize(handle)})),
    #    )
    #    return Object.assign(...chunks)
    #  } else if (type === 'node') {
    #    return ref(result.asElement(), frame)
    #  } else {
    #    return result.jsonValue()
    #  }
    #}
    result
  })
  socket.command('Driver.mainContext', ->(params) {
    SpecDriver.mainContext(params[:driver])
  })
  socket.command('Driver.parentContext', ->(params) {
    SpecDriver.parentContext(params[:driver])
  })
  socket.command('Driver.childContext', ->(params) {
    SpecDriver.mainContext(params[:driver], @refer.deref(params[:element]))
  })
  socket.command('Driver.findElement', ->(params) {
    result = SpecDriver.findElement(params[:driver], params[:selector])
    @refer.ref(result)
  })
  socket.command('Driver.findElements', ->(params) {
    result = SpecDriver.findElements(params[:driver], params[:selector])
    result.each {|element| @refer.ref(element)}
  })
  socket.command('Driver.getViewportSize', ->(params) {
    SpecDriver.getViewportSize(params[:driver])
  })
  socket.command('Driver.setViewportSize', ->(params) {
    SpecDriver.setViewportSize(params[:driver], params[:size])
  })
  socket.command('Driver.getTitle', ->(params) {
    SpecDriver.getTitle(params[:driver])
  })
  socket.command('Driver.getUrl', ->(params) {
    SpecDriver.getUrl(params[:driver])
  })
  socket.command('Driver.getDriverInfo', ->(params) {
    SpecDriver.getDriverInfo(params[:driver])
  })
  #socket.command('Driver.takeScreenshot', ->(params) {
  #  SpecDriver.takeScreenshot(params[:driver])
  #})
end
