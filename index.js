const fetch = require('node-fetch')
const {
  kebabCaseObjectKeys,
  objectToQueryString,
  mergeDefaultObject
} = require('./src/utilities.js')

function requestJson (url) {
  return fetch(url, {
    headers: {
      'Accept': 'application/json'
    }
  }).then(body => {
    return body.json()
  }).catch(error => {
    throw error
  })
}

class Registers {
  constructor (name) {
    this.name = name
  }
  _getEndpoint (pathname, params = {}, defaultParams = {}) {
    const formattedParams = kebabCaseObjectKeys(params)
    const mergedParams = mergeDefaultObject(formattedParams, defaultParams)
    const paramString = objectToQueryString(mergedParams)
    return `https://${this.name}.register.gov.uk/${pathname}${paramString}`
  }
  register () {
    return requestJson(
      this._getEndpoint('register')
    )
  }
  records (params = {}) {
    const defaultParams = {
      'page-size': 100, // Maximum 5000
      'page-index': 1
    }
    return requestJson(
      this._getEndpoint('records', params, defaultParams)
    )
  }
  entries () {
    return requestJson(
      this._getEndpoint('entries')
    )
  }
  items () {
    return requestJson(
      this._getEndpoint('items')
    )
  }
  downloadRegister () {
    return requestJson(
      this._getEndpoint('download-register')
    )
  }
}

module.exports = Registers
