const fs = require('fs')
const data = JSON.stringify(process.env)
fs.writeFileSync('env.js', `export default ${data}`)
console.log('env.js written')