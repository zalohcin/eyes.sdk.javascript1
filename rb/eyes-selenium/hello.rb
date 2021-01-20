require 'faye/websocket'
require 'eventmachine'
require 'json'

def serialize(type, payload)
  message = {:name => type, :payload => payload}
  r = JSON.generate(message)
  puts r
  r
end

EM.run {
  ws = Faye::WebSocket::Client.new('ws://localhost:2107/eyes')

  puts ws.inspect

  ws.on :open do |event|
    p [:open]
    ws.send(serialize('Session.init', {:commands => ['open', 'check', 'close']}))
  end

  ws.on :message do |event|
    p [:message, event.data]
  end

  ws.on :close do |event|
    p [:close, event.code, event.reason]
    ws = nil
  end
}
