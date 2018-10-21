const fetchMock = require('jest-fetch-mock')
jest.setMock('node-fetch', fetchMock)
const fetch = require('node-fetch')

const fixtures = require('./test/fixtures.js')

const Registers = require('./index.js')

beforeEach(() => {
  fetch.mockClear()
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
      const fixture = fixtures['register']['records?field-value=register&field-name=ofqual']
      fetch.mockResponse(JSON.stringify(fixture))

      const register = new Registers('register')
      const result = await register.records({ fieldValue: 'register', fieldName: 'ofqual' })

      expect(fetch).toHaveBeenCalledWith('https://register.register.gov.uk/records?field-value=register&field-name=ofqual', {
        headers: {
          'Accept': 'application/json'
        }
      })
      expect(Object.keys(result).length).toBe(4)
      expect(result).toEqual(fixture)
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
  })
  describe('items', () => {
    it('returns json with defaults set', async () => {
      const fixture = fixtures['register']['items/sha-256:610bde42d3ae2ed3dd829263fe461542742a10ca33865d96d31ae043b242c300']
      fetch.mockResponse(JSON.stringify(fixture))

      const register = new Registers('register')
      const result = await register.items()

      expect(fetch).toHaveBeenCalledWith('https://register.register.gov.uk/items', {
        headers: {
          'Accept': 'application/json'
        }
      })
      expect(Object.keys(result).length).toBe(5)
      expect(result).toEqual(fixture)
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
