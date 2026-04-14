import { use, useEffect, useState } from 'react'
import './App.css'
import './styles.css'

function Boton({ value }) {
  return (
    <button>{value}</button>
  )
}
function Header() {
  return (
    <div className="header">

      <h1>Papelería Papel y Luna</h1>
    </div>
  );
}

function ActionsBar({ cambiarVista }) {
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
        <button className="btn green" onClick={() => cambiarVista("agregarProducto")}>+ Agregar producto</button>
        <button className="btn blue" onClick={() => cambiarVista("agregarCategoria")}>+ Agregar categoría</button>
        <button className='btn orange' onClick={() => cambiarVista("eliminarCategoria")}> - Eliminar categoría </button>
      </div>

    </div>
  );
}

function ProductGrid({ eliminarProducto, agregarAlCarrito }) {
  const [productos, setProductos] = useState([])

  useEffect(() => {
    async function getData() {
      const dataBase = await fetch("https://script.google.com/macros/s/AKfycbxYfKGwGDYigSP__Tj-2A98hvwvQRrBXJOPHkPykLhPtCMpeYxu6dUxdrevT4ep1q4wnw/exec?resource=productos", {
        method: "GET"
      })
      const response = await dataBase.json()
      setProductos(response.data)
    }
    getData()
  }, [])

  return (
    <div className="product-grid">
      {/* Faltan poner los prductos, aca esta el div y la clase para eso :D */}
      {productos.map((producto) => {
        return (
          <div className='boxProduct' key={producto.id}>
            <p className='textBox'>{producto.name}</p>
            <p className='textBox'>{producto.category}</p>
            <p className='textBox'>{producto.stock}</p>
            <div className='btnesDisposi'>
              <span className='contentPrice'>{producto.price}</span>
              <button className='btonPlus' onClick={() => agregarAlCarrito(producto)}> + </button>
            </div>
            <div className='btonesMoldearProdcuto'>
              <button className='btonModifPorducto'> Modificar </button>
              <button className='btonDelProducto' onClick={() => eliminarProducto(producto.id)}> Eliminar </button>
            </div>
          </div>
        )
      })}
    </div>
  );
}

function Cart({ carrito, sumarAlCarrito, restarDelCarrito, eliminarDelCarrito }) {
  // Calculamos el total
  const total = carrito.reduce((acumulador, item) => acumulador + (item.price * item.cantidad), 0);

  return (
    <div className="cart">
      <h2>Carro de compras</h2>

      <div className="cart-empty" style={{ padding: '10px', overflowY: 'auto' }}>
        {carrito.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'gray' }}>El carrito está vacío</p>
        ) : (
          carrito.map((item, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #ccc', padding: '10px 0', gap: '5px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>{item.name}</span>
                <span>${item.price * item.cantidad}</span>
              </div>
              
              {/* Controles de cantidad y eliminar */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button onClick={() => restarDelCarrito(item.id)} className="btonRest">-</button>
                <span>{item.cantidad}</span>
                <button onClick={() => sumarAlCarrito(item)} className="btonPlus">+</button>
                
                <button 
                  onClick={() => eliminarDelCarrito(item.id)} 
                  style={{ marginLeft: 'auto', backgroundColor: '#e82626', color: 'white', border: 'none', borderRadius: '5px', padding: '2px 8px', cursor: 'pointer' }}
                >
                  Quitar
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      <div style={{ padding: '10px', textAlign: 'right' }}>
        <h3>Total: ${total}</h3>
      </div>
      <button className="pay-btn">
        REALIZAR PAGO
      </button>

    </div>
  );
}

function FormularioAgregarCategoria({ cambiarVista }) {
  const [categoria, setCategoria] = useState({
    id: "",
    name: ""
  })

  const setId = (event) => {
    setCategoria({ ...categoria, id: event.target.value })
  }

  const setName = (event) => {
    setCategoria({ ...categoria, name: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    fetch("https://script.google.com/macros/s/AKfycbxYfKGwGDYigSP__Tj-2A98hvwvQRrBXJOPHkPykLhPtCMpeYxu6dUxdrevT4ep1q4wnw/exec?resource=categorias", {
      method: "POST",
      mode: "no-cors",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify(categoria)
    })
    setCategoria({ ...categoria, name: "", id: "" })
  }
  return (
    <div className='contenedorForm'>
      <h1 className='formTittle'> Describe la nueva categoria</h1>
      <form onSubmit={handleSubmit} className='form'>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' autoComplete='off' required='on' onChange={setId} value={categoria.id} />
          <span className='formText'>Ingresa El Codigo de la categoria</span>
        </label>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' autoComplete='off' required='on' onChange={setName} value={categoria.name} />
          <span className='formText'>Ingresa el nombre de la categoria</span>
        </label>
        <div className='contentBtonForms'>
          <button className='btonAdd'> Crear </button>
          <button onClick={() => cambiarVista("appPrincipal")} type='button' className='btonBack'> Volver </button>
        </div>
      </form>
    </div>
  )
}

function FormularioAgregarProducto({ cambiarVista }) {
  const [product, setProduct] = useState({
    id: "",
    name: "",
    category: "",
    price: 0,
    stock: 0
  })

  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    async function getData() {
      const dataBase = await fetch("https://script.google.com/macros/s/AKfycbxYfKGwGDYigSP__Tj-2A98hvwvQRrBXJOPHkPykLhPtCMpeYxu6dUxdrevT4ep1q4wnw/exec?resource=categorias", {
        method: "GET",
      })
      const response = await dataBase.json()
      setCategorias(response.data)
    }
    getData()
  }, [])

  const setId = (event) => {
    setProduct({ ...product, id: event.target.value })
  }

  const setName = (event) => {
    setProduct({ ...product, name: event.target.value })
  }

  const setCategory = (event) => {
    setProduct({ ...product, category: event.target.value })
  }

  const setPrice = (event) => {
    setProduct({ ...product, price: event.target.value })
  }

  const setSotck = (event) => {
    setProduct({ ...product, stock: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    fetch("https://script.google.com/macros/s/AKfycbxYfKGwGDYigSP__Tj-2A98hvwvQRrBXJOPHkPykLhPtCMpeYxu6dUxdrevT4ep1q4wnw/exec?resource=productos", {
      method: "POST",
      mode: "no-cors",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify(product)
    })

    setProduct({ ...product, id: "", name: "", category: "", price: "", stock: "" })
  }

  return (
    <div className='contenedorForm'>
      <h1 className='formTittle'>Describe el nuevo producto</h1>
      <form className='form' onSubmit={handleSubmit}>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setId} value={product.id} />
          <span className='formText'> Ingresa el codigo del producto nuevo </span>
        </label>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setName} value={product.name} />
          <span className='formText'> Ingresa el nombre del producto nuevo </span>
        </label>
        <label className='formLabel'>
          <select className='formInput' value={product.category} onChange={setCategory} autoComplete='off' required="on" placeholder=" ">
            <option> - </option>
            {categorias.map((categoria) => {
              return (
                <option key={categoria.id}>{categoria.name}</option>
              )
            })}
          </select>
          <span className='formText'> Seleccione una categoria</span>
        </label>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setPrice} value={product.price} />
          <span className='formText'> Ingresa el precio del producto nuevo </span>
        </label>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setSotck} value={product.stock} />
          <span className='formText'> Ingresa el stock del producto nuevo </span>
        </label>
        <div className='contentBtonForms'>
          <button className='btonAdd'> Crear </button>
          <button onClick={() => cambiarVista("appPrincipal")} type='button' className='btonBack'> Volver </button>
        </div>
      </form>
    </div>
  )
}

function FormularioEliminarCategoria({ cambiarVista }) {

    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("")

  function eliminarCategoria(idCode) {
    fetch(`https://script.google.com/macros/s/AKfycbxYfKGwGDYigSP__Tj-2A98hvwvQRrBXJOPHkPykLhPtCMpeYxu6dUxdrevT4ep1q4wnw/exec?resource=categorias&idCode=${idCode}`, {
      method: "POST",
      mode: "no-cors"
    })

    setCategoriaSeleccionada("")
  }

  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    async function getData() {
      const dataBase = await fetch("https://script.google.com/macros/s/AKfycbxYfKGwGDYigSP__Tj-2A98hvwvQRrBXJOPHkPykLhPtCMpeYxu6dUxdrevT4ep1q4wnw/exec?resource=categorias", {
        method: "GET",
      })
      const response = await dataBase.json()
      setCategorias(response.data)
    }
    getData()
  }, [])

  return (
    <div className='contenedorForm'>
      <h1 className='formTittle'> Seleccione la categoría que desea eliminar </h1>
      <form className='form' onSubmit={() => eliminarCategoria(categoriaSeleccionada)}>
        {categorias.map((categoria) => {
          return (
            <label key={categoria.id}>
              <input type="radio" name="categorias" value={categoria.id} onChange={(event) => setCategoriaSeleccionada(event.target.value)} checked={ categoriaSeleccionada == String(categoria.id)}/>
              {categoria.name}
            </label>
          )
        })}
        <div className='contentBtonForms'>
          <button className='btonAdd '> Eliminar </button>
          <button className='btonBack' type='button' onClick={() => cambiarVista("appPrincipal")}> Volver </button>
        </div>
      </form>
    </div>
  )
}

function App() {
  const [vista, setVista] = useState("appPrincipal")
  const[carrito, setCarrito] = useState([])

  function cambiarVista(vista) {
    setVista(vista)
  }

  async function eliminarProducto(idProducto) {
    const deleteData = await fetch(`https://script.google.com/macros/s/AKfycbxYfKGwGDYigSP__Tj-2A98hvwvQRrBXJOPHkPykLhPtCMpeYxu6dUxdrevT4ep1q4wnw/exec?resource=productos&idCode=${idProducto}`, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({})
    })
    console.log(deleteData)
  }

  const agregarAlCarrito = (productoAAgregar) => {
    setCarrito((carritoActual) => {
      const existe = carritoActual.find((item) => item.id === productoAAgregar.id);
      if(existe){
        return carritoActual.map((item)=>
        item.id === productoAAgregar.id
        ? {...item, cantidad: item.cantidad + 1}
        : item
      );
      } else {
        return[...carritoActual,  {...productoAAgregar, cantidad: 1}];
      }
    });
  }
  
  const restarDelCarrito = (idProducto) => {
    setCarrito((carritoActual) => {
      return carritoActual.map((item) => {
        // Si es el producto que queremos restar y su cantidad es mayor a 1
        if (item.id === idProducto && item.cantidad > 1) {
          return { ...item, cantidad: item.cantidad - 1 };
        }
        return item; // Si es 1, lo dejamos igual (para eso usarán el botón eliminar)
      });
    });
  }

  const eliminarDelCarrito = (idProducto) => {
    setCarrito((carritoActual) => 
      // filter crea un nuevo arreglo SOLO con los productos que NO coincidan con el id
      carritoActual.filter((item) => item.id !== idProducto)
    );
  }

  return (
    <div className="app-container">
      {vista === "agregarProducto" &&
        <FormularioAgregarProducto cambiarVista={cambiarVista} />
      }
      {vista === "agregarCategoria" &&
        <FormularioAgregarCategoria cambiarVista={cambiarVista} />
      }
      {vista === "eliminarCategoria" &&
        <FormularioEliminarCategoria cambiarVista={cambiarVista} />
      }
      {vista === "appPrincipal" &&
        <div>
          <Header />
          <div className="main-content">
            <div className="catalogo">
              <ActionsBar cambiarVista={cambiarVista} />
              <ProductGrid eliminarProducto={eliminarProducto} agregarAlCarrito={agregarAlCarrito} />
            </div>
            <div>
              <Cart carrito={carrito}
              sumarAlCarrito={agregarAlCarrito}
              restarDelCarrito={restarDelCarrito}
              eliminarDelCarrito={eliminarDelCarrito}
              />
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default App
