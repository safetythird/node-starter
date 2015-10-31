/*
  This is a stopgap measure because node-sqlite3 is broken right now.
*/

'use strict'

var users = {}
var favorites = {}

module.exports = {
  createUser (username, password, callback) {
    users[username] = password
    callback()
  },
  validateUser (username, password, callback) {
    callback(null, username && users[username] === password)
  },
  createFavorite (username, imdbID, Title, Year, Poster, callback) {
    if (!favorites[username]) favorites[username] = []
    favorites[username].push({imdbID, Title, Year, Poster})
    callback()
  },
  readFavorites (username, callback) {
    callback(null, favorites[username] || [])
  },
  deleteFavorite (imdbID, username, callback) {
    callback('no')
  }
}
