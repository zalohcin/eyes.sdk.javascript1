require 'eventmachine'
require_relative 'socket'
require_relative 'spec-driver'

# TODO:
# - implement remaining functions in socket wrapper
# - add ref/unref to commands
# - implement openEyes w/ check, close, abort
# - implement takeScreenshot
# - establish minimal Eyes API in gem namespace
# - e2e test (classic and VG)
# - spawn server in unref'd child process
# - look into `unref` equivalent for socket library (if necessary)
# - add queueing to socket wrapper
# - add colorized logging to be consistent w/ JS POC
# - test concurrency
EM.run do
  socket = Applitools::Socket.new
  socket.connect('ws://localhost:2107/eyes')
  socket.emit('Session.init', {:commands => SpecDriver.commands})
  socket.command('Driver.isEqualElements', ->(params) {
    SpecDriver.isEqualElements(params[:context], params[:element1], params[:element2])
  })
  socket.command('Driver.executeScript', ->(params) {
    SpecDriver.executeScript(params[:context], params[:script], *params[:args])
  })
  socket.command('Driver.mainContext', ->(params) {
   SpecDriver.mainContext(params[:context])
  })
  socket.command('Driver.parentContext', ->(params) {
    SpecDriver.parentContext(params[:context])
  })
  socket.command('Driver.childContext', ->(params) {
    SpecDriver.mainContext(params[:context], params[:element])
  })
  socket.command('Driver.findElement', ->(params) {
    SpecDriver.findElement(params[:context], params[:selector])
  })
  socket.command('Driver.findElements', ->(params) {
    SpecDriver.findElements(params[:context], params[:selector])
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
