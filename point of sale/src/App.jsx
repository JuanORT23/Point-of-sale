import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import './App.css'
import './styles.css'
import logo from "./assets/LogoPapeleria.png";

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
      <div className="header-logo">
        <img src={logo} alt="Logo Papelería Papel y Luna" />
        <h1>Papelería Papel y Luna</h1>
      </div>

      <div className="header-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`header-tab ${tabActivo === tab ? "tab-activo" : ""}`}
            onClick={() => {
              setTabActivo(tab)
              cambiarVista(tab)
            }}
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

    <div className="recuadro">
      {/* Barra superior con título y filtro */}
      <div className="actions-bar">
        <h2>Historial de Ventas</h2>
        <div className="actions-container">
          <select className="category-select">
            <option>Todos</option>
          </select>
        </div>
      </div>
      <div className="recuadro-grid">
      </div>
    </div>
  )
}

function ClientesGrid({ cambiarVista, eliminarCliente, refrescar, seleccionaClienter }) {
  const [clientes, setClientes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState("")

  useEffect(() => {
    async function getData() {
      const dataBase = await fetch("https://script.google.com/macros/s/AKfycbx6WJEr9lo_5Y1sFYSGeoMk3Z3Or37epMWBZNpJ-dSg8z2Z4m0Spwp0RphsvxotNNlVPw/exec?resource=clientes", {
        method: "GET"
      })
      const response = await dataBase.json()
      setClientes(response.data)
      setCargando(false)
    }
    getData()
  }, [refrescar])

  const clientesFiltrados = clientes.filter(c =>
    c.name.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="recuadro">
      <div className="actions-bar">
        <h2>Clientes</h2>
        <div className="actions-container">
          <input
            type="text"
            placeholder="Buscar Cliente"
            className="search-input"
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button className="btn green" onClick={() => cambiarVista("agregarClientes")}>+ Agregar Cliente</button>
        </div>
      </div>

      <div className="recuadro-grid">
        {cargando &&
          <div className='loader'>
            <div className='spinner'></div>
          </div>
        }
        {!cargando && clientesFiltrados.length === 0 &&
          <div className='isEmpetyCat'>
            <p>No hay clientes registrados</p>
          </div>
        }
        {!cargando &&
          clientesFiltrados.map((cliente) => (
            <div className='boxProduct' key={cliente.id}>
              <p className='textBox'>ID: {cliente.id}</p>
              <p className='textBox'>Nombre: {cliente.name}</p>
              <p className='textBox'>Dirección: {cliente.address}</p>
              <div className='btonesMoldearProdcuto'>
                <button className='btonModifPorducto' onClick={() => {
                  seleccionaClienter(cliente)
                  cambiarVista("modifcarCliente")
                }}>Modificar</button>
                <button className='btonDelProducto' onClick={() => eliminarCliente(cliente.id, "clientes")}>Eliminar</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

function FormModificarCliente({ cambiarVista, cliente }) {
  const [clienteData, setClienteData] = useState({
    id: cliente.id || "",
    name: cliente.name || "",
    address: cliente.address || ""
  })

  const setId = (event) => setClienteData({ ...clienteData, id: event.target.value })
  const setName = (event) => setClienteData({ ...clienteData, name: event.target.value })
  const setAddress = (event) => setClienteData({ ...clienteData, address: event.target.value })

  const handleSubmit = async (event) => {
    try {
      event.preventDefault()
      await fetch(`https://script.google.com/macros/s/AKfycbx6WJEr9lo_5Y1sFYSGeoMk3Z3Or37epMWBZNpJ-dSg8z2Z4m0Spwp0RphsvxotNNlVPw/exec?resource=clientes&idCode=${cliente.id}&action=update`, {
        method: "POST",
        mode: "no-cors",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(clienteData)
      })
      toast.success("Cliente modificado correctamente")
      cambiarVista("Clientes")
    } catch (error) {
      toast.error("Error al modificar el cliente")
    }
  }

  return (
    <div className='contenedorForm'>
      <h1 className='formTittle'>Modificar cliente</h1>
      <form className='form' onSubmit={handleSubmit}>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setId} value={clienteData.id} />
          <span className='formText'> Número de identificación </span>
        </label>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setName} value={clienteData.name} />
          <span className='formText'> Nombre del cliente </span>
        </label>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setAddress} value={clienteData.address} />
          <span className='formText'> Dirección </span>
        </label>
        <div className='contentBtonForms'>
          <button className='btonAdd'> Guardar cambios </button>
          <button onClick={() => cambiarVista("Clientes")} type='button' className='btonBack'> Volver </button>
        </div>
      </form>
    </div>
  )
}

function FormAgregarCliente({ cambiarVista }) {
  const [cliente, setCliente] = useState({
    id: "",
    name: "",
    address: ""
  })

  const setId = (event) => setCliente({ ...cliente, id: event.target.value })
  const setName = (event) => setCliente({ ...cliente, name: event.target.value })
  const setAddress = (event) => setCliente({ ...cliente, address: event.target.value })

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await fetch("https://script.google.com/macros/s/AKfycbx6WJEr9lo_5Y1sFYSGeoMk3Z3Or37epMWBZNpJ-dSg8z2Z4m0Spwp0RphsvxotNNlVPw/exec?resource=clientes", {
        method: "POST",
        mode: "no-cors",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(cliente)
      })
      toast.success("Cliente agregado correctamente")
      setCliente({ id: "", name: "", address: "" })
      cambiarVista("Clientes")
    } catch (error) {
      toast.error("Error al agregar el cliente")
    }
  }

  return (
    <div className='contenedorForm'>
      <h1 className='formTittle'>Registrar nuevo cliente</h1>
      <form className='form' onSubmit={handleSubmit}>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setId} value={cliente.id} />
          <span className='formText'> Ingresa el número de identificación </span>
        </label>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setName} value={cliente.name} />
          <span className='formText'> Ingresa el nombre del cliente </span>
        </label>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setAddress} value={cliente.address} />
          <span className='formText'> Ingresa la dirección del cliente </span>
        </label>
        <div className='contentBtonForms'>
          <button className='btonAdd'> Crear </button>
          <button onClick={() => cambiarVista("Venta")} type='button' className='btonBack'> Volver </button>
        </div>
      </form>
    </div>
  )
}

function ProveedoresGrid({ cambiarVista, seleccionarProveedor, refrescar, eliminarProveedor }) {
  const [proveedores, setProveedores] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState("")

  useEffect(() => {
    async function getData() {
      const dataBase = await fetch("https://script.google.com/macros/s/AKfycbx6WJEr9lo_5Y1sFYSGeoMk3Z3Or37epMWBZNpJ-dSg8z2Z4m0Spwp0RphsvxotNNlVPw/exec?resource=proveedores", {
        method: "GET"
      })
      const response = await dataBase.json()
      setProveedores(response.data)
      setCargando(false)
    }
    getData()
  }, [refrescar])

  const proveedoresFiltrados = proveedores.filter(p =>
    p.address.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="recuadro">
      <div className="actions-bar">
        <h2>Proveedores</h2>
        <div className="actions-container">
          <input
            type="text"
            placeholder="Buscar por dirección"
            className="search-input"
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button className="btn green" onClick={() => cambiarVista("agregarProveedor")}>+ Agregar producto</button>
        </div>
      </div>

      <div className="recuadro-grid">
        {cargando &&
          <div className='loader'>
            <div className='spinner'></div>
          </div>
        }
        {!cargando && proveedoresFiltrados.length === 0 &&
          <div className='isEmpetyCat'>
            <p>No hay proveedores registrados</p>
          </div>
        }
        {!cargando &&
          proveedoresFiltrados.map((proveedor) => (
            <div className='boxProduct' key={proveedor.id}>
              <p className='textBox'>ID: {proveedor.id}</p>
              <p className='textBox'>Nombre: {proveedor.name}</p>
              <p className='textBox'>Dirección: {proveedor.address}</p>
              <div className='btonesMoldearProdcuto'>
                <button className='btonModifPorducto' onClick={() => {
                  seleccionarProveedor(proveedor)
                  cambiarVista("modificarProveedor")
                }}>
                  Modificar
                </button>
                <button className='btonDelProducto' onClick={() => eliminarProveedor(proveedor.id, "proveedores")} >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

function FormAgregarProveedor({ cambiarVista }) {
  const [proveedor, setProveedor] = useState({
    id: "",
    name: "",
    address: ""
  })

  const setId = (event) => setProveedor({ ...proveedor, id: event.target.value })
  const setName = (event) => setProveedor({ ...proveedor, name: event.target.value })
  const setAddress = (event) => setProveedor({ ...proveedor, address: event.target.value })

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await fetch("https://script.google.com/macros/s/AKfycbx6WJEr9lo_5Y1sFYSGeoMk3Z3Or37epMWBZNpJ-dSg8z2Z4m0Spwp0RphsvxotNNlVPw/exec?resource=proveedores", {
        method: "POST",
        mode: "no-cors",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(proveedor)
      })
      toast.success("Proveedor agregado correctamente")
      setProveedor({ id: "", name: "", address: "" })
      cambiarVista("Proveedores")
    } catch (error) {
      toast.error("Error al agregar el proveedor")
    }
  }

  return (
    <div className='contenedorForm'>
      <h1 className='formTittle'>Registrar nuevo proveedor</h1>
      <form className='form' onSubmit={handleSubmit}>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setId} value={proveedor.id} />
          <span className='formText'> Ingresa el número NIT </span>
        </label>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setName} value={proveedor.name} />
          <span className='formText'> Ingresa el nombre del proveedor </span>
        </label>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setAddress} value={proveedor.address} />
          <span className='formText'> Ingresa la dirección del proveedor </span>
        </label>
        <div className='contentBtonForms'>
          <button className='btonAdd'> Crear </button>
          <button onClick={() => cambiarVista("Venta")} type='button' className='btonBack'> Volver </button>
        </div>
      </form>
    </div>
  )
}

function FormModificarProveedor({ cambiarVista, proveedor }) {
  const [proveedorData, setProveedorData] = useState({
    id: proveedor.id || "",
    name: proveedor.name || "",
    address: proveedor.address || ""
  })

  const setId = (event) => setProveedorData({ ...proveedorData, id: event.target.value })
  const setName = (event) => setProveedorData({ ...proveedorData, name: event.target.value })
  const setAddress = (event) => setProveedorData({ ...proveedorData, address: event.target.value })

  const handleSubmit = async (event) => {
    try {
      event.preventDefault()
      await fetch(`https://script.google.com/macros/s/AKfycbx6WJEr9lo_5Y1sFYSGeoMk3Z3Or37epMWBZNpJ-dSg8z2Z4m0Spwp0RphsvxotNNlVPw/exec?resource=proveedores&idCode=${proveedor.id}&action=update`, {
        method: "POST",
        mode: "no-cors",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(proveedorData)
      })
      toast.success("Proveedor modificado correctamente")
      cambiarVista("Proveedores")
    } catch (error) {
      toast.error("Error al modificar el proveedor")
    }
  }

  return (
    <div className='contenedorForm'>
      <h1 className='formTittle'>Modificar proveedor</h1>
      <form className='form' onSubmit={handleSubmit}>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setId} value={proveedorData.id} />
          <span className='formText'> Número de identificación </span>
        </label>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setName} value={proveedorData.name} />
          <span className='formText'> Nombre del proveedor </span>
        </label>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setAddress} value={proveedorData.address} />
          <span className='formText'> Dirección </span>
        </label>
        <div className='contentBtonForms'>
          <button className='btonAdd'> Guardar cambios </button>
          <button onClick={() => cambiarVista("Proveedores")} type='button' className='btonBack'> Volver </button>
        </div>
      </form>
    </div>
  )
}

function ComprasGrid({ cambiarVista, seleccionarCompra }) {
  const [compras, setCompras] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [cargando, setCargando] = useState(true)
  const [filtro, setFiltro] = useState("Todos")

  useEffect(() => {
    async function getData() {
      const dataBase = await fetch("https://script.google.com/macros/s/AKfycbx6WJEr9lo_5Y1sFYSGeoMk3Z3Or37epMWBZNpJ-dSg8z2Z4m0Spwp0RphsvxotNNlVPw/exec?resource=compras", {
        method: "GET",
      })
      const response = await dataBase.json()
      setCompras(response.data)
      setCargando(false)
    }
    getData()
  }, [])

  useEffect(() => {
    async function getData() {
      const dataBase = await fetch("https://script.google.com/macros/s/AKfycbx6WJEr9lo_5Y1sFYSGeoMk3Z3Or37epMWBZNpJ-dSg8z2Z4m0Spwp0RphsvxotNNlVPw/exec?resource=proveedores", {
        method: "GET",
      })
      const response = await dataBase.json()
      setProveedores(response.data)
    }
    getData()
  }, [])

  const comprasFiltradas = filtro === "Todos"
    ? compras
    : compras.filter((compra) => compra.proveedor === filtro)

  return (
    <div className="recuadro">
      <div className="actions-bar">
        <h2>Compras</h2>
        <div className="actions-container">
          <select className="category-select" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option>Todos</option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.id}>{proveedor.name}</option>
            ))}
          </select>
          <button className="btn green" onClick={() => cambiarVista("agregarCompra")}>+ Agregar Compra</button>
        </div>
      </div>
      <div className="recuadro-grid">
        {cargando &&
          <div className='loader'>
            <div className='spinner'></div>
          </div>
        }
        {!cargando && comprasFiltradas.length === 0 &&
          <div className='isEmpetyCat'>
            <p>No hay compras registradas</p>
          </div>
        }
        {!cargando &&
          comprasFiltradas.map((compra) => (
            <div className='boxProduct' key={compra.precio}>
              <p className='textBox'>Proveedor: {compra.proveedor}</p>
              <p className='textBox'>Producto: {compra.producto}</p>
              <p className='textBox'>Precio: {compra.precio}</p>
              <p className='textBox'>Cantidad: {compra.cantidad}</p>
              <p className='textBox'> Fecha: {new Date(compra.fecha).toLocaleDateString("es-CO")}</p>
              <div className='btonesMoldearProdcuto'>
                <button className='btonModifPorducto' onClick={() => {
                  seleccionarCompra(compra)
                  cambiarVista("modificarCompra")
                }}>Modificar</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}


function FormAgregarCompra({ cambiarVista }) {
  const [compra, setCompra] = useState({
    proveedor: "",
    producto: "",
    precio: 0,
    cantidad: 0,
    fecha: ""
  })

  const [proveedores, setProveedores] = useState([])

  useEffect(() => {
    async function getData() {
      const dataBase = await fetch("https://script.google.com/macros/s/AKfycbx6WJEr9lo_5Y1sFYSGeoMk3Z3Or37epMWBZNpJ-dSg8z2Z4m0Spwp0RphsvxotNNlVPw/exec?resource=proveedores", {
        method: "GET",
      })
      const response = await dataBase.json()
      setProveedores(response.data)
    }
    getData()
  }, [])

  const setProveedor = (event) => setCompra({ ...compra, proveedor: event.target.value })
  const setProducto = (event) => setCompra({ ...compra, producto: event.target.value })
  const setPrecio = (event) => setCompra({ ...compra, precio: event.target.value })
  const setCantidad = (event => setCompra({ ...compra, cantidad: event.target.value }))
  const setFecha = (event) => setCompra({ ...compra, fecha: event.target.value })

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await fetch("https://script.google.com/macros/s/AKfycbx6WJEr9lo_5Y1sFYSGeoMk3Z3Or37epMWBZNpJ-dSg8z2Z4m0Spwp0RphsvxotNNlVPw/exec?resource=compras", {
        method: "POST",
        mode: "no-cors",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(compra)
      })
      toast.success("Compra agregada correctamente")
      setCompra({ proveedor: "", producto: "", precio: 0, cantidad: 0, fecha: "" })
      cambiarVista("Compras")
    } catch (error) {
      toast.error("Error al agregar la compra")
    }
  }

  return (
    <div className='contenedorForm'>
      <h1 className='formTittle'>Registrar nueva compra</h1>
      <form className='form' onSubmit={handleSubmit}>
        <label className='formLabel'>
          <select className='formInput' value={compra.proveedor} onChange={setProveedor} required="on">
            <option> - </option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.id}>{proveedor.name}</option>
            ))}
          </select>
          <span className='formText'> Seleccione un proveedor </span>
        </label>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setProducto} value={compra.producto} />
          <span className='formText'> Ingresa el producto </span>
        </label>
        <label className='formLabel'>
          <input type="number" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setPrecio} value={compra.precio} />
          <span className='formText'> Ingresa el precio de la compra </span>
        </label>
        <label className='formLabel'>
          <input type="number" className='formInput' placeholder=' ' required='on' autoComplete='off' onChange={setCantidad} value={compra.cantidad} />
          <span className='formText'> Ingresa la cantida de la compra en unidades</span>
        </label>
        <label className='formLabel'>
          <input type="date" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setFecha} value={compra.fecha} />
          <span className='formText'> Selecciona la fecha </span>
        </label>
        <div className='contentBtonForms'>
          <button className='btonAdd'> Crear </button>
          <button onClick={() => cambiarVista("Compras")} type='button' className='btonBack'> Volver </button>
        </div>
      </form>
    </div>
  )
}

function FormModificarCompra({ cambiarVista, compra }) {


  const [compraData, setCompraData] = useState({
    proveedor: compra.proveedor || "",
    producto: compra.producto || "",
    precio: compra.precio || 0,
    cantidad: compra.cantidad || 0,
    fecha: ""
  })

  const [proveedores, setProveedores] = useState([])

  useEffect(() => {
    async function getData() {
      const dataBase = await fetch("https://script.google.com/macros/s/AKfycbx6WJEr9lo_5Y1sFYSGeoMk3Z3Or37epMWBZNpJ-dSg8z2Z4m0Spwp0RphsvxotNNlVPw/exec?resource=proveedores", {
        method: "GET",
      })
      const response = await dataBase.json()
      setProveedores(response.data)
    }
    getData()
  }, [])

  const setProveedor = (event) => setCompraData({ ...compraData, proveedor: event.target.value })
  const setProducto = (event) => setCompraData({ ...compraData, producto: event.target.value })
  const setPrecio = (event) => setCompraData({ ...compraData, precio: event.target.value })
  const setCantidad = (event) => setCantidad({ ...compraData, cantidad: event.target.value })
  const setFecha = (event) => setCompraData({ ...compraData, fecha: event.target.value })

  const handleSubmit = async (event) => {
    try {
      event.preventDefault()
      await fetch(`https://script.google.com/macros/s/AKfycbx6WJEr9lo_5Y1sFYSGeoMk3Z3Or37epMWBZNpJ-dSg8z2Z4m0Spwp0RphsvxotNNlVPw/exec?resource=compras&idCode=${compra.proveedor}&action=update`, {
        method: "POST",
        mode: "no-cors",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(compraData)
      })
      toast.success("Compra modificada correctamente")
      cambiarVista("Compras")
    } catch (error) {
      toast.error("Error al modificar la compra")
    }
  }

  return (
    <div className='contenedorForm'>
      <h1 className='formTittle'>Modificar compra</h1>
      <form className='form' onSubmit={handleSubmit}>
        <label className='formLabel'>
          <select className='formInput' value={compraData.proveedor} onChange={setProveedor} required="on">
            <option> - </option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.id}>{proveedor.name}</option>
            ))}
          </select>
          <span className='formText'> Seleccione un proveedor </span>
        </label>
        <label className='formLabel'>
          <input type="text" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setProducto} value={compraData.producto} />
          <span className='formText'> Producto </span>
        </label>
        <label className='formLabel'>
          <input type="number" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setPrecio} value={compraData.precio} />
          <span className='formText'> Precio </span>
        </label>
        <label className='formLabel'>
          <input type="number" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setCantidad} value={compraData.cantidad} />
          <span className='formText'> Cantidad en unidades </span>
        </label>
        <label className='formLabel'>
          <input type="date" className='formInput' placeholder=' ' required="on" autoComplete='off' onChange={setFecha}/>
          <span className='formText'> Fecha </span>
        </label>
        <div className='contentBtonForms'>
          <button className='btonAdd'> Guardar cambios </button>
          <button onClick={() => cambiarVista("Compras")} type='button' className='btonBack'> Volver </button>
        </div>
      </form>
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
                <button className='btonDelProducto' onClick={() => eliminarProducto(producto.id, "productos")}>
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
      cambiarVista("Venta")
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
      cambiarVista("Venta")
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
      cambiarVista("Venta")
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
        <button className='btonDelete' onClick={() => eliminarCategoria(categoriaSeleccionada)}> Eliminar </button>
        <button className='btonBack' type='button' onClick={() => cambiarVista("Venta")}> Volver </button>
      </div>
    </div>
  )
}

function App() {
  const [vista, setVista] = useState("Venta")

  const [entidadSeleccionada, setEntidadSeleccionada] = useState(null)

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
  function seleccionarEntidad(entidad) {
    setEntidadSeleccionada(entidad)
  }

  function cambiarVista(nuevaVista) {
    setVista(nuevaVista)
    console.log(`Venimos de: ${vista} y pasamos a ${nuevaVista}`)
  }


  async function eliminarEntidad(idCode, resource) {
    try {
      const deleteData = await fetch(`https://script.google.com/macros/s/AKfycbx6WJEr9lo_5Y1sFYSGeoMk3Z3Or37epMWBZNpJ-dSg8z2Z4m0Spwp0RphsvxotNNlVPw/exec?resource=${resource}&idCode=${idCode}&action=delete`, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({})
      })
      refrescarComp()
      toast.success("Entidad eliminada correctamente")
    } catch (error) {
      toast.error("Error al eliminar la entidad")
    }
  }
  return (
    <>
      <Toaster position="top-center" />
      <div className="app-container">
        {vista === "modificarCompra" &&
          <FormModificarCompra cambiarVista={cambiarVista} compra={entidadSeleccionada} />
        }
        {vista === "agregarCompra" &&
          <FormAgregarCompra cambiarVista={cambiarVista} />
        }
        {vista === "modificarProveedor" &&
          <FormModificarProveedor cambiarVista={cambiarVista} proveedor={entidadSeleccionada} />
        }
        {vista === "agregarProveedor" &&
          <FormAgregarProveedor cambiarVista={cambiarVista} />
        }
        {vista === "modifcarCliente" &&
          <FormModificarCliente cambiarVista={cambiarVista} cliente={entidadSeleccionada} />
        }
        {vista === "agregarClientes" &&
          <FormAgregarCliente cambiarVista={cambiarVista} />
        }
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
          <FormModificarProducto cambiarVista={cambiarVista} producto={entidadSeleccionada} />
        }
        {vista === "Clientes" &&
          < div >
            <Header cambiarVista={cambiarVista} valorVista={vista} />
            <div className="main-content">
              <div className="Historial de ventas">
                <ClientesGrid cambiarVista={cambiarVista} eliminarCliente={eliminarEntidad} refrescar={refrescar} seleccionaClienter={seleccionarEntidad} />
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
                <ProveedoresGrid cambiarVista={cambiarVista} eliminarProveedor={eliminarEntidad} refrescar={refrescar} seleccionarProveedor={seleccionarEntidad} />
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
                <ComprasGrid cambiarVista={cambiarVista} seleccionarCompra={seleccionarEntidad} />
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
                <ProductGrid eliminarProducto={eliminarEntidad} cambiarVista={cambiarVista} seleccionarProducto={seleccionarEntidad} categoriaFiltro={categoriaFiltro} busqueda={busqueda} refrescar={refrescar} />
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