/*
  The main NodeJS server
*/

'use strict'

let express = require('express')
let path = require('path')
let bodyParser = require('body-parser')
let fs = require('fs')
let _ = require('lodash')
// let db = require('./db')('/var/run/sqlite3')
let db = require('./redisdb')
let session = require('express-session')
var RedisStore = require('connect-redis')(session);

let app = express()


/*
  Middleware
*/

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
    store: new RedisStore({
      host: 'redis'
    }),
    secret: 'feature creep',
    resave: true,
    saveUninitialized: true
}));
app.use('/static', express.static(path.join(__dirname, 'public')))


/*
  Endpoints that serve the site
*/

const indexTemplate = _.template(fs.readFileSync(path.join(__dirname, 'src/html/index.html')))

function serveIndex (req, res) {
  let username = req.session.username || ''
  let favorites = req.session.favorites || []
  return res.send(indexTemplate({username, favorites}))
}

app.get('/', serveIndex)

app.get('/login', serveIndex)

app.get('/detail/:id', serveIndex)

app.get('/favorites/:username', serveIndex)


/*
  Endpoints that serve the API for interacting with the database
*/

const usernameRegex = /^[a-zA-Z0-9]+$/

app.post('/api/login', (req, res) => {
  if (!req.session.username) {
    let username = req.body.username
    let password = req.body.password
    if (!username || !password || !(usernameRegex.test(username))) {
      return res.status(400).send({error: 'Invalid username or password'})
    }
    db.validateUser(username, password, (err, valid) => {
      if (err) {
        console.log(err)
        return res.status(500).send({error: 'Database error'})
      }
      if (!valid) return res.status(400).send({error: 'Incorrect username or password'})
      // Log the user in
      req.session.username = username
      db.readFavorites(username, (err, favorites) => {
        req.session.favortes = favorites
      })
      return res.send({status: 'Logged in'})
    })
  }
})

app.post('/api/signup', (req, res) => {
  let username = req.body.username
  let password = req.body.password
  if (!username || !password) return res.status(400).send({error: 'Username and password are required'})
  if (!usernameRegex.test(username)) return res.status(400).send({error: 'Invalid username'})

  db.createUser(username, password, (err) => {
    if (err) {
      console.log(err)
      return res.status(500).send({error: 'Database error'})
    }
    req.session.username = username
    req.session.favorites = []
    return res.send({status: 'created', username})
  })

})

app.get('/api/favorites/:username', (req, res, username) => {
  db.readFavorites(username, (err, favorites) => {
    if (err) {
      console.log(err)
      return res.status(500).send({error: 'Database error'})
    }
    return res.send({favorites})
  })
})

app.post('/api/favorites', (req, res) => {
  /*
    This is the only endpoint that changes user state, so we just check here whether the user is logged in.
    If there are multiple endpoints like this, consider writing a middleware.
  */
  let body = req.body
  let username = req.session.username
  if (!username) return res.status(401).send({error: 'Must be logged in'})
  if (!body.imdbID || !body.Title || !body.Year || !body.Poster) {
    return res.status(400).send({error: 'Bad request body'})
  }
  db.createFavorite(body.username, body.imdbID, body.Title, body.Year, body.Poster, (err, status) => {
    if (err) {
      console.log(err)
      return res.status(500).send({error: 'Database error'})
    }
    return res.send({status})
  })
})


/*
  Start the app
*/

app.listen(8080, () => {
  console.log('Listening on port 8080')
})
