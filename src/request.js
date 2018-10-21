const fetch = require('node-fetch')

const getBuffer = require('./get-buffer-response.js')

function request (url, type = 'json') {
  const acceptHeader = (type === 'json') ? 'json' : 'octet-stream'
  return fetch(url, {
    headers: {
      'Accept': `application/${acceptHeader}`
    }
  }).then(body => {
    if (type === 'blob') {
      return getBuffer(body)
    }
    return body.json()
  }).catch(error => {
    throw error
  })
}

module.exports = request
