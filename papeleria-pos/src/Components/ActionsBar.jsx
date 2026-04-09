import React from "react";

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
          <option>Escolar</option>
          <option>Arte</option>
          <option>Manualidades</option>
          <option>Escritura</option>
          <option>Alimentos</option>
        </select>

        {/* Botones originales */}
        <button className="btn green">+ Agregar producto</button>
        <button className="btn blue">Agregar categoría</button>
        <button className="btn orange">Agregar unidad</button>

      </div>

    </div>
  );
}

export default ActionsBar;