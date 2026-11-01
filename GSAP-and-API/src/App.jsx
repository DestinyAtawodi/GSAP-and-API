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
          <p> Formatting api request. <br />
          baseUrl/Endpoint-- url is link to api doc, endpoint is the specific data you want to get from the api eg /activity, /joke, /quote, /user. /filter. 
          query parameters-- baseurl/endpoint?query=value
          multiple query parameters-- baseurl/endpoint?query1=value1&query2=value2
          path parameters-- baseurl/endpoint/{path-parameter} it is used to identify a specific resource in the api. eg /user/1234, /user/5678</p>
          http://bored-api.appbrewery.com</p>
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
