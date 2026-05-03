import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom'; // gets id from URL
import { CartContext } from '../context/CartContext';

export default function ProductDetails() {

  const { id } = useParams(); // product id from the URL
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);

  useEffect(() => {

    // CHANGED: use DummyJSON API instead of FakeStore API
    fetch(`https://dummyjson.com/products/${id}`)
      .then(res => res.json())
      .then(data => {

        // CHANGED: DummyJSON stores images inside an array
        // we convert it to "image" so it works with your existing UI
        data.image = data.images[0];

        setProduct(data);
      });

  }, [id]);

  if (!product) 
    return <div className="p-8 text-center text-xl">Loading product...</div>;

  return (

    <div className="max-w-4xl mx-auto p-8 bg-white mt-10 rounded-lg shadow-md flex flex-col md:flex-row gap-10  dark:bg-gray-700">

      {/* Product Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-96 object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">

        {/* Product Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4  dark:text-gray-100">
          {product.title}
        </h2>

        {/* Category */}
        <p className="text-gray-500 capitalize mb-2  dark:text-gray-300">
          {product.category}
        </p>

        {/* Price */}
        <p className="text-green-900 text-4xl font-bold mb-6  dark:text-green-600">
          ${product.price}
        </p>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed mb-8  dark:text-gray-300">
          {product.description}
        </p>

        {/* Add to Cart Button */}
        <button
          onClick={() => addToCart(product)}
          className="bg-green-900 text-white py-3 px-8 rounded-lg font-bold text-lg hover:bg-green-800 transition w-full md:w-auto  dark:bg-green-700 dark:hover:bg-green-800"
        >
          Add to Cart
        </button>

      </div>

    </div>

  );

}