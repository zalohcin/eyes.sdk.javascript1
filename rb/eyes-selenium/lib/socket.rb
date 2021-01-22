require 'faye/websocket'
require 'json'

module Applitools
  class Socket
    def connect(uri)
      @socket = ::Faye::WebSocket::Client.new(uri)
    end

    def emit(message, payload)
      @socket.send(serialize(message, payload))
    end

    private

      def serialize(type, payload)
        message = {:name => type, :payload => payload}
        JSON.generate(message)
      end
  end
end
