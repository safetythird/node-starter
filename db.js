/*
  Interact with the SQLite3 database
*/

'use strict'

let sqlite3 = require('sqlite3').verbose()
let bcrypt = require('bcrypt')

var db

module.exports = function (path) {
  console.log('creating database')
  db = new sqlite3.Database(path)


  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (name TEXT PRIMARY KEY, passwordhash TEXT')
    db.run('CREATE TABLE IF NOT EXISTS favorites (user TEXT, imdbID TEXT PRIMARY KEY, Title TEXT, Year TEXT, Poster TEXT, FOREIGN KEY(user) REFERENCES users(name)')
  })

  let userCreate = db.prepare('INSERT INTO users VALUES (?, ?)')
  let userSelect = db.prepare('SELECT * FROM users WHERE name = ?')
  let favoriteCreate = db.prepare('INSER INTO favorites VALUES (?, ?, ?, ?, ?)')
  let favoriteSelect = db.prepare('SELECT * FROM favorites WHERE user = ?')
  let favoriteDelete = db.prepare('DELETE FROM favorites WHERE imdbID = ? AND user = ?')

  return {
    createUser (username, password, callback) {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) return callback(err)
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) return callback(err)
          userCreate.run([username, hash], callback)
        })
      })
    },
    validateUser (username, password, callback) {
      /*
        Callback (err, bool isValid)
      */
      userSelect.get(name, (err, row) => {
        if (err) return callback(err)
        bcrypt.compare(password, row.hash, callback)
      })
    },
    createFavorite (username, imdbID, Title, Year, Poster, callback) {
      favoriteCreate.run([username, imdbID, Title, Year, Poster], callback)
    },
    readFavorites (username, callback) {
      favoriteSelect.run(username, callback)
    },
    deleteFavorite (imdbID, username, callback) {
      favoriteDelete.run([imdbID, username], callback)
    }
  }
}