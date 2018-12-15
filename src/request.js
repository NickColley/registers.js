const fetch = require('node-fetch')
const LinkHeader = require('http-link-header')
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

class Page {
  constructor (items, nextUrl) {
    this.items = items
    this._nextUrl = nextUrl
  }

  next () {
    if (this._nextUrl === null) {
      return null
    }

    return Page.request(this._nextUrl)
  }

  static async request (url) {
    const response = await fetch(url, {
      headers: {
        'Accept': `application/json`
      }
    })
    const items = await response.json()
    const headers = response.headers
    const nextUrl = this._extractNextUrl(headers, response.url)

    return new Page(items, nextUrl)
  }

  static _extractNextUrl (headers, baseUrl) {
    const links = headers.get('Link')
    if (links === null) {
      return null
    }

    const parsedLinks = LinkHeader.parse(links)
    if (!parsedLinks.has('rel', 'next')) {
      return null
    }

    const nextUrlRelative = parsedLinks.get('rel', 'next')[0].uri

    return new URL(nextUrlRelative, baseUrl).href
  }
}

module.exports = { request, Page }
