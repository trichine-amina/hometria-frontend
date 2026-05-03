import { Link } from "react-router-dom";

export default function Footer() { 
return ( 
<footer className="bg-gray-300 text-gray-900 py-8 mt-12 dark:bg-gray-600 dark:text-white"> 
<div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left"> 
<div> 
<h2 className="text-2xl font-bold text-green-900 dark:text-green-600">HOMETRIA</h2> 
<p className="text-gray-900 mt-2 text-sm dark:text-gray-200">The best e-commerce platform in Mila, built with React & Tailwind v4.</p> 
</div> 
<div> 
<h3 className="font-semibold text-lg mb-2">Quick Links</h3> 
<ul className="text-gray-900 text-sm space-y-1  dark:text-gray-200"> 
<li className="hover:text-green-700 cursor-pointer"><Link to="/">Home</Link></li> 
<li className="hover:text-green-700 cursor-pointer"><Link to="/cart">Cart</Link></li> 
<li className="hover:text-green-700 cursor-pointer"><Link to="/login">Login</Link></li> 
</ul> 
</div> 
<div> 
<h3 className="font-semibold text-lg mb-2">Contact Us</h3> 
<p className="text-gray-900 text-sm  dark:text-gray-200">Email: contact@hometria.dz</p> 
<p className="text-gray-900 text-sm  dark:text-gray-200">Phone: +213 555 00 00 00</p> 
</div> 
</div> 
<div className="border-t border-gray-800 mt-8 pt-4 text-center text-gray-800 text-xs  dark:text-gray-400"> 
© 2026 University of Mila - Master STIC. All rights reserved. 
</div> 
</footer> 
); 
} 