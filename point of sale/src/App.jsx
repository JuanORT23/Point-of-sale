import { useEffect, useState } from 'react'
import './App.css'

function Bton({ value, handleCkick }) {
  return (
    <button onClick={handleCkick}>
      {value}
    </button>
  )
}

export default function App() {

  const [product, setProduct] = useState({
    id: "",
    name: "",
    category: "",
    price: 0,
    stock: 0
  })

  const setId = (event) => {
    setProduct({...product, id: event.target.value})
  }


  const setName = (event) => {
    setProduct({...product, name: event.target.value})
  }


  const setCategory = (event) => {
    setProduct({...product, category: event.target.value})
  }


  const setPrice = (event) => {
    setProduct({...product, price: event.target.value})
  }


  const setSotck = (event) => {
    setProduct({...product, stock: event.target.value})
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(product)
    fetch("https://script.google.com/macros/s/AKfycbwXHJPioyJePjP0zZcj5bqwpATv6tqvShyMgzDFYU7o0mwbipxST6yKU1c8PALpA-DVJg/exec?resource=productos", {
      method:  "POST", 
      mode: "no-cors",
      headers: {"content-Type": "application/json"},
      body: JSON.stringify(product)
    })
  }

  return(
    <div className='formulario'>
        <form onSubmit={handleSubmit}>
          <label htmlFor="idProducto"> Id </label>
          <input type="text" id='idProducto' onChange={setId}/>
          <label htmlFor="nombreProducto"> Nombre Producto </label>
          <input type="text" id='nombreProducto' onChange={setName}/>
          <label htmlFor="categoriaProducto"> Categoria Producto </label>
          <input type="text" id='categoriaProducto' onChange={setCategory}/>
          <label htmlFor="precioProducto"> Precio Producto </label>
          <input type="number" id='precioProducto' onChange={setPrice}/>
          <label htmlFor="stockProducto"> Stock Producto </label>
          <input type="number" id='stockProducto' onChange={setSotck}/>
          <Bton value={"Enviar"}></Bton>
        </form>
    </div>
  )
}
