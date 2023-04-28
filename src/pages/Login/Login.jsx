import React, { useState } from 'react'

import '../Login/style.css'

const Login = bridge => {
  // React States
  const [errorMessages, setErrorMessages] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  // User Login info
  const database = [
    {
      username: 'user1',
      password: 'pass1'
    },
    {
      username: 'user2',
      password: 'pass2'
    }
  ]

  const errors = {
    uname: 'Invalid username',
    pass: 'Invalid password'
  }

  const handleSubmit = event => {
    //Prevent page reload
    event.preventDefault()

    let username = document.getElementById('username').value
    let password = document.getElementById('password').value

    // Find user login info
    const userData = database.find(user => user.username === username)

    // Compare user info
    if (userData) {
      if (userData.password !== password) {
        // Invalid password
        setErrorMessages({ name: 'pass', message: errors.pass })
      } else {
        setIsSubmitted(true)
      }
    } else {
      // Username not found
      setErrorMessages({ name: 'uname', message: errors.uname })
    }
  }

  // Generate JSX code for error message
  const renderErrorMessage = name =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    )

  // JSX code for login form

  const renderFormLogin = (
    <div className="center">
      <h1>Login</h1>
      <form method="post" onSubmit={handleSubmit}>
        <div className="txt_field">
          <input id="username" name="username" type="text" required />
          <span></span>
          <label>Username</label>
          {renderErrorMessage('uname')}
        </div>
        <div className="txt_field">
          <input id="password" name="password" type="password" required />
          <span></span>
          <label>Password</label>
          {renderErrorMessage('pass')}
        </div>
        <div className="pass">Forgot Password?</div>
        <button
          id="login"
          type="submit"
          value="Login"
          onClick={() => {
            window.loginBridge.loginTool('loginTool', {
              username: document.getElementById('username').value,
              password: document.getElementById('password').value
            })
          }}
        >
          Login
        </button>
        <div className="signup_link"></div>
      </form>
    </div>
  )

  return (
    <div className="app">
      <div className="login-form">
        <div className="title">
          <h1 className="sub-title">ELECTRON</h1>
        </div>
        {isSubmitted
          ? window.location.replace('http://localhost:3000/home')
          : renderFormLogin}
      </div>
    </div>
  )
}

export default Login
