const querystring = require('querystring')

function camelCaseToKebabCase (string) {
  return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

function kebabCaseObjectKeys (object) {
  if (typeof object === 'undefined') {
    throw new Error('expected object to be passed')
  }
  let formattedObject = {}
  Object.keys(object).forEach(key => {
    formattedObject[camelCaseToKebabCase(key)] = object[key]
  })
  return formattedObject
}

function objectToQueryString (object) {
  if (typeof object === 'undefined') {
    throw new Error('expected object to be passed')
  }
  const stringifiedParams = querystring.stringify(object)
  return stringifiedParams ? ('?' + stringifiedParams) : ''
}

function validateParams (originalObject, allowedParams = []) {
  let mergedObject = {}
  Object.keys(originalObject).forEach(key => {
    if (allowedParams.includes(key)) {
      mergedObject[key] = originalObject[key]
    }
  })
  return mergedObject
}

module.exports = {
  kebabCaseObjectKeys,
  objectToQueryString,
  validateParams
}
