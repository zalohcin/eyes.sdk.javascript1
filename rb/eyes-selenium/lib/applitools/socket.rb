require('faye/websocket')
require('json')
require('securerandom')
require('colorize')

module Applitools
  class Socket
    attr_reader :listeners, :queue

    def initialize
      @listeners = {}
      @queue = []
    end

    def connect(uri, ws = ::Faye::WebSocket::Client.new(uri))
      @socket = ws

      queue.each {|command| command.call}
      queue.clear

      ws.on :message do |event|
        message = JSON.parse(event.data, {:symbolize_names => true})
        params = [message[:payload], message[:key]]
        find_and_execute_listeners(message[:name], message[:key], params)
      end

      ws.on :close do |event|
        find_and_execute_listeners('close')
      end
    end

    def emit(message, payload)
      command = ->() {@socket.send(serialize(message, payload))}
      @socket ? command.call : queue.push(command)
    end

    def command(name, fn)
      on(name, ->(payload, key) {
        begin
          puts "[#{'COMMAND'.yellow}] #{name}, #{key}, #{JSON.pretty_generate(payload)}"
          result = fn.call(payload)
          #puts "[#{'COMMAND RESULT'.green}] #{name}, #{key}, #{JSON.pretty_generate(result)}"
          emit({name: name, key: key}, {result: result})
        rescue => error
          puts "[#{'COMMAND ERROR'.red}] #{error}"
          emit({name: name, key: key}, error.message || error)
        end
      })
    end

    def request(name, payload, key = SecureRandom.uuid, cb = nil)
      puts "[#{'REQUEST'.blue}] #{name}, #{key}, #{JSON.pretty_generate(payload)}"
      emit({name: name, key: key}, payload)
      once({name: name, key: key}, Proc.new {|result|
        #puts "[#{'REQUEST RESULT'.green}] name: #{name}, result: #{result}" if result
        cb.call(result[:result]) if cb
      })
    end

    private

      def find_and_execute_listeners(name, key = nil, params = [])
        name_with_key = "#{name}/#{key}"
        fns = listeners[name.to_sym]
        fns = listeners[name_with_key.to_sym] if (!fns) 
        return if (!fns)
        fns.each {|fn| fn.call(*params)}
      end

      def serialize(type, payload)
        message = type.is_a?(String) ? 
          {:name => type, :payload => payload} : {:name => type[:name], key: type[:key], :payload => payload}
        JSON.generate(message)
      end

      def on(type, fn)
        name = type.is_a?(String) ? type : "#{type[:name]}/#{type[:key]}"
        fns = listeners[name.to_sym]
        if (!fns)
          fns = []
          listeners[name.to_sym] = fns
        end
        fns.push(fn)
      end

      def off(name)
        listeners.delete(name.to_sym)
      end

      def once(type, fn)
        name = type.is_a?(String) ? type : "#{type[:name]}/#{type[:key]}"
        on(type, ->(*args) {
          fn.call(*args)
          off(name)
        })
      end
  end
end