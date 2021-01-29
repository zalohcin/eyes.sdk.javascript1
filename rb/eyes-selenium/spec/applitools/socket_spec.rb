require_relative('../../lib/applitools/socket')
require('json')

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
    listener = @socket.listeners.first[1].first
    expect(listener).to_not eq(payload) # e.g., fn that wraps execution and emits the result
  end

  it 'an executed wrapped command emits the correct payload' do
    name = 'Driver.someCommand'
    payload = ->(params) {
      params[:blah]
    }
    @socket.command(name, payload)
    expect(@ws).to receive(:send).with(JSON.generate({name: name, key: 'key', payload: {result: 'blah'}}))
    listener = @socket.listeners.first[1].first
    listener.call({blah: 'blah'}, 'key')
  end

  it 'an executed wrapped command emits the correct payload on error' do
    name = 'Driver.someCommand'
    payload = ->(params) {
      raise 'there was an error'
    }
    @socket.command(name, payload)
    expect(@ws).to receive(:send).with(JSON.generate({name: name, key: 'key', payload: 'there was an error'}))
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
    expect(@ws).to receive(:send).with(JSON.generate({name: name, key: 'key', payload: {result: 'blah'}}))
    @socket.send(:find_and_execute_listeners, name, 'key', [{payload: 'blah'}, 'key'])
  end

  it 'queues commands when no socket present' do
    socket = ::Applitools::Socket.new
    socket.emit('Session.init', {:commands => ['a', 'b', 'c']})
    expect(socket.queue.length).to eq(1)
  end

  it 'processes queue on connection' do
    ws = double().as_null_object
    socket = ::Applitools::Socket.new
    name = 'Session.init'
    payload = {:commands => ['a', 'b', 'c']}
    socket.emit(name, payload)
    expect(ws).to receive(:send).with(JSON.generate({name: name, payload: payload}))
    socket.connect('http://blah', ws)
    expect(socket.queue.length).to eq(0)
  end

  it 'can make a request to the server' do
    name = 'blah'
    key = '12345'
    payload = {blah: 'blah'}
    expect(@ws).to receive(:send).with(JSON.generate({name: name, key: key, payload: payload}))
    @socket.request(name, payload, key)
  end

  it 'requests clean up after receiving a response' do
    name = 'blah'
    key = '12345'
    payload = {blah: 'blah'}
    @socket.request(name, payload, key)
    listener = @socket.listeners.first[1].first
    listener.call
    expect(@socket.listeners).to be_empty
  end

  it 'requests support callbacks' do
    name = 'blah'
    key = '12345'
    payload = {blah: 'blah'}
    result = nil
    cb = ->(r) {result = r}
    @socket.request(name, payload, key, cb)
    listener = @socket.listeners.first[1].first
    listener.call({result: true})
    expect(result).to eq(true)
  end
end
