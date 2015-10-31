/*
  The main client-side application. Permform routing and load initial state
*/

'use strict'

let search = require('./src/search')
let detail = require('./src/detail')
let login = require('./src/login')
let favorites = require('./src/favorites')

const searchRegex = /^\/$/
const hashregex = /^#(.+)/
const detailRegex = /^\/detail\/([a-z0-9]+)\/?$/
const loginRegex = /^\/login\/?$/
const favoritesRegex = /^\/favorites\/([a-zA-Z0-9]+)$/

function init () {
  let route = window.location.pathname
  if (searchRegex.test(route)) {
    // Search page
    // Initialize the search page based on the hash. Only do this once per page load
    let q = hashregex.exec(window.location.hash)
    search(q && q[1])
  } else if (detailRegex.test(route)) {
    // Detail page
    let id = detailRegex.exec(route)[1]
    detail(id)
  } else if (loginRegex.test(route)) {
    // Signup page
    login()
  } else if (favoritesRegex.test(route)) {
    // Favorites page
    let username = favoritesRegex.exec(route)[1]
    favorites(username)
  }
}

// Fire when the page finishes loading
document.addEventListener('DOMContentLoaded', init)