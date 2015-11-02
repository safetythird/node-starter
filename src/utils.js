/*
  Utility functions used by the rest of the app
*/

'use strict'

let _ = require('lodash')

module.exports = {
  render (markup, title) {
    document.getElementById('content').innerHTML = markup
    document.title = title
  },
  getCurrentUsername () {
    let elem = document.getElementById('user-data')
    return elem.dataset.username || ''
  },
  getCurrentFavorites () {
    let favorites = document.getElementById('user-data').dataset.favorites
    if (favorites === undefined) return []
    return _.reduce(favorites.split(','), (last, curr) => {
      last[curr] = 1
      return last
    }, {})
  }
}
