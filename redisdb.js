/*
  I'd prefer to use sqlite, but node-sqlite3 is broken right now.
*/

'use strict'

let redis = require('redis')
let bcrypt = require('bcryptjs')

// Assumed to be running in docker-compose with a link called 'redis'
const client = redis.createClient({host: 'redis'})

// Store user info and user favorites as separate hashes (no nested hashes in Redis)
const user_hkey = (username) => `users.${username}`
const user_favorites_hkey = (username) => `users.${username}.favorites`

// All callbacks should use the (err, reply) pattern
module.exports = {
  createUser (username, password, callback) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return callback(err)
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) return callback(err)
        client.hset(user_hkey(username), 'password', hash, callback)
      })
    })
  },
  validateUser (username, password, callback) {
    client.hget(user_hkey(username), 'password', (err, rsp) => {
      console.log(`error: ${err}, rsp: ${rsp}`)
      if (err) return callback(err)
      if (rsp === null) return callback(null, null)
      bcrypt.compare(password, rsp, callback)
    })
  },
  createFavorite (username, imdbID, Title, Year, Poster, callback) {
    let hkey = user_favorites_hkey(username)
    client.hmset(hkey, 'imdbID', imdbID, 'Title', Title, 'Year', Year, 'Poster', Poster, callback)
  },
  readFavorites (username, callback) {
    client.hgetall(user_favorites_hkey(username), callback)
  },
  deleteFavorite (imdbID, username, callback) {
    client.hdel(user_favorites_hkey(username), imdbID, callback)
  }
}
