require('eventmachine')
require_relative('applitools/socket')
require_relative('applitools/spec-driver')
require_relative('applitools/refer')

# TODO:
# - ref elements in return of executeSript
# - implement takeScreenshot
# - e2e test (classic and VG)
# - spawn server in unref'd child process
# - look into `unref` equivalent for socket library (if necessary)
# - establish minimal Eyes API in gem namespace
# - add colorized logging to be consistent w/ JS POC
# - test concurrency
module Applitools
  module Selenium
    class Eyes
      def initialize
        @eyes = nil
        @driverRef = nil
        @refer = ::Applitools::Refer.new
        @socket = ::Applitools::Socket.new
        prepare_socket()
      end

      def open(driver, config)
        @driverRef = @refer.ref(driver)
        @eyes = @socket.request('Eyes.open', {driver: @driverRef, config: config})
      end

      def check(checkSettings)
        @socket.request('Eyes.check', {eyes: @eyes, checkSettings: checkSettings})
      end

      def close
        result = @socket.request('Eyes.close', {eyes: @eyes})
        @refer.destroy(@driverRef)
        result
      end

      def abort
        result = @socket.request('Eyes.abort', {eyes: @eyes})
        @refer.destroy(@driverRef)
        result
      end

      private 

        def prepare_socket
          Thread.new do
            EM.run do
              @socket.connect('ws://127.0.0.1:2107/eyes')
              @socket.emit('Session.init', {:commands => ::Applitools::SpecDriver.commands})
              @socket.command('Driver.isEqualElements', ->(params) {
                ::Applitools::SpecDriver.isEqualElements(params[:context], @refer.deref(params[:element1]), @refer.deref(params[:element2]))
              })
              @socket.command('Driver.executeScript', ->(params) {
                args = params[:args].map {|arg| @refer.isRef(arg) ? @refer.deref(arg) : arg}
                result = ::Applitools::SpecDriver.executeScript(params[:context], params[:script], *args)
                puts result
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
              @socket.command('Driver.mainContext', ->(params) {
                ::Applitools::SpecDriver.mainContext(params[:driver])
              })
              @socket.command('Driver.parentContext', ->(params) {
                ::Applitools::SpecDriver.parentContext(params[:driver])
              })
              @socket.command('Driver.childContext', ->(params) {
                ::Applitools::SpecDriver.mainContext(params[:driver], @refer.deref(params[:element]))
              })
              @socket.command('Driver.findElement', ->(params) {
                result = ::Applitools::SpecDriver.findElement(params[:driver], params[:selector])
                @refer.ref(result)
              })
              @socket.command('Driver.findElements', ->(params) {
                result = ::Applitools::SpecDriver.findElements(params[:driver], params[:selector])
                result.each {|element| @refer.ref(element)}
              })
              @socket.command('Driver.getViewportSize', ->(params) {
                ::Applitools::SpecDriver.getViewportSize(params[:driver])
              })
              @socket.command('Driver.setViewportSize', ->(params) {
                ::Applitools::SpecDriver.setViewportSize(params[:driver], params[:size])
              })
              @socket.command('Driver.getTitle', ->(params) {
                ::Applitools::SpecDriver.getTitle(params[:driver])
              })
              @socket.command('Driver.getUrl', ->(params) {
                ::Applitools::SpecDriver.getUrl(params[:driver])
              })
              @socket.command('Driver.getDriverInfo', ->(params) {
                #binding.pry
                ::Applitools::SpecDriver.getDriverInfo(@refer.deref(params[:driver]))
              })
              #@socket.command('Driver.takeScreenshot', ->(params) {
              #  ::Applitools::SpecDriver.takeScreenshot(params[:driver])
              #})
            end # prepare_socket EM
          end # prepare_socket Thread
        end # prepare_socket
    end # Eyes
  end # Selenium
end # Applitools
