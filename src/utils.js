/*
  Utility functions used by the rest of the app
*/

'use strict'

let _ = require('lodash')
let api = require('./api')

module.exports = {
  render (markup, title) {
    document.getElementById('content').innerHTML = markup
    document.title = title
  },
  getCurrentUsername () {
    let elem = document.getElementById('user-data')
    return elem.dataset.username || ''
  },
  getCurrentFavorites () {
    let favorites = document.getElementById('user-data').dataset.favorites
    if (favorites === undefined) return []
    return _.reduce(favorites.split(','), (last, curr) => {
      last[curr] = 1
      return last
    }, {})
  },
  addFavorite (favorite, callback) {
    console.log(favorite)
    return function (ev) {
      ev.preventDefault()
      if (favorite) {
        api.addFavorite(favorite, (rsp) => {
          console.log(rsp)
        })
        callback()
      }
    }
  },
  deleteFavorite (imdbID, callback) {
  return function (ev) {
    ev.preventDefault()
    if (imdbID) {
      api.deleteFavorite(imdbID, (rsp) => {
        console.log(rsp)
      })
      callback()
    }
  }
}
}
