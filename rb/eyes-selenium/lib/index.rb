require('eventmachine')
require_relative('applitools/socket')
require_relative('applitools/spec-driver')
require_relative('applitools/refer')

# TODO:
# - finish ref'ing elements in return of executeSript & resolve JS errors
# - e2e test (VG)
# - spawn server in unref'd child process
# - test concurrency
module Applitools
  module Selenium
    class Eyes
      def initialize
        @eyes = nil
        @driverRef = nil
        @refer = ::Applitools::Refer.new
        @socket = ::Applitools::Socket.new
        @q = EM::Queue.new
        prepare_socket()
      end

      def open(driver, config)
        @eyes = await(->(cb) {
          @driverRef = @refer.ref(driver)
          @socket.request('Eyes.open', {driver: @driverRef, config: config}, nil, cb)
        })
      end

      def check(checkSettings)
        await(->(cb) {
          @socket.request('Eyes.check', {eyes: @eyes, checkSettings: checkSettings}, nil, cb)
        })
      end

      def close
        await(->(cb) {
          @socket.request('Eyes.close', {eyes: @eyes}, nil, cb)
          @refer.destroy(@driverRef)
        })
      end

      def abort
        #result = @socket.request('Eyes.abort', {eyes: @eyes})
        #@refer.destroy(@driverRef)
        #result
      end

      private 

        def await(function)
          resolved = false
          cb = ->(result) {
            resolved = result
          }
          @q.push(function)
          @q.pop {|fn| fn.call(cb)}
          sleep 1 until !!resolved
          resolved
        end

        def prepare_socket
          Thread.new do
            EM.run do
              @socket.connect('ws://127.0.0.1:2107/eyes')
              @socket.emit('Session.init', {:commands => ::Applitools::SpecDriver.commands})
              @socket.command('Driver.isEqualElements', ->(params) {
                ::Applitools::SpecDriver.isEqualElements(nil, @refer.deref(params[:element1]), @refer.deref(params[:element2]))
              })
              @socket.command('Driver.executeScript', ->(params) {
                args = params[:args].first.map {|arg| @refer.isRef(arg) ? @refer.deref(arg) : arg} if (params[:args].length > 0)
                #puts "[COMMAND] Driver.executeScript args: #{args.inspect}"
                result = ::Applitools::SpecDriver.executeScript(@refer.deref(params[:context]), params[:script], *args)
                result = result.map {|r| ::Applitools::SpecDriver.isElement(r) ? @refer.ref(r) : r} if (result.is_a? Array)
                #puts "[COMMAND] Driver.executeScript result: #{result ? result.inspect: 'NO RESULT'}"
                #puts ''
                result
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
              })
              @socket.command('Driver.mainContext', ->(params) {
                ::Applitools::SpecDriver.mainContext(@refer.deref(params[:context]))
              })
              @socket.command('Driver.parentContext', ->(params) {
                ::Applitools::SpecDriver.parentContext(@refer.deref(params[:context]))
              })
              @socket.command('Driver.childContext', ->(params) {
                ::Applitools::SpecDriver.mainContext(@refer.deref(params[:context]), @refer.deref(params[:element]))
              })
              @socket.command('Driver.findElement', ->(params) {
                result = ::Applitools::SpecDriver.findElement(@refer.deref(params[:context]), params[:selector])
                @refer.ref(result)
              })
              @socket.command('Driver.findElements', ->(params) {
                result = ::Applitools::SpecDriver.findElements(@refer.deref(params[:context]), params[:selector])
                result.each {|element| @refer.ref(element)}
              })
              @socket.command('Driver.getViewportSize', ->(params) {
                ::Applitools::SpecDriver.getViewportSize(@refer.deref(params[:driver]))
              })
              @socket.command('Driver.setViewportSize', ->(params) {
                ::Applitools::SpecDriver.setViewportSize(@refer.deref(params[:driver]), params[:size])
              })
              @socket.command('Driver.getTitle', ->(params) {
                ::Applitools::SpecDriver.getTitle(@refer.deref(params[:driver]))
              })
              @socket.command('Driver.getUrl', ->(params) {
                ::Applitools::SpecDriver.getUrl(@refer.deref(params[:driver]))
              })
              @socket.command('Driver.getDriverInfo', ->(params) {
                ::Applitools::SpecDriver.getDriverInfo(@refer.deref(params[:driver]))
              })
              @socket.command('Driver.takeScreenshot', ->(params) {
                ::Applitools::SpecDriver.takeScreenshot(@refer.deref(params[:driver]))
              })
            end  # prepare_socket EM.run
          end # prepare_socket Thread.new
        end # prepare_socket
    end # Eyes
  end # Selenium
end # Applitools
