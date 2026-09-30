import { useState } from 'react'
import './App.css'
import Navbar from  './Componets/Navbar'
import Hero from './Componets/Hero'
import Gsap_Section from './Componets/Gsap_Section'
import Testimonials from './Componets/Testimonials'
import Footer from './Componets/Footer'

function App() {
 

  return (
    <>
      <Navbar />
      <Hero />
      <Gsap_Section />
      <Testimonials />
      <Footer />
    </>
  )
}

export default App
