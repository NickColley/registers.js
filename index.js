const {
  kebabCaseObjectKeys,
  objectToQueryString,
  validateParams
} = require('./src/utilities.js')

const request = require('./src/request.js')

class Registers {
  constructor (name, { version } = {}) {
    this.name = name

    if (typeof version === 'undefined') {
      this.version = 'v1'
    } else if (typeof version === 'string') {
      this.version = version
    } else {
      throw new TypeError(version)
    }
  }
  _getEndpoint (pathname, params = {}, allowedParams = []) {
    const formattedParams = kebabCaseObjectKeys(params)
    const mergedParams = validateParams(formattedParams, allowedParams)
    const paramString = objectToQueryString(mergedParams)

    if (this.version === 'v1') {
      return `https://${this.name}.register.gov.uk/${pathname}${paramString}`
    } else {
      return `https://${this.name}.register.gov.uk/${this.version}/${pathname}${paramString}`
    }
  }
  register () {
    if (this.version !== 'v1') {
      throw new Error(`Resource unavailable in ${this.version}`)
    }

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
  items (itemHash) {
    if (this.version !== 'v1') {
      return this.blobs(itemHash)
    }

    return request(
      this._getEndpoint(`items/${itemHash}`)
    )
  }
  blobs (blobHashOrParams) {
    if (this.version === 'v1') {
      throw new Error('Resource unavailable in v1')
    }

    if (typeof blobHashOrParams === 'string') {
      return request(
        this._getEndpoint(`blobs/${blobHashOrParams}`)
      )
    } else {
      return request(
        this._getEndpoint(`blobs`)
      )
    }
  }
  downloadRegister () {
    if (this.version !== 'v1') {
      throw new Error(`Resource unavailable in ${this.version}`)
    }

    return request(
      this._getEndpoint('download-register'),
      'blob'
    )
  }
}

module.exports = Registers
