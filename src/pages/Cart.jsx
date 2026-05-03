// src/context/CartContext.jsx

import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Cart() {
  const {
    cart,
    totalPrice,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout   // ✅ ADDED ONLY THIS
  } = useContext(CartContext);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [errors, setErrors] = useState({});

  const handleCheckout = () => setIsModalOpen(true);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!emailRegex.test(email)) newErrors.email = "Enter a valid email";
    if (!address.trim()) newErrors.address = "Shipping address is required";
    if (!/^\d{16}$/.test(cardNumber)) newErrors.cardNumber = "Card number must be 16 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ ONLY MODIFIED FUNCTION (adds backend call)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await checkout(); // 🔥 send order to backend

      setIsModalOpen(false);
      clearCart();

      alert("Payment successful! Thank you for shopping with HOMETERIA.");
    } catch (error) {
      alert("Checkout failed");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 dark:text-gray-400">
          Your Cart is Empty
        </h2>
        <Link to="/" className="text-green-900 font-bold hover:underline dark:text-green-600">
          ← Go back to shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 mt-10">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-300">
        Shopping Cart
      </h2>

      <div className="bg-white rounded-3xl shadow-sm p-8 mb-6 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-colors">
        <AnimatePresence mode='popLayout'>
          {cart.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col md:flex-row items-center justify-between border-b border-gray-50 dark:border-gray-800 pb-6 mb-6 last:border-0 last:mb-0 gap-6"
            >
              <div className="flex items-center gap-6 w-full md:w-2/5">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-20 w-20 object-contain bg-gray-50 dark:bg-gray-800 rounded-2xl p-2"
                />
                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-2">
                  {item.title}
                </h4>
              </div>

              <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-1 rounded-full">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 rounded-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition font-bold dark:text-white"
                >
                  -
                </button>
                <span className="font-black w-6 text-center dark:text-white">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 rounded-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition font-bold dark:text-white"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-8">
                <span className="font-black text-xl text-green-700 dark:text-green-500">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-xs font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-8 flex flex-col md:flex-row justify-between items-center border border-gray-100 dark:border-gray-800 gap-6">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Total Balance</span>
          <span className="text-4xl font-black text-gray-900 dark:text-white">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full md:w-auto bg-green-950 dark:bg-green-600 text-white px-12 py-4 rounded-2xl font-bold hover:bg-black dark:hover:bg-green-500 transition-all shadow-lg shadow-green-900/20"
        >
          Checkout Now
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/20"
            >
              <h2 className="text-3xl font-black mb-2 text-gray-900 dark:text-white">Secure Payment</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 font-medium">Please enter your shipping and billing details.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white placeholder-gray-400"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1 font-bold ml-2">{errors.fullName}</p>}
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white placeholder-gray-400"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1 font-bold ml-2">{errors.email}</p>}
                </div>

                <div>
                  <textarea
                    placeholder="Shipping Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white placeholder-gray-400 h-24 resize-none"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1 font-bold ml-2">{errors.address}</p>}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Card Number (16 digits)"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white placeholder-gray-400 font-mono"
                  />
                  {errors.cardNumber && <p className="text-red-500 text-xs mt-1 font-bold ml-2">{errors.cardNumber}</p>}
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl font-black hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-green-950 dark:bg-green-600 text-white rounded-2xl font-black shadow-lg shadow-green-900/20 hover:bg-black dark:hover:bg-green-500 transition"
                  >
                    Pay Now
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}