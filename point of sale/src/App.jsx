import { useEffect, useState } from 'react'
import './App.css'
import './styles.css'

function Header() {
  return (
    <div className="header">
      
      <h1>Papelería Papel y Luna</h1>
    </div>
  );
}

function ActionsBar() {
  return (
    <div className="actions-bar">

      {/* Título */}
      <h2>Catálogo de productos</h2>

      <div className="actions-container">

        {/* Barra de búsqueda */}
        <input
          type="text"
          placeholder="Buscar Producto"
          className="search-input"
        />

        {/* Selector de categorías */}
        <select className="category-select">
          <option>Todos</option>
        </select>

        {/* Botones originales */}
        <button className="btn green">+ Agregar producto</button>
        <button className="btn blue">Agregar categoría</button>
        <button className="btn orange">Agregar unidad</button>

      </div>

    </div>
  );
}

function Cart() {
  return (
    <div className="cart">

    
      <h2>Carro de compras</h2>

      {/* Área donde va la info del pedido, pero eso se hace con backend */}
      <div className="cart-empty">
        {/* Aquí luego aparecerán los productos */}
      </div>

      {/* Botón de pago */}
      <button className="pay-btn">
        REALIZAR PAGO
      </button>

    </div>
  );
}

function ProductGrid() {
  return (
    <div className="product-grid">
      {/* Faltan poner los prductos, aca esta el div y la clase para eso :D */}
    </div>
  );
}

function App() {
  return (
    <div className="app-container">

      <Header />

      <div className="main-content">

        <div className="catalogo">
          <ActionsBar />
          <ProductGrid />
        </div>

        <Cart />

      </div>

    </div>
  );
}

export default App
