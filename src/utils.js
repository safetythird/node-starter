/*
  Utility functions used by the rest of the app
*/

'use strict'

let _ = require('lodash')
let api = require('./api')

function render (markup, title) {
  document.getElementById('content').innerHTML = markup
  document.title = title
}
function getCurrentUsername () {
  let elem = document.getElementById('user-data')
  return elem.dataset.username || ''
}
function getCurrentFavorites () {
  let favorites = document.getElementById('user-data').dataset.favorites
  if (favorites === undefined) return []
  return _.reduce(favorites.split(','), (last, curr) => {
    last[curr] = 1
    return last
  }, {})
}
function addFavorite (favorite, callback) {
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
}
function deleteFavorite (imdbID, callback) {
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

module.exports = {
  render,
  getCurrentUsername,
  getCurrentFavorites,
  addFavorite,
  deleteFavorite
}

