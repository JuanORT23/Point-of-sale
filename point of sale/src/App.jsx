import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import './App.css'
import './styles.css'

function Boton({ value }) {
  return (
    <button>{value}</button>
  )
}
function Header({ cambiarVista, valorVista }) {

  const [tabActivo, setTabActivo] = useState(valorVista)


  const tabs = ["Venta", "Historial de ventas", "Clientes", "Proveedores", "Compras"]

  return (
    <div className="header">
      <h1>Papelería Papel y Luna</h1>

      {/* Contenedor de los tabs de navegación */}
      <div className="header-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            // Si el tab está activo, aplica la clase "tab-activo" que lo pone blanco con letra negra
            className={`header-tab ${tabActivo === tab ? "tab-activo" : ""}`}
            onClick={() => {
              setTabActivo(tab)
              cambiarVista(tab)
            }
            }
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}

function HistorialVentasGrid() {
  return (

    <div className="catalogo">
      {/* Barra superior con título y filtro */}
      <div className="actions-bar">
        <h2>Historial de Ventas</h2>
        <div className="actions-container">
          <select className="category-select">
            <option>Todos</option>
          </select>
        </div>
      </div>
      <div className="product-grid">
      </div>
    </div>
  )
}

function ClientesGrid() {
  return (
    <div className="catalogo">

      <div className="actions-bar">
        <h2>Clientes</h2>
        <div className="actions-container">
          <button className="btn green">+ Agregar Cliente</button>
          <select className="category-select">
            <option>Todos</option>
          </select>
        </div>
      </div>

      <div className="product-grid">
        {/* Aqui toca meter los clientes con backend porfaaaaaaa */}
      </div>

    </div>
  )
}

function ProveedoresGrid() {
  return (
    <div className="catalogo">

      <div className="actions-bar">
        <h2>Proveedores</h2>
        <div className="actions-container">
          <button className="btn green">+ Agregar Proveedor</button>
          <select className="category-select">
            <option>Todos</option>
          </select>
        </div>
      </div>

      <div className="product-grid">
        {/* LO MISMOOOOO, llenar los proveedores con backend acaaaa */}
      </div>

    </div>
  )
}

function ComprasGrid() {
  return (
    <div className="catalogo">
      <div className="actions-bar">
        <h2>Compras</h2>
        <div className="actions-container">
          <select className="category-select">
            <option>Todos</option>
          </select>
        </div>
      </div>
      <div className="product-grid">
        {/* LAS COmpras la llenas con backeeeend */}
      </div>

    </div>
  )
}

function ActionsBarVenta({ cambiarVista, setCategoriaFiltro, categoriaFiltro, busqueda, setBusqueda }) {
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    async function getData() {
      const dataBase = await fetch("https://script.google.com/macros/s/AKfycbxYfKGwGDYigSP__Tj-2A98hvwvQRrBXJOPHkPykLhPtCMpeYxu6dUxdrevT4ep1q4wnw/exec?resource=categorias", {
        method: "GET"
      })
      const response = await dataBase.json()
      setCategorias(response.data)
    }
    getData()
  }, [])

  return (
    <div className="actions-bar">
      <h2>Catálogo de productos</h2>
      <div className="actions-container">

        <input
          type="text"
          placeholder="Buscar Producto"
          className="search-input"
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          className="category-select"
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
        >
          <option value="Todos">Todos</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.name}>{categoria.name}</option>
          ))}
        </select>

        <button className="btn green" onClick={() => cambiarVista("agregarProducto")}>+ Agregar producto</button>
        <button className="btn blue" onClick={() => cambiarVista("agregarCategoria")}>+ Agregar categoría</button>
        <button className='btn orange' onClick={() => cambiarVista("eliminarCategoria")}> - Eliminar categoría </button>
      </div>
    </div>
  );
}
function FormModificarProducto({ cambiarVista, producto }) {
  const [product, setProduct] = useState({
    id: producto.id || "",
    name: producto.name || "",
    category: producto.category || "",
    price: producto.price || 0,
    stock: producto.stock || 0
  })

  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    async function getData() {
      const dataBase = await fetch("https://script.google.com/macros/s/AKfycbx6WJEr9lo_5Y1sFYSGeoMk3Z3Or37epMWBZNpJ-dSg8z2Z4m0Spwp0RphsvxotNNlVPw/exec?resource=categorias", {
        method: "GET",
      })
      const response = await dataBase.json()
      setCategorias(response.data)
    }
    getData()
  }, [])

  const setId = (event) => setProduct({ ...product, id: event.target.value })
  const setName = (event) => setProduct({ ...product, name: event.target.value })
  const setCategory = (event) => setProduct({ ...product, category: event.target.value })
  const setPrice = (event) => setProduct({ ...product, price: event.target.value })
  const setSotck = (event) => setProduct({ ...product, stock: event.target.value })

  const handleSubmit = async (event) => {
    try {
      event.preventDefault()
      fetch(`https://script.google.com/macros/s/AKfycbx6WJEr9lo_5Y1sFYSGeoMk3Z3Or37epMWBZNpJ-dSg8z2Z4m0Spwp0RphsvxotNNlVPw/exec?resource=productos&idCode=${product.id}&action=update`, {
        method: "POST",
        mode: "no-cors",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(product)
      })
      cambiarVista("Venta")
      toast.success("Producto modificado correctamente")
    } catch (error) {
      toast.error("Error al modificar")
    }
  }

  return (
    <div className='contenedorForm'>
      <h1 className='formTittle'>Modifica el producto</h1>
      <form className='form' onSubmit={handleSubmit}>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setId} value={product.id} />
          <span className='formText'> Código del producto </span>
        </label>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setName} value={product.name} />
          <span className='formText'> Nombre del producto </span>
        </label>
        <label className='formLabel'>
          <select className='formInput' value={product.category} onChange={setCategory} autoComplete='off' required="on">
            <option> - </option>
            {categorias.map((categoria) => (
              <option key={categoria.id}>{categoria.name}</option>
            ))}
          </select>
          <span className='formText'> Categoría </span>
        </label>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setPrice} value={product.price} />
          <span className='formText'> Precio </span>
        </label>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setSotck} value={product.stock} />
          <span className='formText'> Stock </span>
        </label>
        <div className='contentBtonForms'>
          <button className='btonAdd'> Guardar cambios </button>
          <button onClick={() => cambiarVista("Venta")} type='button' className='btonBack'> Volver </button>
        </div>
      </form>
    </div>
  )
}

function ProductGrid({ eliminarProducto, cambiarVista, seleccionarProducto, categoriaFiltro, busqueda, refrescar }) {
  const [productos, setProductos] = useState([])
  const [cargando, setCargado] = useState(true)

  useEffect(() => {
    async function getData() {
      const dataBase = await fetch("https://script.google.com/macros/s/AKfycbxYfKGwGDYigSP__Tj-2A98hvwvQRrBXJOPHkPykLhPtCMpeYxu6dUxdrevT4ep1q4wnw/exec?resource=productos", {
        method: "GET"
      })
      const response = await dataBase.json()
      setProductos(response.data)
      setCargado(false)
    }
    getData()
  }, [refrescar])

  const productosFiltrados = productos
    .filter(p => categoriaFiltro === "Todos" || p.category === categoriaFiltro)
    .filter(p => p.name.toLowerCase().includes(busqueda.toLowerCase()))

  return (
    <div className="product-grid">
      {cargando &&
        <div className='loader'>
          <div className='spinner'></div>
        </div>
      }
      {!cargando && productosFiltrados.length === 0 &&
        <div className='isEmpetyCat'>
          <p>No hay productos en esta categoría</p>
        </div>
      }
      {!cargando &&
        productosFiltrados.map((producto) => {
          return (
            <div className='boxProduct' key={producto.id}>
              <p className='textBox'> Producto: {producto.name}</p>
              <p className='textBox'> Categoría: {producto.category}</p>
              <p className='textBox'> Stock: {producto.stock}</p>
              <div className='btnesDisposi'>
                <span className='contentPrice'> ${producto.price} COP</span>
                <button className='btonPlus'> + </button>
              </div>
              <div className='btonesMoldearProdcuto'>
                <button className='btonModifPorducto' onClick={() => {
                  seleccionarProducto(producto)
                  cambiarVista("modificarProducto")
                }}>
                  Modificar
                </button>
                <button className='btonDelProducto' onClick={() => eliminarProducto(producto.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          )
        })
      }
    </div>
  )
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      fetch("https://script.google.com/macros/s/AKfycbx6WJEr9lo_5Y1sFYSGeoMk3Z3Or37epMWBZNpJ-dSg8z2Z4m0Spwp0RphsvxotNNlVPw/exec?resource=categorias", {
        method: "POST",
        mode: "no-cors",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(categoria)
      })
      setCategoria({ ...categoria, name: "", id: "" })
      toast.success("Categoria agregada con exito")
    } catch (error) {
      toast.error("Error al agregar categoria")
    }
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
          <button onClick={() => cambiarVista("Venta")} type='button' className='btonBack'> Volver </button>
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
      const dataBase = await fetch("https://script.google.com/macros/s/AKfycbx6WJEr9lo_5Y1sFYSGeoMk3Z3Or37epMWBZNpJ-dSg8z2Z4m0Spwp0RphsvxotNNlVPw/exec?resource=categorias", {
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await fetch("https://script.google.com/macros/s/AKfycbx6WJEr9lo_5Y1sFYSGeoMk3Z3Or37epMWBZNpJ-dSg8z2Z4m0Spwp0RphsvxotNNlVPw/exec?resource=productos", {
        method: "POST",
        mode: "no-cors",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(product)
      })
      toast.success("Producto agregado correctamente")
      setProduct({ id: "", name: "", category: "", price: 0, stock: 0 })
    } catch (error) {
      toast.error("Error al agregar el producto")
    }
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
          <button onClick={() => cambiarVista("Venta")} type='button' className='btonBack'> Volver </button>
        </div>
      </form>
    </div>
  )
}

function FormularioEliminarCategoria({ cambiarVista }) {

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("")

  const [cargando, setCargado] = useState(true)

  async function eliminarCategoria(idCode) {
    try {
      fetch(`https://script.google.com/macros/s/AKfycbx6WJEr9lo_5Y1sFYSGeoMk3Z3Or37epMWBZNpJ-dSg8z2Z4m0Spwp0RphsvxotNNlVPw/exec?resource=categorias&idCode=${idCode}&action=delete`, {
        method: "POST",
        mode: "no-cors",
      })
      toast.success("Categoria eliminada correctamente")
      setCategoriaSeleccionada("")
    } catch (error) {
      toast.error("Error al eliminar categoria")
    }
  }

  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    async function getData() {
      const dataBase = await fetch("https://script.google.com/macros/s/AKfycbx6WJEr9lo_5Y1sFYSGeoMk3Z3Or37epMWBZNpJ-dSg8z2Z4m0Spwp0RphsvxotNNlVPw/exec?resource=categorias", {
        method: "GET",
      })
      const response = await dataBase.json()
      setCategorias(response.data)
      setCargado(false)
    }
    getData()
  }, [])

  return (
    <div className='contenedorForm'>
      <h1 className='formTittle'> Seleccione la categoría que desea eliminar </h1>
      {cargando &&
        <div className='loader'>
          <div className='spinner'></div>
        </div>
      }
      {!cargando &&
        <form className='form'>
          {categorias.map((categoria) => {
            return (
              <label key={categoria.id}>
                <input type="radio" name="categorias" value={categoria.id} onChange={(event) => setCategoriaSeleccionada(event.target.value)} checked={categoriaSeleccionada == String(categoria.id)} />
                {categoria.name}
              </label>
            )
          })}
        </form>
      }
      <div className='contentBtonForms'>
        <button className='btonAdd ' onClick={() => eliminarCategoria(categoriaSeleccionada)}> Eliminar </button>
        <button className='btonBack' type='button' onClick={() => cambiarVista("Venta")}> Volver </button>
      </div>
    </div>
  )
}

function App() {
  const [vista, setVista] = useState("Venta")

  const [productoSeleccionado, setProductoSeleccionado] = useState(null)

  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos")

  const [busqueda, setBusqueda] = useState("")

  const [refrescar, setRefrescar] = useState(false)

  function refrescarComp() {
    setRefrescar(!refrescar)
  }

  function cambiarBusquedaSeleccionada(nombre) {
    setBusqueda(nombre)
  }

  function cambiarCategoriaSeleccionada(categoria) {
    setCategoriaFiltro(categoria)
  }
  function seleccionarProducto(producto) {
    setProductoSeleccionado(producto)
  }

  function cambiarVista(nuevaVista) {
    setVista(nuevaVista)
    console.log(`Venimos de: ${vista} y pasamos a ${nuevaVista}`)
  }


  async function eliminarProducto(idProducto) {
    try {
      const deleteData = await fetch(`https://script.google.com/macros/s/AKfycbx6WJEr9lo_5Y1sFYSGeoMk3Z3Or37epMWBZNpJ-dSg8z2Z4m0Spwp0RphsvxotNNlVPw/exec?resource=productos&idCode=${idProducto}&action=delete`, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({})
      })
      refrescarComp()
      toast.success("Producto eliminado correctamente")
    } catch (error) {
      toast.error("Error al eliminar producto")
    }
  }
  return (
    <>
      <Toaster position="top-center" />
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
        {vista === "modificarProducto" &&
          <FormModificarProducto cambiarVista={cambiarVista} producto={productoSeleccionado} />
        }
        {vista === "Clientes" &&
          < div >
            <Header cambiarVista={cambiarVista} valorVista={vista} />
            <div className="main-content">
              <div className="Historial de ventas">
                <ClientesGrid />
              </div>
            </div>
          </div>
        }
        {
          vista === "Historial de ventas" &&
          <div>
            <Header cambiarVista={cambiarVista} valorVista={vista} />
            <div className="main-content">
              <div className="Historial de ventas">
                <HistorialVentasGrid />
              </div>
            </div>
          </div>
        }
        {
          vista === "Proveedores" &&
          < div >
            <Header cambiarVista={cambiarVista} valorVista={vista} />
            <div className="main-content">
              <div className="Historial de ventas">
                <ProveedoresGrid />
              </div>
            </div>
          </div >
        }
        {
          vista === "Compras" &&
          < div >
            <Header cambiarVista={cambiarVista} valorVista={vista} />
            <div className="main-content">
              <div className="Historial de ventas">
                <ComprasGrid />
              </div>
            </div>
          </div >
        }
        {
          vista === "Venta" &&
          <div>
            <Header cambiarVista={cambiarVista} valorVista={vista} />
            <div className="main-content">
              <div className="catalogo">
                <ActionsBarVenta cambiarVista={cambiarVista} setCategoriaFiltro={cambiarCategoriaSeleccionada} busqueda={cambiarBusquedaSeleccionada} setBusqueda={cambiarBusquedaSeleccionada} />
                <ProductGrid eliminarProducto={eliminarProducto} cambiarVista={cambiarVista} seleccionarProducto={seleccionarProducto} categoriaFiltro={categoriaFiltro} busqueda={busqueda} refrescar={refrescar} />
              </div>
              <div>
                <Cart />
              </div>
            </div>
          </div>
        }
      </div >
    </>
  );
}

export default App
