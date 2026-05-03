import { createContext, useState, useEffect } from "react";
// ✅ ADDED: useEffect to synchronize wishlist with LocalStorage

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {

  // ✅ CHANGED: Initialize wishlist from LocalStorage if data exists
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // ✅ ADDED: Save wishlist to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);


  // add product to wishlist
  const addToWishlist = (product) => {
    setWishlist((prev) => [...prev, product]);
  };

  // remove product from wishlist
  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  // check if product already in wishlist
  const isInWishlist = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}