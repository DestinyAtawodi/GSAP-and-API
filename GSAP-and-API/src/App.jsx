import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
    
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP,ScrollTrigger);

const App = () => {
  const [count, setCount] = useState(0)

  return (
    <>
        <section>
         <h1 className="bg-blue-500 text-white p-4"> ADEV Crypto Tracker</h1>
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
