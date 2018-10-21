const Registers = require('registers')
const country = new Registers('country')

function getItemsFromRecords (records) {
  return Object.entries(records).map(record => {
    return record[1].item[0]
  })
}

async function getCountryNames () {
  const records = await country.records()
  const countryNames = getItemsFromRecords(records).map(record => record.name)
  console.log('Country names', countryNames)
}

getCountryNames()
