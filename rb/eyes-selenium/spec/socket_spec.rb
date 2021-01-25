require_relative '../lib/socket'
require 'json'

describe 'socket' do
  before(:each) do
    @ws = double()
    @socket = ::Applitools::Socket.new
    @socket.connect('http://blah', @ws)
  end

  it 'emits message with correct payload' do
    name = 'Session.init'
    payload = {:commands => ['a', 'b', 'c']}
    expect(@ws).to receive(:send).with(JSON.generate({name: name, payload: payload}))
    @socket.emit(name, payload)
  end

  it 'stores wrapped command emitters' do
    name = 'Driver.someCommand'
    payload = ->(params) {
      'blah'
    }
    @socket.command(name, payload)
    expect(@socket.listeners.length).to eq(1)
    expect(@socket.listeners.first.first[:name]).to eq(name)
    expect(@socket.listeners.first[1].first).to_not eq(payload) # fn that wraps execution and emits the result
  end

  it 'an executed wrapped command emits the correct payload' do
    name = 'Driver.someCommand'
    payload = ->(params) {
      params[:blah]
    }
    @socket.command(name, payload)
    expect(@ws).to receive(:send).with(JSON.generate({name: name, key: 'key', payload: 'blah'}))
    listener = @socket.listeners.first[1].first
    listener.call({blah: 'blah'}, 'key')
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
