import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Axios from 'axios';
    




const App = () => {
const [name, setName] = useState("");


const fetchAge = () => {
  Axios.get(`https://api.agify.io?name=${name}`)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error('Error fetching age:', error);
  });
}

  
  return (
    <>
        <section>
         <h1 className="bg-blue-500 text-white p-4 text-2xl"> ADEV RANDOM AGE GUESS</h1>
        </section>

        <input type="text" placeholder="Enter your name" onChange={(e) => setName(e.target.value)} />
        <br />
        <button
          type="button"
          className="cursor-pointer bg-blue-500 text-white p-4 text-2xl rounded-lg hover:bg-blue-700 transition duration-300 mt-4"
          onClick={fetchAge}
        >
          PREDICT AGE
        </button>
        <h1>Predicted Age: </h1>
     
    </>
  )
}

export default App
