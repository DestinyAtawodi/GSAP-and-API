import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Axios from 'axios';
    




const App = () => {
 const [generatedExcuse, SetGeneratedExcuse] = useState('')
 const fetchExcuse = (excuse) => {
  Axios.get(`https://excuser.herokuapp.com/v1/excuse/${excuse}/`).then((response) => {
    SetGeneratedExcuse(response.data[0].excuse)
  })
 }

  return (
    <div className="App">
        <h1 className="text-2xl font-bold mb-4">Excuse Generator</h1>
        <button onClick={() => fetchExcuse('family')} className="bg-blue-500 text-white p-2 rounded">Family</button>
        <button onClick={() => fetchExcuse('office')} className="bg-blue-500 text-white p-2 rounded">Office</button>
        <button onClick={() => fetchExcuse('children')} className="bg-blue-500 text-white p-2 rounded">Children</button>
        <button onClick={() => fetchExcuse('college')} className="bg-blue-500 text-white p-2 rounded">College</button>
        <button onClick={() => fetchExcuse('party')} className="bg-blue-500 text-white p-2 rounded">Party</button>
        <h2 className="text-xl font-semibold mt-4">{generatedExcuse}</h2>
    </div>
  )
}

export default App
