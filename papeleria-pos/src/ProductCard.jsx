import React from "react";

function ProductCard({ producto, carrito, setCarrito }) {

  // Función para agregar al carrito
  const agregarProducto = () => {

    // Copia del carrito
    const nuevoCarrito = [...carrito];

    // Buscar si ya existe
    const index = nuevoCarrito.findIndex(p => p.id === producto.id);

    if (index !== -1) {
      nuevoCarrito[index].cantidad = nuevoCarrito[index].cantidad + 1;
    } else {
      nuevoCarrito.push({ ...producto, cantidad: 1 });
    }

    setCarrito(nuevoCarrito);
  };

  return (
    <div className="product-card">

      <h4>{producto.nombre}</h4>
      <p>${producto.precio}</p>

      {/* Botón azul */}
      <button className="btn-add" onClick={agregarProducto}>
        +
      </button>

    </div>
  );
}

export default ProductCard;