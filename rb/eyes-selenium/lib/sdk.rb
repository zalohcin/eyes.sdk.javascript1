require 'faye/websocket'
require 'eventmachine'
require 'json'
require_relative 'spec-driver'

def serialize(type, payload)
  message = {:name => type, :payload => payload}
  JSON.generate(message)
end

EM.run {
  socket = Faye::WebSocket::Client.new('socket://localhost:2107/eyes')

  socket.on :open do |event|
    p [:open]
    socket.send(serialize('Session.init', {:commands => SpecDriver.instance_methods.map {|method_name| method_name.to_s}}))
  end

  #socket.on :message do |event|
  #  p [:message, event.data]
  #end

  #socket.on :close do |event|
  #  p [:close, event.code, event.reason]
  #  socket = nil
  #end
}
