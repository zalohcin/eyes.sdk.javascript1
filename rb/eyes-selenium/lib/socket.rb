require 'faye/websocket'
require 'json'

module Applitools
  class Socket
    def initialize
      @listeners = {}
    end

    def connect(uri, ws)
      @socket = ws ? ws : ::Faye::WebSocket::Client.new(uri)
    end

    def emit(message, payload)
      @socket.send(serialize(message, payload))
    end

    def command(name, fn)
      on(name, ->(payload, key) {
        begin
          puts "[COMMAND] #{name}, #{key}, #{JSON.generate(payload, {indent: 2})}"
          result = fn(payload).call
          emit({name: name, key: key}, result)
        rescue => error
          emit({name: name, key: key}, error.message)
        end
      })
    end

    private

      def serialize(type, payload)
        message = type.is_a?(String) ? 
          {:name => type, :payload => payload} : {:name => type[:name], key: type[:key], :payload => payload}
        JSON.generate(message)
      end

      def on(type, fn)
        name = type.is_a?(String) ? type : "#{type[:name]}/#{type[:key]}"
        fns = listeners[name]
        if (!fns)
          fns = []
          listeners[:name] = fns
        end
        fns.push(fn)
        # NOTE:
        # There's no return here like in the JS POC. The closest thing to 
        # returning a function would be something like this: `->() { off(name, fn)`.
        # It would need to receive `.call` to run though. It's unclear to me how 
        # this return function is used, so I've omitted it for now.
      end

  end
end
