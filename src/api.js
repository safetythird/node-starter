/*
  All interactions with the internal API
*/

'use strict'

let $ = require('jquery')

const apiURL = '/api'

module.exports = {
  login (username, password, callback) {
    $.ajax(apiURL + '/login', {method: 'POST', dataType: 'json', data: {username, password}}).done(callback)
  },
  signup (username, password, callback) {
    $.ajax(apiURL + '/signup', {method: 'POST', dataType: 'json', data: {username, password}}).done(callback)
  },
  addFavorite (imdbID, Title, Year, Poster, callback) {
    $.ajax(apiURL + '/favorites', {method: 'POST', dataType: 'json', data: {imdbID, Title, Year, Poster}}).done(callback)
  },
  getFavorites (username, callback) {
    $.ajax(apiURL + '/favorites/' + username).done(callback)
  }
}