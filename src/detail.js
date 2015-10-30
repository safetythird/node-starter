'use strict'
let _ = require('lodash')
let omdb = require('./omdb')

let Detail = require('./html/detail.html')

function renderDetail (movie) {
  let markup = _.template(Detail)({movie})
  document.body.innerHTML = markup
  document.title = movie.Title
}

module.exports = function (id) {
  omdb.get(id, (movie) => {
    renderDetail(movie)
  })
}
