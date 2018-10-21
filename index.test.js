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
    let fixture
    beforeEach(() => {
      fixture = fixtures['register']['records?page-size=100&page-index=1']
      fetch.mockResponse(JSON.stringify(fixture))
    })
    it('returns json with defaults set', async () => {
      const register = new Registers('register')
      const result = await register.records()

      expect(fetch).toHaveBeenCalledWith('https://register.register.gov.uk/records?page-size=100&page-index=1', {
        headers: {
          'Accept': 'application/json'
        }
      })
      expect(Object.keys(result).length).toBe(44)
      expect(result).toEqual(fixture)
    })
    it('has options that can be set', async () => {
      const register = new Registers('register')
      await register.records({ pageSize: 5000, pageIndex: 2 })

      expect(fetch).toHaveBeenCalledWith('https://register.register.gov.uk/records?page-size=5000&page-index=2', {
        headers: {
          'Accept': 'application/json'
        }
      })
    })
  })
  describe.skip('pagination', () => {})
})
