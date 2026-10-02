import React from 'react'
import gsap from 'gsap'

const Hero = () => {
 
  return (
    <div>
        <div className='hero flex flex-col items-center justify-center h-screen bg-gray-800 text-white mt-1'>
        <h1 className='text-5xl font-bold mb-4'>RALPH LAUREN</h1>
        <p className='text-lg mb-8'>Luxury Clothing for Modern People</p>
        <button className='bg-white text-blue-500 px-6 py-3 rounded-full hover:bg-blue-500 hover:text-white transition duration-300'>Get Started</button>
        </div>
    </div>
  )
}

export default Hero