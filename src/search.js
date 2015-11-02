/*
  Render the search page and handle interactions
*/

'use strict'

let _ = require('lodash')
let api = require('./api')
let omdb = require('./omdb')
let utils = require('./utils')
let Search = require('./html/search.html')
let Items = require('./html/items.html')

const hashregex = /^#(.+)/

let query = ''
let response = []
let responseMap = {}
let currentUsername = utils.getCurrentUsername()
let currentFavorites = utils.getCurrentFavorites()

function runSearch () {
  if (query && query.length > 0) {
    omdb.search(query, (rsp) => {
      response = rsp.Search || []
      responseMap = _.reduce(response, (last, curr) => {
        last[curr.imdbID] = curr
        return last
      }, {})
      renderSearch()
    })
  } else {
    renderSearch()
  }
}

function formSearch (ev) {
  /*
    Execute search based on the value of the text input field
  */
  ev.preventDefault()
  query = document.getElementById('search-form-title').value
  window.location.hash = query
  runSearch()
}

function addFavorite (imdbID) {
  return function (ev) {
    ev.preventDefault()
    if (imdbID) {
      api.addFavorite(responseMap[imdbID], (rsp) => {
        console.log(rsp)
      })
      currentFavorites[imdbID] = 1
      renderSearch()
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
      renderSearch()
    }
  }
}

function renderSearch () {
  let results = _.template(Items)({items: response, currentUsername, currentFavorites})
  let markup = _.template(Search)({query, results})
  utils.render(markup, 'Search OMDB')
  document.getElementById('search-form').onsubmit = formSearch
  let buttons = document.getElementById('search-results').getElementsByTagName('button')
  _.map(buttons, (button) => {
    if (button.value === 'add') button.onclick = addFavorite(button.dataset['imdbid'])
    if (button.value === 'remove') button.onclick = deleteFavorite(button.dataset['imdbid'])
  })
}

module.exports = function () {
  // Initialize the search page based on the hash. Only do this once per page load
  let q = hashregex.exec(window.location.hash)
  query = q && q[1]
  runSearch()
}