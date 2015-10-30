'use strict'
let _ = require('lodash')

let Detail = require('./detail.html')
let Search = require('./search.html')

/*
  Render HTML for the <body> using lodash templating
*/

module.exports = {
  search (data) {
    return _.template(Search)(data)
  },
  detail (data) {
    return _.template(Detail)(data)
  }
}
