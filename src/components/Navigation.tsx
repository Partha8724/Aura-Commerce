import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 lg:px-12 px-6',
        scrolled 
          ? 'bg-[#020202]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl h-20 flex items-center' 
          : 'bg-transparent border-transparent py-6 h-24 flex items-center'
      )}
    >
      <div className="w-full flex items-center justify-between">
        
        {/* Logo and Links */}
        <div className="flex items-center gap-12">
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer text-2xl font-black tracking-tighter">
            <div className="relative flex items-center justify-center w-8 h-8">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-blue-400 rounded-sm rotate-45"
                animate={{ rotate: [45, 225] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span>AURA</span>
              <span className="font-thin opacity-50">COMMERCE</span>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-400">
            <div className="group relative cursor-pointer py-2">
              <span className="flex items-center gap-1 hover:text-indigo-400 text-white transition-colors">
                Catalog <ChevronDown className="w-4 h-4 opacity-50" />
              </span>
              {/* Mega Menu Dropdown */}
              <div className="absolute top-full left-0 mt-4 w-96 bg-[#020202]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 grid grid-cols-2 gap-4 shadow-2xl font-sans normal-case tracking-normal">
                {[
                  { label: 'Electronics', trend: 'Trending' },
                  { label: 'Wearables', trend: '' },
                  { label: 'Home Living', trend: 'New' },
                  { label: 'Accessories', trend: '' }
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group/item">
                    <div className="text-white text-sm font-medium group-hover/item:text-indigo-400 transition-colors">{item.label}</div>
                    {item.trend && <div className="text-xs text-neutral-500 mt-1 flex items-center gap-1"><Sparkles className="w-3 h-3 text-indigo-400"/> {item.trend}</div>}
                  </div>
                ))}
              </div>
            </div>
            <a href="#features" className="hover:text-indigo-400 transition-colors">Features</a>
            <a href="#about" className="hover:text-indigo-400 transition-colors">Intelligence</a>
            <a href="#enterprise" className="hover:text-indigo-400 transition-colors">Enterprise</a>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 text-[10px] bg-white/5 border border-white/10 px-3 py-1.5 rounded-full uppercase tracking-widest font-mono">
            <span className="opacity-50">Currency</span>
            <select className="bg-transparent outline-none cursor-pointer font-bold text-white appearance-none">
              <option value="USD">USD $</option>
              <option value="EUR">EUR €</option>
              <option value="GBP">GBP £</option>
            </select>
            <span className="w-[1px] h-3 bg-white/20 mx-1"></span>
            <span className="text-green-400 font-bold">ONLINE</span>
          </div>
          
          <button className="relative w-10 h-10 flex items-center justify-center border border-white/20 rounded-full bg-white/5 hover:bg-white/10 transition-colors group">
            <ShoppingCart className="w-5 h-5 opacity-70 text-white group-hover:opacity-100 group-hover:text-indigo-400 transition-colors" />
            <motion.span 
              className="absolute top-0 right-0 w-3 h-3 bg-indigo-500 rounded-full border-2 border-[#020202]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </button>

          <button 
            className="md:hidden w-10 h-10 flex items-center justify-center border border-white/20 rounded-full bg-white/5 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-xl overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              <a href="#catalog" className="text-gray-300 hover:text-white text-lg">Catalog</a>
              <a href="#features" className="text-gray-300 hover:text-white text-lg">Features</a>
              <a href="#about" className="text-gray-300 hover:text-white text-lg">About</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
