/*
  I'd prefer to use sqlite, but node-sqlite3 is broken right now.
  All callbacks should use the (err, reply) pattern.
*/

'use strict'

let _ = require('lodash')
let redis = require('redis')
let bcrypt = require('bcryptjs')

// Assumed to be running in docker-compose with a link called 'redis'
const client = redis.createClient({host: 'redis'})

client.on('error', (err) => {
  console.log(`Redis error: ${err}`)
})

// Store user info and user favorites as separate hashes (no nested hashes in Redis)
const user_hkey = (username) => `users.${username}`
const favorites_hkey = (imdbID) => `favorites.${imdbID}`
const user_favorites_skey = (username) => `users.${username}.favorites`


function createUser (username, password, callback) {
  /*
    Hash the user's password and store it in the user hash.
    This could be just a single key, but I made it a hash on the assumption
    that fields will be added to the user in the future.
  */
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return callback(err)
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) return callback(err)
      client.hset(user_hkey(username), 'password', hash, callback)
    })
  })
}

function validateUser (username, password, callback) {
  client.hget(user_hkey(username), 'password', (err, rsp) => {
    if (err) return callback(err)
    if (rsp === null) return callback(null, null)
    bcrypt.compare(password, rsp, callback)
  })
}

function getFavoriteIds (username, callback) {
  /*
    Get just the IDs of the uers's favorites. Returns [] if the hash doesn't exist.
  */
  client.smembers(user_favorites_skey(username), callback)
}

function getFavorites (username, callback) {
  /*
    Get all the keys for the user's favorites, then get all the hashes at once
    using a pipeline.
  */
  getFavoriteIds(username, (err, ids) => {
    let pipe = client.multi()
    _.forEach(ids, (id) => pipe.hgetall(favorites_hkey(id)))
    pipe.exec(callback)
  })
}

/*
  Create and delete both call getFavoriteIds, so the callback gets passed the current list of
  favorite ids.
*/
function createFavorite (username, imdbID, Title, Year, Poster, callback) {
  /*
    Insert or update the movie information for the new favorite, and add its key to
    the user's favorites hash.
  */
  let favkey = favorites_hkey(imdbID)
  let userFavkey = user_favorites_skey(username)
  // Insert or update the favorites entry
  client.hmset(favkey, 'imdbID', imdbID, 'Title', Title, 'Year', Year, 'Poster', Poster, (err, status) => {
    // Don't wait for a response, but log it
    console.log(`${imdbID}: ${status === 1 ? 'created' : 'updated'}: ${err ? 'failed' : 'success'}`)
  })
  client.sadd(userFavkey, imdbID, (err) => {
    if (err) return callback(err)
    getFavoriteIds(username, callback)
  })
}

function deleteFavorite (username, imdbID, callback) {
  client.srem(user_favorites_skey(username), imdbID, (err) => {
    if (err) return callback(err)
    getFavoriteIds(username, callback)
  })
}


module.exports = {createUser, validateUser, createFavorite, getFavorites, getFavoriteIds, deleteFavorite}
