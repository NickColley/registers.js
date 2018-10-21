const {
  kebabCaseObjectKeys,
  objectToQueryString,
  mergeDefaultObject
} = require('./utilities.js')

describe('utilities', () => {
  describe('kebabCaseObjectKeys', () => {
    it('throws an error if it not passed an object', () => {
      expect(() => {
        kebabCaseObjectKeys()
      }).toThrow('expected object to be passed')
    })
    it('turns objects with camelcase keys into kebab-case keys', () => {
      const originalObject = {
        camelCase: true
      }
      const formattedObject = kebabCaseObjectKeys(originalObject)
      expect(formattedObject).toEqual({ 'camel-case': true })
    })

    it('keeps kebab-case keys as kebab-case keys', () => {
      const originalObject = {
        'camel-case': true
      }
      const formattedObject = kebabCaseObjectKeys(originalObject)
      expect(formattedObject).toEqual({ 'camel-case': true })
    })
  })
  describe('objectToQueryString', () => {
    it('throws an error if it not passed an object', () => {
      expect(() => {
        objectToQueryString()
      }).toThrow('expected object to be passed')
    })
    it('it returns an empty string from an empty object', () => {
      const originalObject = {}
      const queryString = objectToQueryString(originalObject)
      expect(queryString).toEqual('')
    })
    it('it returns a query string from an object', () => {
      const originalObject = {
        camelCaseKey: 'value',
        'kebab-case-key': 'second-value'
      }
      const queryString = objectToQueryString(originalObject)
      expect(queryString).toEqual('?camelCaseKey=value&kebab-case-key=second-value')
    })
  })
  describe('mergeDefaultObject', () => {
    it('it returns empty object if no default is passed', () => {
      const originalObject = {
        camelCaseKey: 'value',
        'kebab-case-key': 'second-value'
      }
      const mergedObject = mergeDefaultObject(originalObject)
      expect(mergedObject).toEqual({})
    })
    it('it returns default object values if nothing overrides it', () => {
      const originalObject = {
        'kebab-case-key': 'second-value'
      }
      const defaultObject = {
        camelCaseKey: 'default'
      }
      const mergedObject = mergeDefaultObject(originalObject, defaultObject)
      expect(mergedObject).toEqual({ camelCaseKey: 'default' })
    })
    it('it returns default object values with overrides values from original object', () => {
      const originalObject = {
        'kebab-case-key': 'second-value',
        camelCaseKey: 'overridden'
      }
      const defaultObject = {
        camelCaseKey: 'default'
      }
      const mergedObject = mergeDefaultObject(originalObject, defaultObject)
      expect(mergedObject).toEqual({ camelCaseKey: 'overridden' })
    })
  })
})
