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
      'page-index' // (Optional)
    ]
    let params = {}
    let pathname = 'records'

    if (typeof keyOrParams === 'string') { // /records/{key}
      pathname += '/' + keyOrParams
      if (options.entries) { // /records/{key}/entries
        pathname += '/entries'
      }
    } else if (typeof keyOrParams === 'object') { // /records, // /records/{field-name}/{field-value}
      const formattedObject = kebabCaseObjectKeys(keyOrParams)
      if (
        typeof formattedObject['field-name'] !== 'undefined' &&
        typeof formattedObject['field-value'] !== 'undefined'
      ) {
        pathname += `/${formattedObject['field-name']}/${formattedObject['field-value']}`
      } else {
        params = keyOrParams
      }
    }

    return request(
      this._getEndpoint(pathname, params, allowedParams)
    )
  }
  entries (entryNumberOrParams) {
    const allowedParams = [
      'start', // (Optional): Collection page number. Defaults to 1.
      'limit' // (Optional): Collection page size. Defaults to 100. Maximum is 5000.
    ]
    let params = {}
    let pathname = 'entries'

    if (typeof entryNumberOrParams !== 'undefined') {
      if (isNaN(entryNumberOrParams)) { // /entries
        params = entryNumberOrParams
      } else { // /entries/{entry-number}
        pathname += '/' + entryNumberOrParams
      }
    }

    return request(
      this._getEndpoint(pathname, params, allowedParams)
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
