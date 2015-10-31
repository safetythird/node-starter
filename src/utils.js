/*
  Utility functions used by the rest of the app
*/

'use strict'

module.exports = {
  render (markup, title) {
    document.getElementById('content').innerHTML = markup
    document.title = title
  },
  getCurrentUser () {
    username = document.getElementById('username-data').data-username
    favorites = document.getElementById('favorites-data').data-favorites
    return {username, favorites}
  }
}
