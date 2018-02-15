const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')
const mimeType = require('./mimeType')

const port = process.argv[2] || 9000
console.log(typeof mimeType)

http
  .createServer((req, res) => {
    console.log(`${req.method} ${req.url}`)

    let pathname = `.${url.parse(req.url).pathname}`

    fs.exists(pathname, exist => {
      if (!exist) {
        res.statusCode = 404
        res.end(`File ${pathname} not found!`)
        return
      }

      if (fs.statSync(pathname).isDirectory()) {
        pathname += '/index.html'
      }

      fs.readFile(pathname, (err, data) => {
        if (err) {
          res.statusCode = 500
          res.end(`Error getting the file: ${err}.`)
        } else {
          const { ext } = path.parse(pathname)
          console.log(ext)
          console.log(mimeType)
          res.setHeader('Content-type', mimeType[ext] || 'text/plain')
          res.end(data)
        }
      })
    })
  })
  .listen(parseInt(port))
console.log(`Server listening on port ${port}`)
