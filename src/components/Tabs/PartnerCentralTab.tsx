import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../../store/useStore';
import { ShoppingBag, CreditCard, User, MapPin, CheckCircle2, ChevronRight, Edit2 } from 'lucide-react';
import { initialProducts as products } from '../../data/products';

export function PartnerCentralTab() {
  const { addToCart, setActiveTab } = useStore();
  const [activeSection, setActiveSection] = useState<'products' | 'profile'>('products');
  const [selectedProduct, setSelectedProduct] = useState(products[0] || {
    id: 'default',
    title: 'Featured Aura Product',
    price: 0,
    finalPrice: 0,
    imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1600&q=80',
    supplier: 'AURA'
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState({
    street: '123 Golden Avenue',
    city: 'Beverly Hills',
    state: 'CA',
    zip: '90210',
    country: 'United States'
  });

  const handle1ClickBuy = (product: any) => {
    addToCart(product);
    // Simulate opening checkout immediately
    alert(`Initiating 1-Click Buy for ${product.title}...`);
  };

  return (
    <div className="w-full min-h-screen bg-black text-white pt-8 pb-32 font-sans selection:bg-white/30">
      
      {/* Partner Central Nav */}
      <div className="max-w-[1200px] mx-auto px-6 mb-12 border-b border-white/10 pb-4 flex flex-wrap gap-4 md:gap-8">
        <button 
          onClick={() => setActiveSection('products')}
          className={`text-xs md:text-sm tracking-widest uppercase font-medium transition-colors ${activeSection === 'products' ? 'text-white' : 'text-gray-600 hover:text-gray-300'}`}
        >
          Exclusive Products
        </button>
        <button 
          onClick={() => setActiveSection('profile')}
          className={`text-xs md:text-sm tracking-widest uppercase font-medium transition-colors ${activeSection === 'profile' ? 'text-white' : 'text-gray-600 hover:text-gray-300'}`}
        >
          Partner Profile
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto px-6">
        {activeSection === 'products' ? (
          <div className="space-y-32">
            
            {/* Apple Style Product Showcase */}
            <div className="text-center space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-bold tracking-tight text-white"
              >
                {selectedProduct.title.split(' ').slice(0, 3).join(' ')}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl md:text-3xl text-gray-400 font-medium tracking-tight"
              >
                Pro features. Premium design.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center gap-4 pt-4"
              >
                <div className="text-2xl font-semibold text-white">
                  ${(selectedProduct.finalPrice || selectedProduct.price || 99).toFixed(2)}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8"
              >
                <button 
                  onClick={() => handle1ClickBuy(selectedProduct)}
                  className="w-full md:w-auto bg-white text-black px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors hover:scale-105 active:scale-95 duration-200"
                >
                  <CreditCard className="w-5 h-5" />
                  1-Click Buy
                </button>
                <button 
                  onClick={() => addToCart(selectedProduct)}
                  className="w-full md:w-auto bg-zinc-900 border border-zinc-800 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors hover:scale-105 active:scale-95 duration-200"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add to Bag
                </button>
              </motion.div>
            </div>

            {/* Huge Product Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-video max-h-[600px] mx-auto rounded-3xl overflow-hidden bg-zinc-900"
            >
              <img 
                src={selectedProduct.imageUrl || selectedProduct.images?.[0] || 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1600&q=80'} 
                alt={selectedProduct.title}
                className="w-full h-full object-cover object-center"
              />
            </motion.div>

            {/* Specs Grid */}
            <div className="grid md:grid-cols-3 gap-8 pt-12">
              <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5">
                <h3 className="text-zinc-400 font-medium mb-2">Performance</h3>
                <p className="text-2xl font-semibold text-white">Ultra-fast execution</p>
              </div>
              <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5">
                <h3 className="text-zinc-400 font-medium mb-2">Design</h3>
                <p className="text-2xl font-semibold text-white">Aerospace-grade materials</p>
              </div>
              <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5">
                <h3 className="text-zinc-400 font-medium mb-2">Battery</h3>
                <p className="text-2xl font-semibold text-white">All-day power</p>
              </div>
            </div>

            {/* Other Products Carousel */}
            <div className="pt-24">
              <h2 className="text-2xl font-semibold mb-8">More exclusive products</h2>
              <div className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar">
                {products.slice(1, 6).map((product, idx) => (
                  <div key={idx} onClick={() => setSelectedProduct(product)} className="w-[300px] shrink-0 cursor-pointer group">
                    <div className="aspect-square rounded-2xl bg-zinc-900 overflow-hidden mb-4 relative">
                      <img src={product.imageUrl || product.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h3 className="font-medium text-white truncate">{product.title}</h3>
                    <p className="text-zinc-500">${(product.finalPrice || product.price || 0).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="max-w-2xl mx-auto py-12">
            <h1 className="text-4xl font-bold mb-8">Partner Profile</h1>
            
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-zinc-900 rounded-3xl p-6 md:p-8 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                  <div className="w-20 h-20 shrink-0 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
                    <User className="w-8 h-8 text-zinc-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Partner Dealer</h2>
                    <p className="text-zinc-400">partner@auracommerce.com</p>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-[#50C878]">
                      <CheckCircle2 className="w-4 h-4" />
                      Verified Partner
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Management */}
              <div className="bg-zinc-900 rounded-3xl p-8 border border-white/5">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-zinc-400" />
                    <h3 className="text-xl font-semibold">Shipping Address</h3>
                  </div>
                  <button 
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    className="text-zinc-400 hover:text-white flex items-center gap-2 transition-colors"
                  >
                    {isEditingAddress ? 'Cancel' : <><Edit2 className="w-4 h-4" /> Edit</>}
                  </button>
                </div>

                {isEditingAddress ? (
                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsEditingAddress(false); }}>
                    <div>
                      <label className="block text-sm text-zinc-500 mb-2">Street Address</label>
                      <input 
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                        value={address.street}
                        onChange={(e) => setAddress({...address, street: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-zinc-500 mb-2">City</label>
                        <input 
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                          value={address.city}
                          onChange={(e) => setAddress({...address, city: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-500 mb-2">State</label>
                        <input 
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                          value={address.state}
                          onChange={(e) => setAddress({...address, state: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-zinc-500 mb-2">ZIP Code</label>
                        <input 
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                          value={address.zip}
                          onChange={(e) => setAddress({...address, zip: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-500 mb-2">Country</label>
                        <input 
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                          value={address.country}
                          onChange={(e) => setAddress({...address, country: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="pt-4 flex justify-end">
                      <button 
                        type="submit"
                        className="bg-white text-black px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-black rounded-2xl p-6 border border-white/5">
                    <p className="text-white text-lg">{address.street}</p>
                    <p className="text-zinc-400 mt-1">{address.city}, {address.state} {address.zip}</p>
                    <p className="text-zinc-400 mt-1">{address.country}</p>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div className="bg-zinc-900 rounded-3xl p-8 border border-white/5">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-zinc-400" />
                    <h3 className="text-xl font-semibold">Payment Methods</h3>
                  </div>
                </div>
                <div className="bg-black rounded-2xl p-4 md:p-6 border border-white/5 flex items-center justify-between group cursor-pointer hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 shrink-0 bg-zinc-800 rounded flex items-center justify-center text-xs font-semibold">
                      VISA
                    </div>
                    <div>
                      <p className="text-white text-sm md:text-base">•••• •••• •••• 4242</p>
                      <p className="text-zinc-500 text-xs md:text-sm">Expires 12/28</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
