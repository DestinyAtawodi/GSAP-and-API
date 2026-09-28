import { useState } from 'react'
import './App.css'
import { gsap } from 'gsap'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <section className='bg-black h-screen flex justify-center items-center'>
      <h1 className='text-white text-3xl font-bold'>Hello GSAP</h1>
      <br />
      <p className='text-white text-2xl font-bold'>Count: {count}</p>
      <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={() => {
        setCount(count + 1)
        gsap.fromTo('h1', { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1 })
      }}>Increment</button>
     </section>

     <section className='bg-gray-800 h-screen flex justify-center items-center'>
      <h1 className='text-white text-3xl font-bold'>Hello GSAP</h1>
      <br />
      <p className='text-white text-2xl font-bold'>Count: {count}</p>
      <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={() => {
        setCount(count + 1)
        gsap.fromTo('h1', { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1 })
      }}>Increment</button>
     </section>
    </>
  )
}

export default App
