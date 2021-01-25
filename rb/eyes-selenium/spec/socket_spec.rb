require_relative '../lib/socket'
require 'json'

describe 'socket' do
  before(:each) do
    @ws = double().as_null_object
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
    expect(@socket.listeners.first.first[name]).to eq(name)
    expect(@socket.listeners.first[1].first).to_not eq(payload) # e.g., fn that wraps execution and emits the result
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

  it 'registers lifecycle listeners on connection' do
    ws = double().as_null_object
    expect(ws).to receive(:on).with(:message).with(:close)
    socket = ::Applitools::Socket.new
    socket.connect('http://blah', ws)
  end

  it 'lifecycle listeners can find and execute listeners by name' do
    name = 'Driver.someCommand'
    @socket.command(name, ->(params) {
      'blah'
    })
    expect(@ws).to receive(:send).with(JSON.generate({name: name, key: 'key', payload: 'blah'}))
    @socket.send(:find_and_execute_listeners_by_name, name, [{payload: 'blah'}, 'key'])
  end

  it 'queues commands when no socket present' do
    skip
  end

  it 'processes queue on connection' do
    skip
  end
end
