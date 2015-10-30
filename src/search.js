'use strict'
let _ = require('lodash')
let omdb = require('./omdb')
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

function initSearch () {
  /*
    Tell the form element to use formsearch() instead of its default onsubmit action
  */
  document.getElementById('search-form').onsubmit = formSearch
}

function renderSearch (query, rsp) {
  let results = _.template(Items)({items: rsp.Search})
  let markup = _.template(Search)({query, results})
  document.body.innerHTML = markup
  document.title = 'Search OMDB'
  initSearch()
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