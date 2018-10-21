const country = new window.Registers('country')

country.downloadRegister().then(buffer => {
  const blob = new window.Blob([buffer], { type: 'application/octet-stream' })
  document.body.innerHTML = `<a href="${URL.createObjectURL(blob)}" download='register.zip'>Download register.zip</a>`
})
