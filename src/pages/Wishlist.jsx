import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {

  const { wishlist } = useContext(WishlistContext);

  // if wishlist empty
  if (wishlist.length === 0) {
    return (
      <div className="p-20 text-center text-xl">
        Your wishlist is empty 
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">

      <h1 className="text-3xl font-bold mb-8 text-center text-green-900 dark:text-green-700">
        Your Wishlist
      </h1>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </div>
  );
}