// src/App.jsx

import { Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react'; 
// ✅ ADDED: useState to store the search query globally

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Navbar from './components/Navbar';
import Footer from './layouts/Footer';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Wishlist from './pages/Wishlist';


export default function App() {

  // ✅ ADDED: global search state (used by Navbar and Home)
  const [searchQuery, setSearchQuery] = useState("");
  const location= useLocation();
  return (
    <WishlistProvider>
      <CartProvider>


  <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 dark:text-white">

    <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

    <main className="flex-grow">
      <Routes>
        <Route path="/" element={<Home searchQuery={searchQuery} />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin searchQuery={searchQuery} />}/>
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </main>
    
    {(location.pathname !="/login")&& <Footer /> }
  </div>

      </CartProvider>
    </WishlistProvider>
  );
}