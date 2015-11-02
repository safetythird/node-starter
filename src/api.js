/*
  All interactions with the internal API
*/

'use strict'

let _ = require('lodash')
let $ = require('jquery')

const apiURL = '/api'

module.exports = {
  login (username, password, callback) {
    $.ajax(apiURL + '/login', {method: 'POST', dataType: 'json', data: {username, password}}).done(callback)
  },
  signup (username, password, callback) {
    $.ajax(apiURL + '/signup', {method: 'POST', dataType: 'json', data: {username, password}}).done(callback)
  },
  addFavorite (favorite, callback) {
    let data = _.pick(favorite, ['imdbID', 'Title', 'Year', 'Poster'])
    $.ajax(apiURL + '/favorites', {method: 'POST', dataType: 'json', data}).done(callback)
  },
  getFavorites (username, callback) {
    $.ajax(apiURL + '/favorites/' + username).done(callback)
  },
  deleteFavorite (imdbID, callback) {
    $.ajax(apiURL + '/favorites', {method: 'DELETE', dataType: 'json', data: {imdbID}}).done(callback)
  }
}