import { useState } from 'react'
import { useEffect } from 'react'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

        <section>
          <h1>GSAP and API</h1>
          <p>api is the rule that defines how different software interact with eachother eg your website to automated weather dataopen weather<br />
          types od api: graphql, restapi, soap, grpc</p>
          <p> best case for web dev is restful api for now, uses http protocol to make requests. We can use postman to test api skill/ http request instead of building website</p>
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
