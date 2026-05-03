import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

export default function ProductCard({ product }) {

  const { addToCart } = useContext(CartContext);

  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="relative bg-white dark:bg-gray-700 shadow-md rounded-lg p-4 transition">

      {/* ❤️ Wishlist Button */}
      <button
        onClick={() =>
          inWishlist
            ? removeFromWishlist(product.id)
            : addToWishlist(product)
        }
        className="absolute top-3 right-3 text-xl hover:scale-110 transition"
      >
        {inWishlist ? "❤️" : "🤍"}
      </button>

      <Link to={`/product/${product.id}`} className="flex-1">

        {/* Product Image */}
        <div className="h-48 flex items-center justify-center overflow-hidden mb-4">
          <img
            src={product.image}
            alt={product.title}
            className="max-h-full object-contain"
          />
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold truncate text-gray-800 dark:text-gray-100">
          {product.title}
        </h3>

        {/* Category */}
        <p className="text-gray-500 text-xs mt-1 capitalize dark:text-gray-300">
          {product.category}
        </p>

      </Link>

      {/* Price + Cart */}
      <div className="flex justify-between items-center mt-3">

        <span className="text-green-700 dark:text-green-400 font-bold">
          ${product.price}
        </span>

        <button
          onClick={() => addToCart(product)}
          className="bg-gray-200 dark:bg-gray-600 text-green-900 dark:text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-900 hover:text-white transition"
        >
          Add to Cart
        </button>

      </div>

    </div>
  );
}