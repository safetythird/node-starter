/*
  Render the favorites page and handle interactions
*/

'use strict'

let _ = require('lodash')
let api = require('./api')
let render = require('./utils').render
let Favorites = require('./html/favorites.html')
let Items = require('./html/items.html')

function renderFavorites (username, rsp) {
  let results = _.template(Items)({items: rsp.items})
  let markup = _.template(Favorites)({username, results})
  render(markup, username + "'s favorites")
}

module.exports = function (username) {
  /*
    Fetch the user's favorites and render the result
  */
  api.getFavorites(username, (rsp) => {
    renderFavorites(username, rsp)
  })
}
