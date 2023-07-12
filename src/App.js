import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";
import { Routes, HashRouter, BrowserRouter } from "react-router-dom";
import { Route } from "react-router";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import Product from "./pages/Product";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";
import { UserContext } from "./context/UserContext";
import { CartContext } from "./context/CartContext";

function App() {
  let [user, setUser] = useState({
    isLoggedIn:
      sessionStorage.getItem("isLoggedIn") != ""
        ? sessionStorage.getItem("isLoggedIn")
        : false,
    userId:
      sessionStorage.getItem("userId") != ""
        ? sessionStorage.getItem("userId")
        : "",
    userName:
      sessionStorage.getItem("userName") != ""
        ? sessionStorage.getItem("userName")
        : "",
  });
  let [cart, setCart] = useState({
    id: sessionStorage.getItem("id") ? sessionStorage.getItem("id") : "",
    userId: sessionStorage.getItem("userId")
      ? sessionStorage.getItem("userId")
      : "",
    date: sessionStorage.getItem("date") ? sessionStorage.getItem("date") : "",
    products: sessionStorage.getItem("products")
      ? JSON.parse(sessionStorage.getItem("products"))
      : [],
    __v: 0,
  });
  return (
    <UserContext.Provider value={{ user: user, setUser: setUser }}>
      <CartContext.Provider value={{ cart: cart, setCart: setCart }}>
        <HashRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/store" element={<ProductList />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </HashRouter>
      </CartContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
