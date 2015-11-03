/*
  The main NodeJS server
*/

'use strict'

let express = require('express')
let path = require('path')
let bodyParser = require('body-parser')
let fs = require('fs')
let _ = require('lodash')
let session = require('express-session')
var RedisStore = require('connect-redis')(session)

// Load configuration
let configFile = fs.readFileSync(path.join(__dirname, 'config.json'), {encoding: 'utf8'})
const config = JSON.parse(configFile)

// Initialize
let db = require('./redisdb')(config)
let app = express()


/*
  Middleware
*/

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  store: new RedisStore({
    host: config.redisHost
  }),
  secret: 'feature creep',
  resave: true,
  saveUninitialized: true
}))
app.use('/static', express.static(path.join(__dirname, 'public')))


/*
  Endpoints that serve the site
*/

const indexTemplate = _.template(fs.readFileSync(path.join(__dirname, 'src/html/index.html')))

function serveIndex (page) {
  return function (req, res) {
    let username = req.session.username
    let favorites = req.session.favorites
    console.log(`username: ${username}, favorites: ${favorites}`)
    return res.send(indexTemplate({username, favorites, page}))
  }
}

app.get('/', serveIndex('search'))

app.get('/login', serveIndex('login'))

app.get('/detail/:id', serveIndex('detail'))

app.get('/favorites/:username', serveIndex('favorites'))

app.get('/logout', (req, res) => {
  req.session.username = null
  req.session.favorites = null
  return res.redirect('/')
})

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
        return res.status(500).send({error: 'Database error'})
      }
      if (!valid) return res.status(400).send({error: 'Incorrect username or password'})
      console.log(`login: ${username}`)
      // Log the user in
      req.session.username = username
      db.getFavoriteIds(username, (err, favorites) => {
        req.session.favorites = favorites
        return res.send({username, favorites})
      })
    })
  }
})

app.post('/api/signup', (req, res) => {
  let username = req.body.username
  let password = req.body.password
  if (!username || !password) return res.status(400).send({error: 'Username and password are required'})
  if (!usernameRegex.test(username)) return res.status(400).send({error: 'Invalid username'})

  db.createUser(username, password, (err, status) => {
    if (err) {
      return res.status(500).send({error: 'Database error'})
    }
    req.session.username = username
    req.session.favorites = []
    return res.send({status, username})
  })

})

app.get('/api/favorites/:username', (req, res) => {
  let username = req.params.username
  db.getFavorites(username, (err, favorites) => {
    if (err) {
      return res.status(500).send({error: 'Database error'})
    }
    return res.send({favorites})
  })
})

/*
  These endpoints check whether the user is logged in.
  If there are many endpoints like this, consider writing a middleware.
*/

app.post('/api/favorites', (req, res) => {
  let body = req.body
  let username = req.session.username
  if (!username) return res.status(401).send({error: 'Must be logged in'})
  if (!body.imdbID || !body.Title || !body.Year || !body.Poster) {
    return res.status(400).send({error: 'Bad request body'})
  }
  db.createFavorite(username, body.imdbID, body.Title, body.Year, body.Poster, (err, favorites) => {
    if (err) return res.status(500).send({error: 'Database error'})
    req.session.favorites = favorites
    return res.send({favorites})
  })
})

app.delete('/api/favorites', (req, res) => {
  let body = req.body
  let username = req.session.username
  if (!username) return res.status(401).send({error: 'Must be logged in'})
  if (!body.imdbID) {
    return res.status(400).send({error: 'Bad request body'})
  }
  db.deleteFavorite(username, body.imdbID, (err, favorites) => {
    if (err) return res.status(500).send({error: 'Database error'})
    req.session.favorites = favorites
    return res.send({favorites})
  })
})


/*
  Start the app
*/

app.listen(config.port, () => {
  console.log('Listening on port ' + config.port)
})
