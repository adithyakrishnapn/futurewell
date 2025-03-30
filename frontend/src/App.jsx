import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Signup from './pages/Signup/Signup'
import Login from './pages/Login/Login'
import CheckHealth from './pages/CheckHealth/CheckHealth'
import Profile from './pages/Profile/Profile'
import About from './pages/About/About'
function App() {

  return (
    <>
      <Navbar />

      <Routes>
        <Route path='/' element={
          <Home />
        }></Route>
        <Route path='/signup' element={
          <Signup />
        }></Route>
        <Route path='/login' element={
          <Login />
        }></Route>
        <Route path='/check-health' element={
          <CheckHealth />
        }></Route>
        <Route path='/profile' element={
          <Profile />
        }></Route>
        <Route path='/about' element={
          <About />
        }></Route>
      </Routes>


      <Footer />
    </>
  )
}

export default App
