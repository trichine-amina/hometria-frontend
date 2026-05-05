import { useState } from 'react'; 
import { useNavigate, Link } from 'react-router-dom'; 
import { motion } from 'framer-motion';

import logo from "../images/Hometria.svg";
import logoDark from "../images/ometriaDARK.svg";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function Login() { 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 
  
  const handleLogin = async (e) => { 
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid credentials!');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'admin') {
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin');
      } else {
        navigate('/');
      }

    } catch (err) {
      setError('Server error. Is your backend running?');
    }

    setLoading(false);
  }; 

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return ( 
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-700"> 
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-green-300 dark:bg-green-200/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[55%] h-[55%] bg-teal-200 dark:bg-teal-200/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-[100px] animate-pulse"></div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="bg-white/40 dark:bg-gray-900/60 backdrop-blur-3xl p-10 md:p-12 rounded-[3.5rem] shadow-2xl border border-white/40 dark:border-white/5">
          
          <div className="text-center mb-10">
            <motion.div variants={itemVariants} className="flex justify-center mb-4">
              <Link to="/" className="hover:opacity-70 transition-opacity">
                <img src={logo} alt="Hometria" className="h-14 w-auto dark:hidden" />
                <img src={logoDark} alt="Hometria" className="h-14 w-auto hidden dark:block" />
              </Link>
            </motion.div>
            <motion.div variants={itemVariants} className="h-1 w-10 bg-green-700 mx-auto rounded-full" />
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 ml-4">
                Email Address
              </label>
              <input  
                type="email" 
                placeholder="admin@dz.com" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full bg-white/60 dark:bg-gray-800/40 border border-transparent ring-1 ring-black/5 dark:ring-white/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-green-600 transition-all dark:text-white placeholder:text-gray-400"  
              /> 
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 ml-4">
                Password
              </label>
              <input  
                type="password" 
                placeholder="••••••••" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full bg-white/60 dark:bg-gray-800/40 border border-transparent ring-1 ring-black/5 dark:ring-white/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-green-600 transition-all dark:text-white placeholder:text-gray-400"  
              /> 
            </motion.div>

            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-green-900 dark:bg-green-600 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl hover:bg-green-900 dark:hover:bg-green-500 transition-all mt-4 disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button> 
          </form>

          <motion.p variants={itemVariants} className="text-center mt-8 text-[11px] text-gray-500 dark:text-gray-400">
            Forgot credentials? <Link to="/" className="text-green-800 dark:text-green-500 font-bold hover:underline">Return to Store</Link>
          </motion.p>
        </div>
      </motion.div>
    </div> 
  ); 
}
