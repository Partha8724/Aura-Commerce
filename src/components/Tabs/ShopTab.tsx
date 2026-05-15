import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store/useStore';
import { ShoppingCart, Heart, Eye, Filter, Star, Search } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../ProductCard';

export function ShopTab() {
  const products = useStore(state => state.products);
  const addToCart = useStore(state => state.addToCart);

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(500);

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Garden', 'Beauty', 'Sports & Outdoors'];
  
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      if (p.finalPrice > priceRange) return false;
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [products, categoryFilter, priceRange, searchQuery]);

  return (
    <div className="max-w-[1500px] mx-auto px-6 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 pb-8 border-b border-white/5 mt-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black font-display mb-4 uppercase tracking-tighter">New Arrivals</h1>
          <p className="text-gray-400">Discover premium products curated with precision.</p>
        </div>
        <div className="w-full md:w-96 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full bg-[#1A1A1A]/80 backdrop-blur-md border border-[#D4AF37]/30 rounded-full py-3 pl-12 pr-4 text-white focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all outline-none text-sm placeholder-gray-500"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-10 bg-[#141414]/80 backdrop-blur-xl border border-[#D4AF37]/20 p-6 rounded-2xl h-fit">
           <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-4 flex items-center gap-2"><Filter className="w-3 h-3"/> Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${categoryFilter === cat ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 'bg-transparent text-gray-400 border-white/10 hover:border-[#D4AF37]/50 hover:text-white'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
           </div>

           <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-4">Price / Max ${priceRange}</h3>
              <input 
                type="range" 
                min="0" max="500" 
                value={priceRange} 
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
              />
           </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-6 text-sm text-gray-500 uppercase tracking-widest">
            Showing <span className="text-[#D4AF37] font-bold">{filteredProducts.length}</span> matching products
          </div>
          
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 perspective-1000">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 50, rotateX: 20, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: (Object.is(NaN, i) ? 0 : i % 3) * 0.1, type: "spring", stiffness: 100 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProducts.length === 0 && (
             <div className="py-32 text-center text-gray-500 bg-[#141414]/50 border border-white/5 rounded-2xl">
               <Filter className="w-12 h-12 mx-auto mb-4 opacity-20" />
               <p className="font-display">No products match your filters.</p>
               <button onClick={() => { setCategoryFilter('All'); setPriceRange(500); setSearchQuery(''); }} className="mt-4 text-[#D4AF37] border border-[#D4AF37]/30 px-6 py-2 rounded-full hover:bg-[#D4AF37]/10 transition-colors uppercase tracking-widest text-xs font-bold">Clear Filters</button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
