require('eventmachine')
require_relative('applitools/socket')
require_relative('applitools/spec-driver')
require_relative('applitools/refer')

# TODO:
# - run e2e tests in a batch
# - spawn server in unref'd child process
# - bundling
# - test concurrency
# - coverage tests
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
        config[:agentId] = 'eyes-universal/rb'
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

      def close(throw_exception = false)
        result = await(->(cb) {
          @socket.request('Eyes.close', {eyes: @eyes}, nil, cb)
          @refer.destroy(@driverRef)
        })
        if (throw_exception and result[:status] != "Passed")
          raise JSON.pretty_generate(result)
        else
          puts JSON.pretty_generate(result)
        end
      end

      def abort
        await(->(cb) {
          @socket.request('Eyes.abort', {eyes: @eyes}, nil, cb)
          @refer.destroy(@driverRef)
        })
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
                result = ::Applitools::SpecDriver.executeScript(@refer.deref(params[:context]), params[:script], @refer.deref_all(params[:args]))
                qualifier = ->(input) {::Applitools::SpecDriver.isElement(input)}
                @refer.ref_all(result, qualifier)
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
