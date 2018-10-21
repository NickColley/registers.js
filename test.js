const Registers = require('./index.js')

async function main () {
  [
    'register',
    'local-authority-eng'
  ].forEach(async (registerName) => {
    const register = new Registers(registerName)
    let result = await register.register()
    console.log(
      Object.keys(result).length
    )
    result = await register.records()
    console.log(
      Object.keys(result).length
    )
    result = await register.entries()
    console.log(
      Object.keys(result).length
    )
  })
}

main()
