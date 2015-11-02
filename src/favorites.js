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
let currentUsername = utils.getCurrentUsername()
let currentFavorites = utils.getCurrentFavorites()

function renderFavorites (username) {
  let results = _.template(Items)({items: response.favorites, currentUsername, currentFavorites})
  let markup = _.template(Favorites)({currentUsername, results})
  utils.render(markup, username + '\'s favorites')
  let buttons = document.getElementById('favorites-results').getElementsByTagName('button')
  _.map(buttons, (button) => {
    let imdbID = button.dataset['imdbid']
    if (button.value === 'add') button.onclick = utils.addFavorite(imdbID, () => {
      currentFavorites[imdbID] = 1
      renderFavorites()
    })
    if (button.value === 'remove') button.onclick = utils.deleteFavorite(imdbID, () => {
      currentFavorites[imdbID] = 0
      renderFavorites()
    })
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
    renderFavorites(username)
  })
}
