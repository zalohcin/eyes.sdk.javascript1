require 'faye/websocket'
require 'json'

module Applitools
  class Socket
    attr_reader :listeners, :queue

    def initialize
      @listeners = {}
      @queue = []
    end

    def connect(uri, ws)
      @socket = ws ? ws : ::Faye::WebSocket::Client.new(uri)

      queue.each {|command| command.call}
      queue.clear

      ws.on :message do |event|
        message = JSON.parse(event.data).values
        params = [message[:payload], message[:key]]
        find_and_execute_listeners_by_name(message[:name], params)
        find_and_execute_listeners_by_name("#{name}/#{key}", params) if (key)
      end

      ws.on :close do |event|
        find_and_execute_listeners_by_name('close')
      end
    end

    def emit(message, payload)
      command = ->() {@socket.send(serialize(message, payload))}
      @socket ? command.call : queue.push(command)
    end

    def command(name, fn)
      on(name, ->(payload, key) {
        begin
          puts "[COMMAND] #{name}, #{key}, #{JSON.generate(payload)}"
          result = fn.call(payload)
          emit({name: name, key: key}, result)
        rescue => error
          emit({name: name, key: key}, error.message)
        end
      })
    end

    private

      def find_and_execute_listeners_by_name(name, params = [])
        fns = listeners[name.to_sym]
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

  end
end
