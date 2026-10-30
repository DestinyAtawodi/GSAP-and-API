import { useState } from 'react'
import { useEffect } from 'react'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

        <section>
          <h1>GSAP and API</h1>
          <p></p>
        </section>
    
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
     
    </>
  )
}

export default App
