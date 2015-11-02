/*
  Render the favorites page and handle interactions
*/

'use strict'

let _ = require('lodash')
let api = require('./api')
let utils = require('./utils')
let Favorites = require('./html/favorites.html')
let Items = require('./html/items.html')

let response = []
let responseMap = {}
let username = utils.getCurrentUsername()
let currentFavorites = utils.getCurrentFavorites()

function addFavorite (imdbID) {
  return function (ev) {
    ev.preventDefault()
    if (imdbID) {
      api.addFavorite(responseMap[imdbID], (rsp) => {
        console.log(rsp)
      })
      currentFavorites[imdbID] = 1
      renderFavorites()
    }
  }
}

function deleteFavorite (imdbID) {
  return function (ev) {
    ev.preventDefault()
    if (imdbID) {
      api.deleteFavorite(imdbID, (rsp) => {
        console.log(rsp)
      })
      currentFavorites[imdbID] = 0
      renderFavorites()
    }
  }
}

function renderFavorites () {
  let results = _.template(Items)({items: response.favorites, username, currentFavorites})
  let markup = _.template(Favorites)({username, results})
  utils.render(markup, username + '\'s favorites')
  let buttons = document.getElementById('favorites-results').getElementsByTagName('button')
  _.map(buttons, (button) => {
    if (button.value === 'add') button.onclick = addFavorite(button.dataset['imdbid'])
    if (button.value === 'remove') button.onclick = deleteFavorite(button.dataset['imdbid'])
  })
}

module.exports = function (username) {
  /*
    Fetch the user's favorites and render the result
  */
  api.getFavorites(username, (rsp) => {
    response = rsp
    responseMap = _.reduce(response, (last, curr) => {
      last[curr.imdbID] = curr
      return last
    }, {})
    renderFavorites()
  })
}
