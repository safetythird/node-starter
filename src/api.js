/*
  All interactions with the internal API
*/

'use strict'

let _ = require('lodash')
let $ = require('jquery')

const apiURL = '/api'

function login (username, password, callback) {
  $.ajax(apiURL + '/login', {method: 'POST', dataType: 'json', data: {username, password}}).done(callback)
}

function signup (username, password, callback) {
  $.ajax(apiURL + '/signup', {method: 'POST', dataType: 'json', data: {username, password}}).done(callback)
}

function addFavorite (favorite, callback) {
  let data = _.pick(favorite, ['imdbID', 'Title', 'Year', 'Poster'])
  console.log(data)
  $.ajax(apiURL + '/favorites', {method: 'POST', dataType: 'json', data}).done(callback)
}

function getFavorites (username, callback) {
  $.ajax(apiURL + '/favorites/' + username).done(callback)
}

function deleteFavorite (imdbID, callback) {
  $.ajax(apiURL + '/favorites', {method: 'DELETE', dataType: 'json', data: {imdbID}}).done(callback)
}

module.exports = {
  login,
  signup,
  addFavorite,
  getFavorites,
  deleteFavorite
}