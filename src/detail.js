/*
  Render the movie detail page and handle interactions
*/

'use strict'

let _ = require('lodash')
let omdb = require('./omdb')
let render = require('./utils').render
let Detail = require('./html/detail.html')

module.exports = function (id) {
  omdb.get(id, (movie) => {
    let markup = _.template(Detail)({movie})
    render(markup, movie.Title)
  })
}
