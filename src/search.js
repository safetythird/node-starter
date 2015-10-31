/*
  Render the search page and handle interactions
*/

'use strict'

let _ = require('lodash')
let omdb = require('./omdb')
let render = require('./utils').render
let Search = require('./html/search.html')
let Items = require('./html/items.html')

function formSearch (ev) {
  /*
    Execute search based on the value of the text input field
  */
  ev.preventDefault()
  let q = document.getElementById('search-form-title').value
  window.location.hash = q
  runSearch(q)
}

function renderSearch (query, rsp) {
  let results = _.template(Items)({items: rsp.Search})
  let markup = _.template(Search)({query, results})
  render(markup, 'Search OMDB')
  document.getElementById('search-form').onsubmit = formSearch

}

function runSearch (q) {
  /*
    Perform a search and render the result
  */
  if (q && q.length > 0) {
    omdb.search(q, (rsp) => {
      renderSearch(q, rsp)
    })
  } else {
    renderSearch('', [])
  }
}

module.exports = runSearch