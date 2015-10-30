'use strict'
let search = require('./src/search')
let detail = require('./src/detail')

const searchRegex = /^\/$/
const detailRegex = /^\/detail\/([a-z0-9]+)\/?$/
const hashregex = /^#(.+)/

function init () {
  /*
    Permform routing and load initial state
  */
  let route = window.location.pathname
  if (searchRegex.test(route)) {
    // Initialize the search page based on the hash. Only do this once per page load
    let q = hashregex.exec(window.location.hash)
    search(q && q[1])
  } else if (detailRegex.test(route)) {
    let id = detailRegex.exec(route)[1]
    detail(id)
  }
}

document.addEventListener('DOMContentLoaded', init)