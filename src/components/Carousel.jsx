import { useState, useEffect } from 'react'; 
import storeImg from '../images/store.svg';
import FourImg from '../images/four.svg';
import SofaImg from '../images/sofa.svg';

const banners = [
  storeImg,  
  SofaImg,
  FourImg,
 
];

  
export default function Carousel() { 
  const [current, setCurrent] = useState(0); 
  
  // Auto-scroll logic 
  useEffect(() => { 
    const timer = setInterval(() => { 
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1)); 
    }, 4000); 
    return () => clearInterval(timer); // Cleanup on unmount 
  }, []); 
  
  return ( 
    <div className="relative w-full h-64 md:h-96 overflow-hidden bg-gray-900"> 
      {banners.map((img, index) => ( 
        <img 
          key={index} 
          src={img} 
          alt={`Banner ${index}`} 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${ 
            index === current ? "opacity-100" : "opacity-0" 
          }`} 
        /> 
      ))} 
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center"> 
        <h2 className="text-white text-3xl md:text-5xl font-bold tracking-widest uppercase shadow-black drop-shadow-lg"> 
         
        </h2> 
      </div> 
    </div> 
  ); 
} 