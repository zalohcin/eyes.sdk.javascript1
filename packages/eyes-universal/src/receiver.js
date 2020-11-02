const WebSocket = require('ws')

const ws = new WebSocket('ws://localhost:8080')

ws.on('open', () => {
  console.log('OPEN')
  ws.send(
    JSON.stringify({
      name: 'Driver.findElement',
      payload: {
        selector: {type: 'css', selector: '.class'},
      },
    }),
  )
  ws.on('message', data => {
    console.log(data)
  })
})
