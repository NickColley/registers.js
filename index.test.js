/**
 * @jest-environment node
 */

const fetchMock = require('jest-fetch-mock')
jest.setMock('node-fetch', fetchMock)
const fetch = require('node-fetch')

const fixtures = require('./test/fixtures.js')

const Registers = require('./index.js')

beforeEach(() => {
  fetch.resetMocks()
})

describe('Registers', () => {
  let fixture
  beforeEach(() => {
    fixture = fixtures['register']['register']
    fetch.mockResponse(JSON.stringify(fixture))
  })
  describe('register', () => {
    it('returns json', async () => {
      const register = new Registers('register')
      const result = await register.register()

      expect(fetch).toHaveBeenCalledWith('https://register.register.gov.uk/register', {
        headers: {
          'Accept': 'application/json'
        }
      })
      expect(result).toEqual(fixture)
    })
  })
  describe('records', () => {
    it('returns json with defaults set', async () => {
      const fixture = fixtures['register']['records']
      fetch.mockResponse(JSON.stringify(fixture))

      const register = new Registers('register')
      const result = await register.records()

      expect(fetch).toHaveBeenCalledWith('https://register.register.gov.uk/records', {
        headers: {
          'Accept': 'application/json'
        }
      })
      expect(Object.keys(result).length).toBe(44)
      expect(result).toEqual(fixture)
    })
    it('params page size and index can be set', async () => {
      const register = new Registers('register')
      await register.records({ pageSize: 5000, pageIndex: 2 })

      expect(fetch).toHaveBeenCalledWith('https://register.register.gov.uk/records?page-size=5000&page-index=2', {
        headers: {
          'Accept': 'application/json'
        }
      })
    })
    it('can get individual record using a key', async () => {
      const fixture = fixtures['register']['records/country']
      fetch.mockResponse(JSON.stringify(fixture))

      const register = new Registers('register')
      const result = await register.records('country')

      expect(fetch).toHaveBeenCalledWith('https://register.register.gov.uk/records/country', {
        headers: {
          'Accept': 'application/json'
        }
      })
      expect(Object.keys(result).length).toBe(1)
      expect(result).toEqual(fixture)
    })
    it('can get individual record entries', async () => {
      const fixture = fixtures['register']['records/country/entries']
      fetch.mockResponse(JSON.stringify(fixture))

      const register = new Registers('register')
      const result = await register.records('country', { entries: true })

      expect(fetch).toHaveBeenCalledWith('https://register.register.gov.uk/records/country/entries', {
        headers: {
          'Accept': 'application/json'
        }
      })
      expect(Object.keys(result).length).toBe(2)
      expect(result).toEqual(fixture)
    })
    it('can get records that share a field-value for a particular field-name.', async () => {
      const fixture = fixtures['register']['records/registry/ofqual']
      fetch.mockResponse(JSON.stringify(fixture))

      const register = new Registers('register')
      const result = await register.records({ fieldName: 'registry', fieldValue: 'ofqual' })

      expect(fetch).toHaveBeenCalledWith('https://register.register.gov.uk/records/registry/ofqual', {
        headers: {
          'Accept': 'application/json'
        }
      })
      expect(Object.keys(result).length).toBe(4)
      expect(result).toEqual(fixture)
    })
    it('queries the requested API version', async () => {
      const register = new Registers('register', { version: 'next' })
      await register.records()
      expect(fetch).toHaveBeenCalledWith('https://register.register.gov.uk/next/records', {
        headers: {
          'Accept': 'application/json'
        }
      })
    })
  })
  describe('entries', () => {
    it('returns json with defaults set', async () => {
      const fixture = fixtures['register']['entries']
      fetch.mockResponse(JSON.stringify(fixture))

      const register = new Registers('register')
      const result = await register.entries()

      expect(fetch).toHaveBeenCalledWith('https://register.register.gov.uk/entries', {
        headers: {
          'Accept': 'application/json'
        }
      })
      expect(Object.keys(result).length).toBe(66)
      expect(result).toEqual(fixture)
    })
    it('queries the requested API version', async () => {
      const register = new Registers('register', { version: 'next' })
      await register.entries()
      expect(fetch).toHaveBeenCalledWith('https://register.register.gov.uk/next/entries', {
        headers: {
          'Accept': 'application/json'
        }
      })
    })
    it('params start and limit can be set', async () => {
      const register = new Registers('register')
      await register.entries({ start: 2, limit: 5000 })

      expect(fetch).toHaveBeenCalledWith('https://register.register.gov.uk/entries?start=2&limit=5000', {
        headers: {
          'Accept': 'application/json'
        }
      })
    })
    it('can get individual entry using an entry number', async () => {
      const fixture = fixtures['register']['entries/2']
      fetch.mockResponse(JSON.stringify(fixture))

      const register = new Registers('register')
      const result = await register.entries(2)

      expect(fetch).toHaveBeenCalledWith('https://register.register.gov.uk/entries/2', {
        headers: {
          'Accept': 'application/json'
        }
      })
      expect(Object.keys(result).length).toBe(1)
      expect(result).toEqual(fixture)
    })
  })
  describe('items', () => {
    it('returns json with defaults set', async () => {
      const fixture = fixtures['register']['items/sha-256:610bde42d3ae2ed3dd829263fe461542742a10ca33865d96d31ae043b242c300']
      fetch.mockResponse(JSON.stringify(fixture))

      const register = new Registers('register')
      const result = await register.items('sha-256:610bde42d3ae2ed3dd829263fe461542742a10ca33865d96d31ae043b242c300')

      expect(fetch).toHaveBeenCalledWith('https://register.register.gov.uk/items/sha-256:610bde42d3ae2ed3dd829263fe461542742a10ca33865d96d31ae043b242c300', {
        headers: {
          'Accept': 'application/json'
        }
      })

      expect(Object.keys(result).length).toBe(5)
      expect(result).toEqual(fixture)
    })
    it('uses /blobs for v2', async () => {
      const register = new Registers('register', { version: 'next' })
      await register.items('1220610bde42d3ae2ed3dd829263fe461542742a10ca33865d96d31ae043b242c300')
      expect(fetch).toHaveBeenCalledWith('https://register.register.gov.uk/next/blobs/1220610bde42d3ae2ed3dd829263fe461542742a10ca33865d96d31ae043b242c300', {
        headers: {
          'Accept': 'application/json'
        }
      })
    })
  })
  describe('blobs', () => {
    it('fetches a page of blobs', async () => {
      const register = new Registers('register', { version: 'next' })
      await register.blobs()
      expect(fetch).toHaveBeenCalledWith('https://register.register.gov.uk/next/blobs', {
        headers: {
          'Accept': 'application/json'
        }
      })
    })
    it('fetches a single blob', async () => {
      const register = new Registers('register', { version: 'next' })
      await register.blobs('1220610bde42d3ae2ed3dd829263fe461542742a10ca33865d96d31ae043b242c300')
      expect(fetch).toHaveBeenCalledWith('https://register.register.gov.uk/next/blobs/1220610bde42d3ae2ed3dd829263fe461542742a10ca33865d96d31ae043b242c300', {
        headers: {
          'Accept': 'application/json'
        }
      })
    })
    it('returns null if there is no next page', async () => {
      const fixture = fixtures['register']['next/blobs']
      fetch.mockResponse(JSON.stringify(fixture))

      const register = new Registers('register', { version: 'next' })
      const page = await register.blobs()
      expect(page.next()).toBeNull()
    })
    it('can fetch multiple pages', async () => {
      const fixturePage1 = fixtures['register']['next/blobs'].slice(0, 2)
      const fixturePage2 = fixtures['register']['next/blobs'].slice(2, 4)
      fetch.mockResponseOnce(
        JSON.stringify(fixturePage1),
        {
          status: 200,
          url: 'https://register.register.gov.uk/next/blobs',
          headers: { 'content-type': 'application/json', 'Link': '<?start=foo&limit=100>; rel="next"' }
        }
      )
      fetch.mockResponseOnce(
        JSON.stringify(fixturePage2),
        {
          status: 200,
          url: 'https://register.register.gov.uk/next/blobs?start=foo&limit=100',
          headers: { 'content-type': 'application/json' }
        }
      )

      const register = new Registers('register', { version: 'next' })
      const page = await register.blobs()
      const nextPage = await page.next()

      expect(page.items).toEqual(fixturePage1)
      expect(nextPage.items).toEqual(fixturePage2)

      expect(fetch).toHaveBeenCalledWith('https://register.register.gov.uk/next/blobs', {
        headers: {
          'Accept': 'application/json'
        }
      })

      expect(fetch).toHaveBeenCalledWith('https://register.register.gov.uk/next/blobs?start=foo&limit=100', {
        headers: {
          'Accept': 'application/json'
        }
      })
    })
    it('is unavailable in v1', async () => {
      const register = new Registers('register')
      expect(() => { register.blobs() }).toThrowError(Error)
    })
  })
  describe('download-register', () => {
    it('returns json with defaults set', async () => {
      const fixture = fixtures['register']['download-register']
      fetch.mockResponse(Buffer.from(fixture))

      const register = new Registers('register')
      const result = await register.downloadRegister()

      expect(fetch).toHaveBeenCalledWith('https://register.register.gov.uk/download-register', {
        headers: {
          'Accept': 'application/octet-stream'
        }
      })
      expect(result).toEqual(Buffer.from(fixture))
    })
  })
  describe.skip('pagination', () => {})
})
