import React from 'react'
import gsap from 'gsap'


const Navbar = () => {
  return (
    <div className='navbar flex justify-between items-center px-10 py-5  text-black shadow-lg  backdrop-blur-sm sticky top-0 z-50 '>
        <img src='https://res.cloudinary.com/kzekjix6/image/upload/v1790868359/rlp_1.png' alt='Logo' className='h-10' />
      <div className='nav-links flex space-x-5'>
        <a href='#' className='hover:text-blue-400'>Home</a>
        <a href='#' className='hover:text-blue-400'>Models</a>
        <a href='#' className='hover:text-blue-400'>Contact</a>
      </div>
    </div>
  )
}

export default Navbar