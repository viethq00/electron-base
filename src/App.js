import Login from '../src/pages/Login/Login'
import Home from '../src/pages/Home/Home'
import SideBar from '../src/components/sidebar/Sidebar'
import '../src/App.css'
import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  const [navVisible, showNavbar] = useState(false)
  return (
    <div className="App">
      <BrowserRouter>
        {/* <SideBar visible={navVisible} show={showNavbar} /> */}
        <Routes>
          <Route exact path="/" element={<Login />} />
        </Routes>
        <div>
          <Routes>
            <Route exact path="/home" element={<Home />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
