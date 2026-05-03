import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import logo from "../images/Hometria.svg";
import logoDark from "../images/ometriaDARK.svg";

// Minimalist Icons (You can install lucide-react or use these SVG paths)
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

export default function Navbar({ searchQuery, setSearchQuery }) {
  const { totalItems } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  const menuVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: { 
      opacity: 1, y: 0, scale: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    },
    exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50 px-6 md:px-12 transition-colors border-b border-gray-100 dark:border-gray-800">
      
      <Link to="/" className="flex-shrink-0">
        <img src={logo} alt="Hometria" className="h-10 w-auto dark:hidden" />
        <img src={logoDark} alt="Hometria" className="h-10 w-auto hidden dark:block" />
      </Link>

      <div className="hidden md:block flex-1 max-w-md mx-8">
        <input
          type="text"
          placeholder="Search furniture..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-100/50 dark:bg-gray-800/50 border border-transparent focus:border-green-700/30 p-2.5 px-5 rounded-full outline-none dark:text-white transition-all placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-3">
        
        <Link to="/" className="p-2 px-5 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-green-100 dark:hover:bg-green-900 transition-all group flex items-center">
          <span className="font-bold text-sm dark:text-white group-hover:text-green-800 dark:group-hover:text-green-400">Home</span>
        </Link>

        <Link to="/cart" className="relative p-2 px-5 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-green-100 dark:hover:bg-green-900 transition-all group flex items-center">
          <span className="font-bold text-sm dark:text-white group-hover:text-green-800 dark:group-hover:text-green-400">Cart</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-700 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-md">
              {totalItems}
            </span>
          )}
        </Link>

        <div className="relative ml-1">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex items-center gap-2 p-2 rounded-full px-6 font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-lg border border-transparent
              ${isMenuOpen 
                ? 'bg-gray-200 text-green-600 border-gray-300 scale-95' 
                : 'bg-green-900 text-white hover:bg-gray-200 hover:text-green-600 dark:bg-green-600 dark:hover:bg-gray-700'
              }`}
          >
            Menu
            <span className={`text-[10px] transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`}>▼</span>
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 mt-4 w-56 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/20 dark:border-gray-800/50 overflow-hidden py-3"
              >
                <motion.div variants={itemVariants}>
                  <Link 
                    to="/wishlist" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex justify-between items-center px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-green-900/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 group-hover:text-pink-500 transition-colors"><HeartIcon /></span>
                      Wishlist
                    </div>
                    {wishlist.length > 0 && (
                      <span className="bg-pink-600 text-white text-[10px] font-black rounded-full px-2 py-0.5">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-green-900/30 transition-colors group"
                  >
                    <span className="text-gray-400 group-hover:text-green-700 transition-colors"><UserIcon /></span>
                    Login
                  </Link>
                </motion.div>

                <motion.div variants={itemVariants} className="border-t border-gray-100 dark:border-gray-800 my-2 mx-6"></motion.div>

                <motion.div variants={itemVariants}>
                  <button
                    onClick={() => { toggleDarkMode(); setIsMenuOpen(false); }}
                    className="w-full text-left px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-green-900/30 flex items-center justify-between transition-colors group"
                  >
                    <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                    <span className="text-lg group-hover:rotate-12 transition-transform">{darkMode ? "☀️" : "🌙"}</span>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}