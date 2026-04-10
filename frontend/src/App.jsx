import React, { useState } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UpdateProduct from "./components/UpdateProduct";
import Order from "./components/Order";

import SearchResults from "./components/SearchResults";
 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer } from "react-toastify";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    console.log("Selected category:", category);
  };

  return (
    <BrowserRouter>
      <div className="app-shell">
        <ToastContainer autoClose={2000}
          hideProgressBar={true} />
        <Navbar onSelectCategory={handleCategorySelect} />
        <div className="app-content">
          <Routes>
            <Route
              path="/"
              element={
                <Home selectedCategory={selectedCategory} />
              }
            />
            <Route path="/add_product" element={<AddProduct />} />
            <Route path="/product" element={<Product />} />
            <Route path="product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/update/:id" element={<UpdateProduct />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/search-results" element={<SearchResults />} />
             
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;