import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductCard } from './ProductCard';
import { mockProducts } from '../data/mockProducts';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

export function ProductCatalog() {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Electronics', 'Wearables', 'Accessories', 'Tech', 'Home & Living', 'Office'];

  const filteredProducts = filter === 'All' 
    ? mockProducts 
    : mockProducts.filter(p => p.category === filter);

  return (
    <section id="catalog" className="py-24 bg-[#020202] min-h-screen relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="w-full md:w-auto text-left">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[1px] w-12 bg-indigo-500"></span>
              <span className="text-indigo-400 text-xs font-bold tracking-[0.3em] uppercase">Marketplace</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter uppercase">AI Product Vault</h2>
            <p className="text-neutral-400 font-light text-lg max-w-xl">High-converting inventory natively synced with our global supply chain.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
             <div className="relative bg-white/5 border border-white/10 rounded-none flex items-center px-4 py-3 group">
                <Search className="w-4 h-4 text-neutral-500 mr-2 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="SEARCH CATALOG..." 
                  className="bg-transparent border-none outline-none text-white text-xs font-bold tracking-widest placeholder-neutral-600 w-full sm:w-48 group-hover:w-64 focus:w-64 transition-all duration-300 uppercase"
                />
             </div>
             
             <button className="bg-white/5 p-3 rounded-none hover:bg-indigo-400 hover:text-white border border-white/10 transition-colors text-neutral-400 shadow-[0_0_15px_rgba(255,255,255,0.02)]">
               <SlidersHorizontal className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto pb-4 mb-10 -mx-6 px-6 md:mx-0 md:px-0 gap-3 no-scrollbar border-b border-white/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`whitespace-nowrap px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 relative ${
                filter === cat 
                  ? 'text-white border-b-2 border-indigo-400' 
                  : 'text-neutral-500 hover:text-indigo-300 border-b-2 border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
