import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function Admin({ searchQuery }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ title: "", price: "", category: "decor", stock: "", description: "", image: "" });
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (localStorage.getItem("isAdmin") !== "true") {
      navigate("/login");
      return;
    }
    fetchProducts();
  }, [navigate]);

  const fetchProducts = () => {
    fetch(`${API_URL}/products?limit=100`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      });
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setProducts(products.filter((p) => p.id !== id));
    } else {
      alert("Delete failed. Are you logged in as admin?");
    }
  };

  const handleEditClick = (product) => {
    setCurrentProduct({ ...product });
    setIsEditOpen(true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/products/${currentProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: currentProduct.title,
        price: parseFloat(currentProduct.price),
        stock: parseInt(currentProduct.stock),
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setProducts(products.map((p) => (p.id === currentProduct.id ? data.product : p)));
      setIsEditOpen(false);
    } else {
      alert(data.error || "Update failed");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setProducts([data.product, ...products]);
      setIsAddOpen(false);
      setNewProduct({ title: "", price: "", category: "decor", stock: "", description: "", image: "" });
    } else {
      setError(Array.isArray(data.error) ? data.error.join(", ") : data.error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 p-6 md:p-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-green-950 dark:text-white tracking-tight">Inventory</h1>
            <p className="text-sm font-bold text-green-600 uppercase tracking-widest mt-1">
              {filteredProducts.length} Items found
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsAddOpen(true)}
              className="bg-green-900 text-white px-6 py-2 rounded-xl font-bold shadow-sm hover:bg-green-800 transition-all"
            >
              + Add Product
            </button>
            <button
              onClick={handleLogout}
              className="bg-white dark:bg-gray-900 text-red-500 border border-red-100 dark:border-red-900/30 px-6 py-2 rounded-xl font-bold shadow-sm hover:bg-red-50 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-white dark:border-gray-800 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold">
                  <th className="p-6">Product</th>
                  <th className="p-6 text-center">Category</th>
                  <th className="p-6 text-center">Stock</th>
                  <th className="p-6 text-center">Price</th>
                  <th className="p-6 text-right px-10">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((p) => (
                    <motion.tr
                      key={p.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-colors"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img src={p.image} className="h-12 w-12 object-cover rounded-xl shadow-sm" alt="" />
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white leading-tight">{p.title}</p>
                            <p className="text-xs text-gray-400">ID: #{p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <span className="text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full capitalize">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-6 text-center">
                        <span className={`font-bold ${p.stock < 10 ? "text-red-500" : "text-gray-700 dark:text-gray-300"}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-6 text-center">
                        <span className="font-black text-green-700 dark:text-green-400">${p.price}</span>
                      </td>
                      <td className="p-6">
                        <div className="flex justify-end gap-3 px-4">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="px-4 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-bold text-xs hover:bg-green-200 transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="px-4 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg font-bold text-xs hover:bg-red-200 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {loading && (
            <div className="p-20 text-center text-gray-400 animate-pulse font-bold tracking-widest text-xs uppercase">
              Loading Hometria Database...
            </div>
          )}
          {!loading && filteredProducts.length === 0 && (
            <div className="p-20 text-center text-gray-500 font-medium italic">
              No products found matching "{searchQuery}"
            </div>
          )}
        </motion.div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditOpen && currentProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsEditOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-[3rem] p-10 shadow-2xl border border-white/20"
            >
              <div className="flex flex-col items-center mb-8">
                <img src={currentProduct.image} alt={currentProduct.title}
                  className="h-28 w-28 object-cover rounded-3xl shadow-xl border-4 border-white dark:border-gray-800 mb-4"
                />
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Edit Product</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">ID: #{currentProduct.id}</p>
              </div>
              <form onSubmit={saveEdit} className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 ml-1">Title</label>
                  <input type="text" value={currentProduct.title}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, title: e.target.value })}
                    className="w-full mt-2 p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 ml-1">Price ($)</label>
                    <input type="number" value={currentProduct.price}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                      className="w-full mt-2 p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-green-600 dark:text-green-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 ml-1">Stock</label>
                    <input type="number" value={currentProduct.stock}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, stock: e.target.value })}
                      className="w-full mt-2 p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-gray-700 dark:text-gray-300"
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsEditOpen(false)}
                    className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >Discard</button>
                  <button type="submit"
                    className="flex-1 py-4 bg-green-950 dark:bg-green-600 text-white rounded-2xl font-bold shadow-lg hover:bg-black transition-all"
                  >Update Item</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-[3rem] p-10 shadow-2xl border border-white/20"
            >
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Add New Product</h2>
              <p className="text-xs text-gray-400 mb-6">Fill in the details to add to the catalog.</p>
              {error && <p className="text-red-500 text-sm font-bold mb-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">{error}</p>}
              <form onSubmit={handleAddProduct} className="space-y-4">
                <input type="text" placeholder="Product Title" required value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Price" required value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
                  />
                  <input type="number" placeholder="Stock" required value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
                  />
                </div>
                <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
                >
                  {["living-room","bedroom","kitchen","bathroom","decor"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input type="text" placeholder="Image URL (https://...)" value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
                />
                <textarea placeholder="Description" value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white h-20 resize-none"
                />
                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setIsAddOpen(false)}
                    className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >Cancel</button>
                  <button type="submit"
                    className="flex-1 py-4 bg-green-950 dark:bg-green-600 text-white rounded-2xl font-bold shadow-lg hover:bg-black transition-all"
                  >Add Product</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
