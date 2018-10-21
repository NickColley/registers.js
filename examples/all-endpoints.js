const Registers = require('registers')
const register = new Registers('register')

async function App () {
  try {
    // GET /register
    // https://docs.registers.service.gov.uk/api_reference/get_register/#get-register
    const info = await register.register()
    console.log('GET /register', info)

    // GET /records
    // https://docs.registers.service.gov.uk/api_reference/get_records/#get-records
    const records = await register.records()
    console.log('GET /records', records)

    // GET /records/{key}
    // https://docs.registers.service.gov.uk/api_reference/get_records_key/#get-records-key
    const countryRecord = await register.records('country')
    console.log('GET /records/country', countryRecord)

    // GET /records/{key}/entries
    // https://docs.registers.service.gov.uk/api_reference/get_records_key_entries/#get-records-key-entries
    const countryRecordEntries = await register.records('country', { entries: true })
    console.log('GET /records/country/entries', countryRecordEntries)

    // GET /records/{field-name}/{field-value}
    // https://docs.registers.service.gov.uk/api_reference/get_records_field_name_field_value/#get-records-field-name-field-value
    const filteredRecords = await register.records({ fieldName: 'registry', fieldValue: 'ofqual' })
    console.log('GET /records/registry/ofqual', filteredRecords)

    // GET /entries
    // https://docs.registers.service.gov.uk/api_reference/get_entries/#get-entries
    const entries = await register.entries()
    console.log('GET /entries', entries)

    // GET /entries/{entry-number}
    // https://docs.registers.service.gov.uk/api_reference/get_entries_entry_number/#get-entries-entry-number
    const secondEntry = await register.entries(2)
    console.log('GET /entries/2', secondEntry)

    // GET /items/{item-hash}
    // https://docs.registers.service.gov.uk/api_reference/get_items_item_hash/#get-items-item-hash
    const item = await register.items('sha-256:610bde42d3ae2ed3dd829263fe461542742a10ca33865d96d31ae043b242c300')
    console.log('GET /items/sha-256:610bde42d3ae2ed3dd829263fe461542742a10ca33865d96d31ae043b242c300', item)

    // GET /download-register
    // https://docs.registers.service.gov.uk/api_reference/get_download_register/#get-download-register
    const downloadedRegisterAsBuffer = await register.downloadRegister()
    console.log('GET /download-register', downloadedRegisterAsBuffer)
  } catch (error) {
    console.error(error)
  }
}

App()
