const fs = require('fs')
const Registers = require('registers')
const country = new Registers('country')

async function App () {
  const buffer = await country.downloadRegister()
  fs.writeFile('register.zip', buffer, function (err) {
    if (err) {
      throw new Error(err)
    }
    console.log('register.zip downloaded')
  })
}
App()
