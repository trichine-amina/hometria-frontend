import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import Carousel from "../components/Carousel";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function Home({ searchQuery }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  
  const LIMIT = 12;

  useEffect(() => {
    setLoading(true);
    const cat = category === "all" ? "" : `&category=${category}`;
    fetch(`${API_URL}/products?page=${page}&limit=${LIMIT}${cat}`)
      .then((r) => r.json())
      .then((data) => {
        const mapped = data.products.map((p) => ({
          ...p,
          image: p.image,
          thumbnail: p.image,
        }));
        setProducts(mapped);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category, page]);

  useEffect(() => { setPage(1); }, [category]);

  const sortLabels = {
    default: "Default Sorting",
    "price-asc": "Price: Low to High",
    "price-desc": "Price: High to Low",
    alpha: "Name: A to Z",
  };

  const sortedProducts = [...products]
    .filter(p => !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      if (sortOption === "alpha") return a.title.localeCompare(b.title);
      return 0;
    });

  const categories = ["all", "living-room", "bedroom", "kitchen", "bathroom", "decor"];

  if (loading) return <div className="text-center p-20 text-2xl font-bold dark:text-white">Loading Store...</div>;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors min-h-screen">
      <Carousel />

      <div className="p-8 max-w-7xl mx-auto">
        
        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2 rounded-full capitalize font-bold text-sm transition-all ${
                category === cat ? "bg-green-900 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {cat.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex justify-end mb-10 relative z-40">
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="group flex items-center gap-4 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:border-green-900 dark:hover:border-green-600"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">Sort By</span>
              <span className="text-sm font-bold text-gray-800 dark:text-white min-w-[120px] text-left">
                {sortLabels[sortOption]}
              </span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 py-3 overflow-hidden"
                >
                  {Object.entries(sortLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => { setSortOption(key); setIsSortOpen(false); }}
                      className={`w-full text-left px-6 py-3 text-sm font-bold transition-colors ${
                        sortOption === key 
                          ? "text-green-900 dark:text-green-500 bg-green-50/50 dark:bg-green-900/10" 
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {sortedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-6 py-2 rounded-full font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:border-green-900 transition-all dark:text-white"
            >
              ← Prev
            </button>
            <span className="font-bold text-gray-600 dark:text-gray-300">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-6 py-2 rounded-full font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:border-green-900 transition-all dark:text-white"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
