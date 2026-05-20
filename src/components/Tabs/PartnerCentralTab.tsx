import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store/useStore';
import { ShoppingBag, CreditCard, User, MapPin, CheckCircle2, ChevronRight, Edit2, Sparkles, Plus, Trash2, UploadCloud, Check, Package, DollarSign, Layers } from 'lucide-react';
import { initialProducts as products } from '../../data/products';

export function PartnerCentralTab() {
  const { products: storeProducts, addProduct, addToCart, activeTab, setActiveTab, addNotification, addBotLog } = useStore();
  const [activeSection, setActiveSection] = useState<'products' | 'profile' | 'essentials'>('products');
  const [selectedProduct, setSelectedProduct] = useState(storeProducts[0] || products[0] || {
    id: 'default',
    title: 'Featured Aura Product',
    price: 0,
    finalPrice: 0,
    imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1600&q=80',
    supplier: 'AURA'
  });
  
  // Essentials Upload State
  const [essTitle, setEssTitle] = useState('');
  const [essCategory, setEssCategory] = useState('Electronics');
  const [essPrice, setEssPrice] = useState('');
  const [essCommission, setEssCommission] = useState('');
  const [essImageUrl, setEssImageUrl] = useState('');
  const [essDescription, setEssDescription] = useState('');
  const [essWeight, setEssWeight] = useState('0.5');
  const [essStock, setEssStock] = useState('150');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState({
    street: '123 Golden Avenue',
    city: 'Beverly Hills',
    state: 'CA',
    zip: '90210',
    country: 'United States'
  });

  const handle1ClickBuy = (product: any) => {
    addToCart(product as any);
    alert(`Initiating 1-Click Buy for ${product.title}...`);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!essTitle || !essPrice || !essImageUrl || !essDescription) {
      alert('Please fill out all required fields to register this Essential product.');
      return;
    }

    const basePriceNum = parseFloat(essPrice);
    const commNum = parseFloat(essCommission) || parseFloat((basePriceNum * 0.15).toFixed(2));
    const finalPriceNum = parseFloat((basePriceNum + commNum).toFixed(2));

    const newProd = {
      id: `ess-${Date.now()}`,
      title: essTitle.trim(),
      description: essDescription.trim(),
      supplier: 'Partner Premium',
      supplierLogo: '👑',
      price: finalPriceNum,
      basePrice: basePriceNum,
      commission: commNum,
      finalPrice: finalPriceNum,
      stock: parseInt(essStock) || 500,
      rating: parseFloat((4.6 + Math.random() * 0.4).toFixed(1)),
      category: essCategory,
      imageUrl: essImageUrl.trim(),
      images: [essImageUrl.trim()],
      weight: parseFloat(essWeight) || 0.4,
      isNew: true,
      isDemo: false,
      discountEligible: true
    };

    // Save to Zustand store
    addProduct(newProd as any);

    // Add Alert notifications
    addNotification({
      title: 'Partner Product Certified',
      message: `Your elite essential "${newProd.title}" is now globally live on the main atelier storefront!`,
      type: 'system'
    });

    // Add Bot log entries
    addBotLog({
      id: `ess-log-${Date.now()}`,
      bot: 'Partner Registry Bot',
      message: `Certified partner essential: "${newProd.title}" successfully integrated. Configured commission: $${commNum.toFixed(2)}.`,
      date: new Date().toLocaleTimeString(),
      type: 'success'
    });

    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 4400);

    // Clear form
    setEssTitle('');
    setEssPrice('');
    setEssCommission('');
    setEssImageUrl('');
    setEssDescription('');
    setEssWeight('0.5');
    setEssStock('150');
  };

  // Filter products owned by partner or standard
  const partnerProducts = storeProducts.filter(p => p.supplier === 'Partner Premium');

  return (
    <div className="w-full min-h-screen bg-[#060606] text-white pt-8 pb-32 font-sans selection:bg-white/30 relative overflow-hidden">
      
      {/* Visual background luxury radial glows to eliminate flat black/white */}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-300px] left-[50%] -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#D4AF37]/15 via-purple-500/5 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-sky-500/5 blur-[100px] rounded-full" />
      </div>

      {/* Partner Central Nav */}
      <div className="max-w-[1200px] mx-auto px-6 mb-12 border-b border-white/5 pb-0 flex flex-wrap gap-4 md:gap-8 relative z-10">
        <button 
          onClick={() => setActiveSection('products')}
          className={`text-xs md:text-sm tracking-widest uppercase font-bold transition-all duration-300 pb-4 relative ${
            activeSection === 'products' ? 'text-white border-b-2 border-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Exclusive Products
        </button>
        <button 
          onClick={() => setActiveSection('essentials')}
          className={`text-xs md:text-sm tracking-widest uppercase font-bold transition-all duration-300 pb-4 relative flex items-center gap-2 ${
            activeSection === 'essentials' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-500 hover:text-[#D4AF37]/70'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
          Aura Essentials Upload
        </button>
        <button 
          onClick={() => setActiveSection('profile')}
          className={`text-xs md:text-sm tracking-widest uppercase font-bold transition-all duration-300 pb-4 relative ${
            activeSection === 'profile' ? 'text-white border-b-2 border-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Partner Profile
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
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
                  onClick={() => addToCart(selectedProduct as any)}
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
                src={(selectedProduct as any).imageUrl || (selectedProduct as any).images?.[0] || 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1600&q=80'} 
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
        ) : activeSection === 'essentials' ? (
          /* ESSENTIALS INTAKE PANEL && LIVE STATS */
          <div className="space-y-12">
            {/* Header Promo Card with beautiful typography & colors */}
            <div className="bg-gradient-to-r from-[#D4AF37]/20 via-purple-950/40 to-slate-900/60 border border-[#D4AF37]/30 rounded-3xl p-6 md:p-10 relative overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.8)]">
              <div className="relative z-10 max-w-2xl">
                <span className="text-[#D4AF37] text-[10px] md:text-xs font-black tracking-[0.35em] uppercase block mb-3 animate-pulse">Atelier Dropship System</span>
                <h1 className="text-3xl md:text-5xl font-black text-white leading-none uppercase tracking-tight">
                  ESSENTIALS <b className="text-[#D4AF37] font-serif italic text-glow font-normal">Panel</b>
                </h1>
                <p className="text-gray-300 text-xs md:text-sm mt-4 leading-relaxed font-light">
                  Instantly register top-tier physical essentials into your client-facing catalog. Every active product saved here is verified with secure encryption protocols and deployed live immediately into the storefront catalog with your custom-configured dropship margins.
                </p>
              </div>
              
              {/* Decorative glass elements */}
              <div className="absolute right-[-80px] bottom-[-80px] w-96 h-96 bg-[#D4AF37]/10 blur-[90px] rounded-full" />
              <div className="absolute top-[-40px] right-20 w-48 h-48 bg-purple-500/10 blur-[60px] rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Upload Form - Left column (7/12) */}
              <div className="lg:col-span-7 bg-[#111111]/90 backdrop-blur-md border border-white/10 rounded-3xl p-5 md:p-8 hover:border-[#D4AF37]/30 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-md font-black text-white uppercase tracking-wider">Product Registration</h2>
                    <p className="text-[11px] text-zinc-500">Inject custom physical items directly into active storefront database</p>
                  </div>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">Product Title *</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Aura Smart Leather Wallet"
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                        value={essTitle}
                        onChange={(e) => setEssTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">Category *</label>
                      <select 
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                        value={essCategory}
                        onChange={(e) => setEssCategory(e.target.value)}
                      >
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion & Apparel</option>
                        <option value="Home & Garden">Home & Garden</option>
                        <option value="Beauty">Beauty & Self Care</option>
                        <option value="Sports & Outdoors">Sports & Outdoors</option>
                        <option value="General">General Goods</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">Product Description *</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Detail descriptions, raw materials, premium craftsmanship details, package list..."
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition-all resize-none"
                      value={essDescription}
                      onChange={(e) => setEssDescription(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">Base Cost (USD $) *</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-[11px] text-zinc-500 font-mono">$</span>
                        <input 
                          type="number"
                          step="0.01"
                          required
                          min="0.1"
                          placeholder="35.00"
                          className="w-full bg-black/60 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37] transition-all"
                          value={essPrice}
                          onChange={(e) => setEssPrice(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5 font-sans">Commission Markup ($)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-[11px] text-[#D4AF37] font-mono">$</span>
                        <input 
                          type="number"
                          step="0.01"
                          placeholder={`Default 15% ($${essPrice ? (parseFloat(essPrice) * 0.15).toFixed(2) : '0.00'})`}
                          className="w-full bg-black/60 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37] transition-all"
                          value={essCommission}
                          onChange={(e) => setEssCommission(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5 font-sans">Product Image URL *</label>
                    <input 
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] transition-all font-mono"
                      value={essImageUrl}
                      onChange={(e) => setEssImageUrl(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">Weight (kg)</label>
                      <input 
                        type="number"
                        step="0.01"
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37] transition-all"
                        value={essWeight}
                        onChange={(e) => setEssWeight(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">Initial Stock Volume</label>
                      <input 
                        type="number"
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37] transition-all"
                        value={essStock}
                        onChange={(e) => setEssStock(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#D4AF37] to-[#ffd700] text-black font-extrabold uppercase tracking-widest text-xs py-4 rounded-xl hover:shadow-[0_0_25px_rgba(212,175,55,0.45)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#D4AF37]/20"
                    >
                      <Plus className="w-4 h-4 text-black stroke-[3px]" />
                      Add & Deploy Essential Product
                    </button>
                  </div>

                  <AnimatePresence>
                    {uploadSuccess && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-3 text-xs"
                      >
                         <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                         <span>Essential product successfully certified and launched into general catalog!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>

              {/* Right side - Interactive preview & Saved metrics (5/12) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Live preview glass card */}
                <div className="bg-[#111111]/90 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-[0_15px_30px_rgba(0,0,0,0.7)] relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all">
                  <div className="absolute top-4 right-4 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] px-2.5 py-1 rounded text-[9px] uppercase font-mono font-black tracking-widest animate-pulse">
                    Live Preview
                  </div>
                  <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-extrabold mb-4">Storefront Display</h3>
                  
                  <div className="aspect-square w-full rounded-2xl bg-black border border-white/5 overflow-hidden mb-4 relative flex items-center justify-center shadow-inner">
                    {essImageUrl ? (
                      <img src={essImageUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="text-center text-gray-600 p-6 flex flex-col items-center gap-2">
                        <UploadCloud className="w-8 h-8 opacity-40 text-zinc-400 animate-bounce" />
                        <span className="text-[11px] tracking-wide text-zinc-500">Provide an image URL to see mock visual preview</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] bg-white/5 text-gray-300 px-2.5 py-1 rounded-full uppercase font-bold font-mono tracking-wider">
                        {essCategory}
                      </span>
                      <span className="text-zinc-500 text-[10px] font-mono font-bold tracking-wider">SUPPLIER: PARTNER PREMIUM</span>
                    </div>
                    <h4 className="font-bold text-white text-md truncate group-hover:text-[#D4AF37] transition-colors">{essTitle || 'Aura Smart Premium Essence'}</h4>
                    <p className="text-zinc-400 text-xs line-clamp-2 min-h-[2.5rem] leading-relaxed">
                      {essDescription || 'Write description on the left form to preview design specs.'}
                    </p>

                    <div className="border-t border-white/5 pt-3 mt-3 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-gray-500 block">Atelier Price</span>
                        <span className="text-lg font-mono font-bold text-white">
                          ${(parseFloat(essPrice || '0') + (parseFloat(essCommission) || (parseFloat(essPrice || '0') * 0.15))).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase font-bold text-[#D4AF37] block">Your Earnings</span>
                        <span className="text-lg font-mono font-black text-[#D4AF37] text-glow">
                          +${(parseFloat(essCommission) || (parseFloat(essPrice || '0') * 0.15)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Saved products tracker list */}
                <div className="bg-[#111111]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6">
                  <h3 className="text-xs uppercase tracking-widest text-gray-400 font-extrabold mb-4 flex items-center justify-between">
                    <span>Active Essentials ({partnerProducts.length})</span>
                    <span className="text-[9px] px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 font-mono font-bold tracking-widest">
                      ACTIVE DEPLOYED
                    </span>
                  </h3>

                  {partnerProducts.length === 0 ? (
                     <div className="p-8 text-center border-2 border-dashed border-white/10 rounded-2xl bg-black/40">
                       <Package className="w-8 h-8 text-zinc-600 mx-auto mb-2 opacity-30" />
                       <p className="text-xs text-gray-500">You have no registered premium essentials listed yet.</p>
                     </div>
                  ) : (
                     <div className="space-y-3.5 max-h-[280px] overflow-y-auto pr-1">
                       {partnerProducts.map((p) => (
                         <div key={p.id} className="p-3 bg-black/60 rounded-2xl border border-white/5 hover:border-[#D4AF37]/30 transition-all flex items-center gap-3.5 pl-3">
                           <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-white/10 overflow-hidden shrink-0 relative">
                             <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                           </div>
                           <div className="min-w-0 flex-1">
                             <h4 className="text-xs font-black text-white truncate uppercase tracking-wider">{p.title}</h4>
                             <div className="flex items-center gap-2.5 mt-0.5">
                               <span className="text-[8px] font-bold text-gray-500 uppercase">{p.category}</span>
                               <span className="text-[8px] text-[#D4AF37] font-bold font-mono">Gain: ${p.commission?.toFixed(2)}</span>
                             </div>
                           </div>
                           <div className="text-right pr-2">
                             <div className="text-xs font-mono font-bold text-white">${(p.finalPrice || p.price || 0).toFixed(2)}</div>
                             <button
                               onClick={() => useStore.getState().deleteProduct(p.id)}
                               className="text-red-500 hover:text-red-400 text-[9px] uppercase tracking-widest font-extrabold mt-1.5 transition-colors cursor-pointer"
                             >
                               Delete
                             </button>
                           </div>
                         </div>
                       ))}
                     </div>
                  )}
                </div>
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
