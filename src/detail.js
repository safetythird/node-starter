/*
  Render the movie detail page and handle interactions
*/

'use strict'

let _ = require('lodash')
let omdb = require('./omdb')
let utils = require('./utils')
let Detail = require('./html/detail.html')

let currentUsername = utils.getCurrentUsername()
let currentFavorites = utils.getCurrentFavorites()

let movie = {}

function renderDetails () {
  let markup = _.template(Detail)({movie, currentFavorites, currentUsername})
  utils.render(markup, movie.Title)
  let buttons = document.getElementById('detail').getElementsByTagName('button')
  let button = buttons && buttons[0]
  if (button && button.value === 'add') button.onclick = utils.addFavorite(movie, () => {
    currentFavorites[movie.imdbID] = 1
    renderDetails()
  })
  if (button.value === 'remove') button.onclick = utils.deleteFavorite(movie.imdbID, () => {
    currentFavorites[movie.imdbID] = 0
    renderDetails()
  })
}

module.exports = function (id) {
  omdb.get(id, (m) => {
    movie = m
    renderDetails()
  })
}
