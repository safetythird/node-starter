'use strict'
let $ = require('jquery')

const omdbUrl = 'http://www.omdbapi.com'

module.exports = {
  search (title, callback) {
    let data = {
      s: title,
      r: 'json'
    }
    $.ajax(omdbUrl, {data: data}).done(callback)
  },
  get (id, callback) {
    $.ajax(omdbUrl, {data: {i: id}}).done(callback)
  }
}