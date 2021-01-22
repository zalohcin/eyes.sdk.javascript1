require 'eventmachine'
require_relative 'socket'
require_relative 'spec-driver'

EM.run do
  socket = Applitools::Socket.new
  socket.connect('ws://localhost:2107/eyes')
  socket.emit('Session.init', {:commands => SpecDriver.commands})
end
