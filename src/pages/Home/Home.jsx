import React, { useState } from 'react'
const Pusher = require('pusher-js')
import '../Home/style.css'
const Home = () => {
  const openChrome = (
    <div>
      <button
        id="login"
        type="submit"
        value="Login"
        onClick={() => {
          window.homeBridge.openChrome('openChrome')
        }}
      >
        Open Chrome
      </button>
    </div>
  )

  return <div className="">{openChrome}</div>
}

export default Home
