require_relative '../lib/socket'
require 'json'

describe 'socket' do
  it 'emits message with correct payload' do
    ws = double()
    socket = ::Applitools::Socket.new
    socket.connect('http://blah', ws)
    name = 'Session.init'
    payload = {:commands => ['a', 'b', 'c']}
    expect(ws).to receive(:send).with(JSON.generate({name: name, payload: payload}))
    socket.emit(name, payload)
  end

  it 'stores command emitters' do
    skip
  end

  it 'queues commands when no socket present' do
    skip
  end

  it 'processes queue on connection' do
    skip
  end

  it 'registers lifecycle listeners on connection' do
    skip
  end
end
