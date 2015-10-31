/*
  Render the login/signup page and handle interactions
*/

'use strict'

let _ = require('lodash')
let render = require('./utils').render
let api = require('./api')
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
      renderSignup({message: rsp.error})
    } else {
      // Navigate to the home page on successful login
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
      renderSignup({message: rsp.error})
    } else {
      renderSignup({message: "Created " + rsp.created})
    }
  })
}

function renderSignup (data) {
  let markup = _.template(Login)(data)
  render(markup, 'Login or Sign Up')
  document.getElementById('login-form').onsubmit = formLogin
  document.getElementById('signup-form').onsubmit = formSignup
}

module.exports = function () {
  renderSignup({message: null})
}