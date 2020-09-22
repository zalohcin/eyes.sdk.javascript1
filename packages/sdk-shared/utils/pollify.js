const poll = require('./poll')

function pollify(script, context = {}, key = 'state') {
  return function(doc, options) {
    if (!context[key]) {
      context[key] = {}
      script(doc, options)
        .then(value => (context[key].value = value))
        .catch(err => (context[key].error = err.message))
    }
    return JSON.stringify(poll(context, key, options))
  }
}

module.exports = pollify
