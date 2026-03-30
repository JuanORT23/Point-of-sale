import './App.css'

function Titutlo ({value}){
  return(
    <h1>{value}</h1>
  )
}

export default function App(){
  return(
    <div>
        <Titutlo value={"Hola como estas"}></Titutlo>
        <h1>Hola como estas</h1>
    </div>
  
  )
}
