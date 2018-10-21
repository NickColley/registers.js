const Registers = require('registers')
const country = new Registers('country')

function getItemsFromRecords (records) {
  return Object.entries(records).map(record => {
    return record[1].item[0]
  })
}

function getCountryNames () {
  country
    .records()
    .then(getItemsFromRecords)
    .then(items => {
      const countryNames = items.map(record => record.name)
      console.log('Country names', countryNames)
    })
}

getCountryNames()
