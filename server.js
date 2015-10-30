'use strict'
let express = require('express')
let fs = require('fs')
let path = require('path')
let bodyParser = require('body-parser')

let app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// TODO users
// TODO http basic auth

app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'src/html/index.html'))
})

app.get('/detail/:id', function (req, res) {
  res.sendFile(path.join(__dirname, 'src/html/index.html'))
})

app.get('/favorites', function (req, res) {
  let data = fs.readFileSync('./data.json')
  res.setHeader('Content-Type', 'application/json')
  res.send(data)
})

app.post('/favorites', function (req, res) {
  if(!req.body.name || !req.body.oid) {
    res.send('Error')
    return
  }

  let data = JSON.parse(fs.readFileSync('./data.json'))
  data.push(req.body)
  fs.writeFile('./data.json', JSON.stringify(data))
  res.setHeader('Content-Type', 'application/json')
  res.send(data)
})

app.listen(8080, function () {
  console.log('Listening on port 8080')
})
