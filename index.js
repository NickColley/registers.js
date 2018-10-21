const fetch = require('node-fetch')

const {
  kebabCaseObjectKeys,
  objectToQueryString,
  validateParams
} = require('./src/utilities.js')

function request (url, type = 'json') {
  const acceptHeader = (type === 'json') ? 'json' : 'octet-stream'
  return fetch(url, {
    headers: {
      'Accept': `application/${acceptHeader}`
    }
  }).then(body => {
    if (type === 'blob') {
      return body.buffer()
    }
    return body.json()
  }).catch(error => {
    throw error
  })
}

class Registers {
  constructor (name) {
    this.name = name
  }
  _getEndpoint (pathname, params = {}, allowedParams = []) {
    const formattedParams = kebabCaseObjectKeys(params)
    const mergedParams = validateParams(formattedParams, allowedParams)
    const paramString = objectToQueryString(mergedParams)
    return `https://${this.name}.register.gov.uk/${pathname}${paramString}`
  }
  register () {
    return request(
      this._getEndpoint('register')
    )
  }
  records (keyOrParams, options = {}) {
    const allowedParams = [
      'page-size', // (Optional) Maximum 5000
      'page-index', // (Optional)
      'field-name', // (Optional)
      'field-value' // (Required if field-name set)
    ]
    let params = {}
    let pathname = 'records'

    if (typeof keyOrParams === 'string') { // /records/{key}
      pathname += '/' + keyOrParams
      if (options.entries) { // /records/{key}/entries
        pathname += '/entries'
      }
    } else { // /records, // /records/{field-name}/{field-value}
      params = keyOrParams
    }

    return request(
      this._getEndpoint(pathname, params, allowedParams)
    )
  }
  entries () {
    return request(
      this._getEndpoint('entries')
    )
  }
  items () {
    return request(
      this._getEndpoint('items')
    )
  }
  downloadRegister () {
    return request(
      this._getEndpoint('download-register'),
      'blob'
    )
  }
}

module.exports = Registers
