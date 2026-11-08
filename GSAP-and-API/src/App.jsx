import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Axios from 'axios';
    




const App = () => {
  const [price, setPrice] = useState(0)

  useEffect(() => {
    Axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
      .then((response) => {
        setPrice(response.data.bitcoin.usd)
      })
      .catch((error) => {
        console.error('Error fetching Bitcoin price:', error)
      })
  }, [])

  return (
    <>
        <section>
         <h1 className="bg-blue-500 text-white p-4 text-2xl"> ADEV Crypto Tracker</h1>
        </section>
    
        <button
          type="button"
          className="counter"
          onClick={() => alert(`The current price of Bitcoin is $${price}`)}
        >
          btc is ${price}
        </button>
     
    </>
  )
}

export default App
