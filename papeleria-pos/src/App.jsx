import React from "react";
import Header from "./Components/Header";
import ActionsBar from "./Components/ActionsBar";
import ProductGrid from "./Components/ProductGrid";
import Cart from "./Components/Cart";
import "./Styles/main.css";

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

export default App;