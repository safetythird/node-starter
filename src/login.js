/*
  Render the login/signup page and handle interactions
*/

'use strict'

let _ = require('lodash')
let render = require('./utils').render
let api = require('./api')
let utils = require('./utils')
let Login = require('./html/login.html')

function formLogin (ev) {
  /*
    Execute login using the internal API
  */
  ev.preventDefault()
  let username = document.getElementById('login-form-name').value
  let password = document.getElementById('login-form-password').value
  api.login(username, password, (rsp) => {
    console.log(rsp)
    if (rsp.error) {
      renderLogin({message: rsp.error})
    } else {
      window.location = '/'
    }
  })
}

function formSignup (ev) {
  /*
    Execute signup using the internal API
  */
  ev.preventDefault()
  let username = document.getElementById('signup-form-name').value
  let password = document.getElementById('signup-form-password').value
  api.signup(username, password, (rsp) => {
    console.log(rsp)
    if (rsp.error) {
      renderLogin({message: rsp.error})
    } else {
      window.location = '/'
    }
  })
}

function renderLogin (data) {
  let markup = _.template(Login)(data)
  render(markup, 'Login or Sign Up')
  document.getElementById('login-form').onsubmit = formLogin
  document.getElementById('signup-form').onsubmit = formSignup
}

module.exports = function () {
  if (utils.getCurrentUsername()) {
    window.location = '/'
  }
  renderLogin({message: null})
}