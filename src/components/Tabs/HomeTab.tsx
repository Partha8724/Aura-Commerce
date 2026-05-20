import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useStore } from '../../store/useStore';
import { ArrowRight, Play, ShoppingCart, TrendingUp, ShieldCheck, Server, Bot, Search, Sparkles, Zap, Shield, Globe, Gift, Star, Clock } from 'lucide-react';
import { ProductCard } from '../ProductCard';
import { ProductFlipCard } from '../ProductFlipCard';

function TiltDealCard({ product, addToCart }: { product: any; addToCart: (p: any) => void }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const rotateYVal = ((x - xc) / xc) * 16; 
    const rotateXVal = -((y - yc) / yc) * 16; 
    setCoords({ x: rotateXVal, y: rotateYVal });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const discountAmount = 20;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      animate={{ 
        rotateX: coords.x, 
        rotateY: coords.y,
        scale: isHovered ? 1.03 : 1
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
      className="relative aspect-[4/5] w-full rounded-[32px] bg-gradient-to-b from-zinc-900 via-neutral-950 to-black border border-white/10 p-6 flex flex-col justify-between overflow-hidden shadow-2xl group cursor-pointer hover:border-[#D4AF37]/50"
    >
      {/* Dynamic Cursor Light Overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Floating Sparkle glow ball */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#D4AF37]/5 blur-3xl rounded-full group-hover:bg-[#7C3AED]/15 transition-colors duration-700" />

      {/* Badge container with 3D Pop effect */}
      <div className="flex justify-between items-center z-10" style={{ transform: "translateZ(40px)" }}>
        <span className="px-3.5 py-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-[#D4AF37] text-white font-sans text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-red-600/30 animate-pulse flex items-center gap-1">
          <Star className="w-3 h-3 fill-white stroke-none" /> BEST DEAL -{discountAmount}%
        </span>
        <span className="text-zinc-500 font-mono text-[9px] uppercase font-bold bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">
          STOCK: {product.stock || 999}
        </span>
      </div>

      {/* Image container with 3D translation effect */}
      <div 
        className="w-full relative aspect-square my-4 rounded-2xl overflow-hidden bg-black border border-white/5 shadow-inner"
        style={{ transform: "translateZ(60px)" }}
      >
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Product metadata body */}
      <div className="space-y-2 z-10" style={{ transform: "translateZ(50px)" }}>
        <span className="text-[9px] text-[#D4AF37] tracking-[0.2em] font-black uppercase block font-sans">
          {product.category || 'Atelier Exclusive'}
        </span>
        <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
          {product.title}
        </h3>
        
        <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed h-[2rem]">
          {product.description}
        </p>

        {/* Pricing tag row */}
        <div className="flex items-end justify-between pt-3 border-t border-white/5 mt-2">
          <div>
            <div className="text-[8px] uppercase tracking-widest text-[#D4AF37] font-black">Limited Time Cost</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-mono font-black text-white">
                ${(product.finalPrice || product.price || 99).toFixed(2)}
              </span>
              <span className="text-xs font-mono text-zinc-650 line-through">
                ${((product.finalPrice || product.price || 99) * (1 + discountAmount / 100)).toFixed(2)}
              </span>
            </div>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="px-4 py-2.5 bg-[#D4AF37] hover:bg-white text-black font-black uppercase text-[10px] tracking-wider rounded-xl transition-all duration-300 transform active:scale-95 flex items-center gap-1 cursor-pointer shadow-lg shadow-[#D4AF37]/15"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-black stroke-[3px]" />
            SECURE
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function TypewriterText({ options }: { options: string[] }) {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentFullText = options[typingIndex];
    
    if (isDeleting) {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(currentFullText.substring(0, displayText.length - 1));
        }, 25);
      } else {
        setIsDeleting(false);
        setTypingIndex((prev) => (prev + 1) % options.length);
      }
    } else {
      if (displayText.length < currentFullText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentFullText.substring(0, displayText.length + 1));
        }, 40);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    }
    
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, typingIndex, options]);

  return (
    <span className="font-mono text-zinc-400 text-xs md:text-sm tracking-wide lowercase">
      {displayText}
      <motion.span 
         animate={{ opacity: [1, 0] }}
         transition={{ repeat: Infinity, duration: 0.6 }}
         className="w-2 h-4 inline-block ml-1 bg-[#D4AF37] align-middle" 
      />
    </span>
  );
}

function EssentialCard({ product, addToCart }: { product: any; addToCart: (p: any) => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      className="bg-[#111111]/90 border border-white/5 rounded-3xl p-5 relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all duration-300 shadow-xl flex flex-col justify-between"
    >
      {/* Decorative backing light gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/5 via-[#7C3AED]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div>
        {/* Aspect Ratio Box centered with touch target sizes */}
        <div className="relative aspect-square w-full rounded-2xl bg-black border border-white/10 overflow-hidden mb-5 shadow-inner">
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
          />
          {product.supplier === 'Partner Premium' && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-yellow-500 via-amber-600 to-[#D4AF37] text-black font-sans text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg border border-[#D4AF37]/30">
              👑 PARTNER ESSENTIAL
            </span>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              {product.category}
            </span>
            <span className="text-zinc-650 text-[9px] font-mono">SUPPLIER: {product.supplier === 'Partner Premium' ? 'PARTNER' : 'ATELIER'}</span>
          </div>

          <h3 className="font-bold text-white text-base md:text-lg group-hover:text-[#D4AF37] transition-colors truncate">
            {product.title}
          </h3>

          <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed min-h-[2rem]">
            {product.description}
          </p>
        </div>
      </div>

      <div className="border-t border-white/5 pt-4 mt-5 flex items-center justify-between">
        <div>
          <span className="text-[8px] uppercase font-bold text-gray-500 block">Atelier Cost</span>
          <span className="text-lg font-mono font-bold text-white">
            ${(product.finalPrice || product.price || 0).toFixed(2)}
          </span>
        </div>

        <button
          onClick={() => addToCart(product)}
          className="px-4 py-2.5 bg-white hover:bg-[#D4AF37] text-black font-extrabold uppercase text-[9px] tracking-wider rounded-xl transition-all duration-300 transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          ADD OUTLET
        </button>
      </div>
    </motion.div>
  );
}

export function HomeTab() {
  const { setActiveTab, stats, products, settings, addToCart } = useStore();
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);

  const typingOptions = [
    "AI imports products instantly from any supplier...",
    "Smart bots manage your pricing 24/7...",
    "Watch your profits grow automatically...",
    "One click and your empire begins...",
    "The future of dropshipping is here..."
  ];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentFullText = typingOptions[typingIndex];
    
    if (isDeleting) {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(currentFullText.substring(0, displayText.length - 1));
        }, 30);
      } else {
        setIsDeleting(false);
        setTypingIndex((prev) => (prev + 1) % typingOptions.length);
      }
    } else {
      if (displayText.length < currentFullText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentFullText.substring(0, displayText.length + 1));
        }, 50);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 1500);
      }
    }
    
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, typingIndex]);

  // Parallax Values
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -600]);
  const rotateHero = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scaleHero = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const featured = products.slice(0, 8);
  const showcaseProducts = products.slice(0, 3);

  return (
    <div ref={containerRef} className="flex flex-col bg-[#0A0A0A] overflow-hidden w-full relative">
      
      {/* Traveling Marquee Text - Full Screen Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden pt-32">
        <div className="flex whitespace-nowrap opacity-[0.03]">
          <motion.div 
            animate={{ x: [0, -2000] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="text-[400px] font-display font-black leading-none uppercase pr-20"
          >
             AURA COMMERCE LUXURY AURA COMMERCE LUXURY AURA COMMERCE LUXURY
          </motion.div>
          <motion.div 
            animate={{ x: [0, -2000] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="text-[400px] font-display font-black leading-none uppercase pr-20"
          >
             AURA COMMERCE LUXURY AURA COMMERCE LUXURY AURA COMMERCE LUXURY
          </motion.div>
        </div>
        
        <div className="flex whitespace-nowrap opacity-[0.02] mt-40">
          <motion.div 
            animate={{ x: [-2000, 0] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="text-[300px] font-display font-black leading-none uppercase pr-20 text-outline"
            style={{ WebkitTextStroke: '2px white' }}
          >
             REIMAGINED DROPSHIPPING AUTOMATED WEALTH RETAIL EXCELLENCE
          </motion.div>
          <motion.div 
            animate={{ x: [-2000, 0] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="text-[300px] font-display font-black leading-none uppercase pr-20 text-outline"
            style={{ WebkitTextStroke: '2px white' }}
          >
             REIMAGINED DROPSHIPPING AUTOMATED WEALTH RETAIL EXCELLENCE
          </motion.div>
        </div>
      </div>

      {/* HERO SECTION - APPLE STYLE */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-24 overflow-hidden px-4 md:px-8">
        {/* Parallax Background Elements */}
        <motion.div style={{ y: y1, opacity: opacityHero }} className="absolute inset-0 z-0">
           <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-[#D4AF37] opacity-[0.08] blur-[180px] rounded-full" />
           <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-white opacity-[0.04] blur-[120px] rounded-full" />
        </motion.div>

        {/* Floating 3D-Like Shapes - Spining & Traveling */}
        <motion.div 
          style={{ y: y2, rotate: rotateHero, scale: scaleHero }} 
          className="absolute top-40 right-[15%] w-48 h-48 border border-white/5 rounded-[40px] glass rotate-12 hidden lg:flex items-center justify-center opacity-30 shadow-2xl"
        >
           <Sparkles className="w-12 h-12 text-[#D4AF37] opacity-50" />
        </motion.div>
        <motion.div 
          style={{ y: y1, rotate: useTransform(rotateHero, [0, 360], [360, 0]), scale: scaleHero }} 
          className="absolute bottom-40 left-[10%] w-32 h-32 border border-[#D4AF37]/10 rounded-full glass -rotate-12 hidden lg:flex items-center justify-center opacity-40 shadow-2xl"
        >
           <Zap className="w-8 h-8 text-white opacity-50" />
        </motion.div>

        <motion.div 
          style={{ opacity: opacityHero }}
          className="max-w-[1200px] mx-auto w-full text-center relative z-10 flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
             <span className="px-6 py-2 rounded-full border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] uppercase tracking-[0.5em] font-black bg-black/80 backdrop-blur-md shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                The Zenith of Commerce
             </span>
          </motion.div>
          
          <div className="overflow-hidden mb-6">
            <motion.h1 
              initial={{ y: "100%" }}
              animate={{ y: 0 }} 
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl lg:text-[140px] font-black font-display leading-[0.85] tracking-[-0.05em] text-white uppercase text-balance"
            >
              AURA <br />
              <motion.span 
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="gold-text-glow italic"
              >
                COMMERCE
              </motion.span>
            </motion.h1>
          </div>

          <div className="h-16 flex items-center justify-center mb-8 bg-white/5 backdrop-blur-sm px-8 rounded-full border border-white/5">
               <span className="font-mono font-bold text-[#D4AF37] text-sm md:text-lg tracking-[0.15em] uppercase">
                 {displayText}
                 <motion.span 
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    className="w-2.5 h-6 inline-block ml-2 bg-white align-middle" 
                 />
               </span>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.6, duration: 1 }} 
            className="text-lg md:text-2xl font-light text-gray-300 mb-12 max-w-3xl leading-relaxed italic font-special"
          >
            {settings.heroSubtitle}. We unify artificial intelligence and luxury curation into a singular, high-performance ecosystem for the modern merchant.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.8 }} 
            className="flex flex-col sm:flex-row gap-8"
          >
            <button 
              onClick={() => setActiveTab('shop')} 
              className="group relative w-full sm:w-auto px-16 py-6 bg-white text-black font-display font-black text-xs uppercase tracking-[5px] rounded-full hover:bg-[#D4AF37] transition-all duration-500 overflow-hidden"
            >
              <span className="relative z-10">Enter Atelier</span>
              <div className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
            <button 
              onClick={() => setActiveTab('auth')} 
              className="w-full sm:w-auto px-16 py-6 bg-transparent border border-white/10 text-white font-display font-black text-xs uppercase tracking-[5px] rounded-full hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all backdrop-blur-xl bg-white/5"
            >
              Forge Empire
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-20"
          >
            <div className="flex items-center gap-1.5 text-gray-600 text-[10px] uppercase tracking-[0.3em] font-bold">
               <span>Scroll to discover</span>
               <div className="w-12 h-[1px] bg-gray-800 ml-2" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 3D SHOWCASE SECTION */}
      <section className="py-32 bg-[#050505] relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 uppercase tracking-wider">
               State of the Art <span className="text-[#D4AF37]">Products</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto font-light text-lg">
               Hover to explore technical specifications and profit margins for our most exclusive drops.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
             {showcaseProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                >
                  <ProductFlipCard product={p} />
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* TODAY'S BEST DEALS SECTION - 3D INTERACTIVE TILT STAGE */}
      <section className="py-32 bg-gradient-to-b from-[#050505] via-[#050505] to-[#0A0A0A] relative overflow-hidden border-t border-b border-white/5">
        {/* Radial glow to replace raw black and white */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-gradient-to-r from-purple-500/10 via-[#D4AF37]/10 to-transparent blur-[140px] pointer-events-none rounded-full" />
        
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-20 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-[#D4AF37] text-xs font-black tracking-[0.4em] uppercase">LIVE MARGIN OPTIMIZATION ON</span>
              </div>
              <h2 className="text-4xl md:text-7xl font-display font-black text-white uppercase tracking-tight leading-none">
                TODAY'S BEST <br />
                <span className="gold-text-glow italic text-[#D4AF37] font-serif font-normal">Explosive Deals</span>
              </h2>
            </div>
            <div className="text-left md:text-right max-w-sm md:max-w-md">
              <p className="text-zinc-400 text-xs md:text-sm font-light leading-relaxed mb-4">
                Bypassing standard retailer markups. Handpicked daily micro-drops certified for rapid checkout, low weight shipping, and 30%+ net margins.
              </p>
              <div className="flex items-center md:justify-end gap-2 text-xs text-[#D4AF37] font-mono">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span>DEAL ENGINE REFRESHES IN: 14HRS 28MIN</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             {products.slice(0, 3).map((p) => (
                <motion.div
                  key={`deal-${p.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <TiltDealCard product={p} addToCart={addToCart} />
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* BENTO FEATURE GRID - APPLE STYLE */}
      <section className="py-24 bg-[#0A0A0A] relative border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-display font-medium text-white/50 uppercase tracking-[0.3em]">
               System <span className="text-white">Capabilities</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[1000px]">
            {/* LARGE BENTO FEATURE */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="md:col-span-2 md:row-span-2 rounded-[40px] bg-gradient-to-br from-[#111] to-black border border-white/5 p-12 flex flex-col justify-between overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37] opacity-[0.03] blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <Bot className="w-12 h-12 text-[#D4AF37] mb-8" />
                <h3 className="text-4xl md:text-5xl font-display font-black text-white mb-6 uppercase leading-tight">
                  Neural <br /> Fulfillment
                </h3>
                <p className="text-gray-500 text-lg font-light leading-relaxed max-w-sm">
                  Our advanced neural networks optimize shipping routes and warehouse selection in real-time, reducing delivery lag by up to 60%.
                </p>
              </div>
              <div className="relative z-10 space-y-4">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                   <div className="flex justify-between items-end mb-4">
                      <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Processing Speed</span>
                      <span className="text-[#D4AF37] font-display text-xl font-bold">1.2ms</span>
                   </div>
                   <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '85%' }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="h-full bg-[#D4AF37]" 
                      />
                   </div>
                </div>
              </div>
            </motion.div>

            {/* MEDIUM BENTO FEATURE 1 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="md:col-span-2 rounded-[40px] bg-gradient-to-br from-[#111] to-[#050505] border border-white/5 p-10 flex flex-col justify-center relative overflow-hidden"
            >
              <div className="flex items-center gap-8">
                 <div className="w-20 h-20 rounded-3xl bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-8 h-8 text-[#D4AF37]" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-display font-bold text-white mb-2 uppercase">Profit Prediction</h3>
                    <p className="text-gray-500 font-light text-sm">AI-driven market analysis predicts tomorrow's winners today.</p>
                 </div>
              </div>
            </motion.div>

            {/* SMALL BENTO FEATURE 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="rounded-[40px] bg-[#0D0D0D] border border-white/5 p-8 flex flex-col items-center justify-center text-center space-y-4"
            >
              <ShieldCheck className="w-10 h-10 text-white/20" />
              <h4 className="text-white font-bold text-sm uppercase tracking-widest">Protocol V4</h4>
              <p className="text-[10px] text-gray-600 uppercase font-bold tracking-[0.2em]">Verified Secure</p>
            </motion.div>

            {/* SMALL BENTO FEATURE 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="rounded-[40px] bg-gradient-to-br from-[#1A1A1A] to-black border border-[#D4AF37]/30 p-8 flex flex-col justify-between"
            >
              <div className="text-4xl font-display font-black text-white">99.9%</div>
              <div className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-[0.3em]">System Uptime</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating Interactive 3D Objects */}
      <div className="absolute inset-0 pointer-events-none z-20">
         <motion.div
           animate={{ 
             x: [0, 100, 0],
             y: [0, 50, 0],
             rotate: [0, 360],
           }}
           transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
           className="absolute top-[20%] left-[5%] w-64 h-64 border border-white/5 rounded-full glass hidden lg:flex items-center justify-center opacity-10"
         >
           <div className="w-1/2 h-1/2 border border-[#D4AF37]/20 rounded-full animate-pulse" />
         </motion.div>
         
         <motion.div
           animate={{ 
             x: [0, -150, 0],
             y: [0, 100, 0],
             rotate: [360, 0],
           }}
           transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
           className="absolute bottom-[10%] right-[5%] w-96 h-96 border border-white/5 rounded-[80px] glass hidden lg:flex items-center justify-center opacity-10 rotate-45"
         >
           <div className="w-2/3 h-2/3 border border-[#D4AF37]/20 rounded-[60px] transform rotate-45" />
         </motion.div>
      </div>

      {/* SELLING NOW / REGISTER SECTION - 3D MOTION */}
      <section className="relative py-40 overflow-hidden bg-black">
         {/* Traveling Round Text */}
         <div className="absolute -left-20 top-1/2 -translate-y-1/2 z-0 hidden xl:block">
            <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="relative w-[300px] h-[300px]"
            >
               <svg className="w-full h-full text-white/5 font-display text-[10px] uppercase font-bold tracking-[0.5em]" viewBox="0 0 100 100">
                  <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                  <text fill="currentColor">
                     <textPath xlinkHref="#circlePath">
                        * AURA COMMERCE * AUTOMATE YOUR FUTURE * SCALE YOUR EMPIRE * 
                     </textPath>
                  </text>
               </svg>
            </motion.div>
         </div>

         <div className="absolute inset-0 opacity-20">
            {/* 3D Grid Background Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
         </div>

         <div className="max-w-[1200px] mx-auto px-6 relative z-10 grid lg:grid-cols-2 items-center gap-20">
            <div className="text-left">
               <motion.div
                 initial={{ opacity: 0, x: -30 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
               >
                  <h2 className="text-5xl md:text-7xl font-display font-black text-white mb-8 leading-[1.0] uppercase tracking-tighter">
                     BUILD YOUR <br />
                     <span className="text-[#D4AF37] italic">DIGITAL</span> FORTUNE
                  </h2>
                  <p className="text-gray-400 text-lg mb-12 font-light leading-relaxed max-w-lg">
                     Join over 2,000+ elite sellers who have bypassed the traditional struggle and embraced automated retail excellence. 
                  </p>

                  <div className="grid grid-cols-2 gap-8 mb-12">
                     <div className="space-y-2">
                        <Zap className="w-6 h-6 text-[#D4AF37]" />
                        <h4 className="text-white font-bold text-sm uppercase">Instant Onboarding</h4>
                        <p className="text-xs text-gray-500">Go live in under 5 minutes.</p>
                     </div>
                     <div className="space-y-2">
                        <Shield className="w-6 h-6 text-[#D4AF37]" />
                        <h4 className="text-white font-bold text-sm uppercase">Secure Logic</h4>
                        <p className="text-xs text-gray-500">Encrypted merchant protocols.</p>
                     </div>
                     <div className="space-y-2">
                        <Globe className="w-6 h-6 text-[#D4AF37]" />
                        <h4 className="text-white font-bold text-sm uppercase">Global Scale</h4>
                        <p className="text-xs text-gray-500">Ship to 180+ countries.</p>
                     </div>
                     <div className="space-y-2">
                        <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                        <h4 className="text-white font-bold text-sm uppercase">AI Optimization</h4>
                        <p className="text-xs text-gray-500">Automatic price balancing.</p>
                     </div>
                  </div>

                  <button 
                    onClick={() => setActiveTab('auth')}
                    className="group relative inline-flex items-center gap-4 px-10 py-5 bg-[#D4AF37] text-black font-display font-black text-lg uppercase tracking-[4px] hover:bg-white transition-all duration-500 rounded-full overflow-hidden"
                  >
                     <span className="relative z-10">REGISTER NOW</span>
                     <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform" />
                  </button>
               </motion.div>
            </div>

            {/* 3D Animated Object Representation */}
            <div className="relative">
               <motion.div
                 animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 5, 0],
                    scale: [1, 1.05, 1]
                 }}
                 transition={{ 
                    duration: 6, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                 }}
                 className="relative z-20"
               >
                  <div className="w-[400px] h-[550px] mx-auto bg-gradient-to-br from-[#1A1A1A] to-[#050505] border border-[#D4AF37]/40 rounded-[40px] p-10 shadow-[0_50px_100px_rgba(212,175,55,0.15)] backdrop-blur-xl flex flex-col justify-between">
                     <div className="flex justify-between items-start">
                        <div className="w-16 h-16 bg-[#D4AF37] rounded-2xl flex items-center justify-center">
                           <Zap className="w-8 h-8 text-black" />
                        </div>
                        <div className="text-[#D4AF37] font-display font-medium text-xs tracking-widest">AURA CARD</div>
                     </div>

                     <div className="space-y-8">
                        <div>
                           <div className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.3em] mb-2">Merchant Name</div>
                           <div className="text-white font-display text-2xl uppercase font-black">ELITE PARTNER</div>
                        </div>
                        <div>
                           <div className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.3em] mb-2">Revenue Generated</div>
                           <div className="text-[#D4AF37] font-display text-4xl uppercase font-black">$45,920.00</div>
                        </div>
                     </div>

                     <div className="flex justify-between items-end">
                        <div className="flex gap-1.5">
                           <div className="w-3 h-3 rounded-full bg-white opacity-20" />
                           <div className="w-3 h-3 rounded-full bg-white opacity-20" />
                           <div className="w-3 h-3 rounded-full bg-white opacity-20" />
                           <div className="w-3 h-3 rounded-full bg-[#D4AF37]" />
                        </div>
                        <div className="text-white/20 text-[8px] tracking-[0.2em] font-bold">AURAFX™ LOGIC ENGINE</div>
                     </div>
                  </div>
               </motion.div>
               
               {/* Ambient Glows */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37] opacity-[0.05] blur-[100px] z-10" />
            </div>
         </div>
      </section>

      {/* STATS COUNTER ROW */}
      <section className="border-y border-[#222222] bg-[#0A0A0A] py-16 relative z-20">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 divide-x divide-white/5">
          {[
            { label: 'Products Listed', value: '1,247+' },
            { label: 'Commissions Earned', value: `$89,432+` },
            { label: 'Orders Fulfilled', value: '3,891+' },
            { label: 'Happy Customers', value: '2,456+' }
          ].map((stat, i) => (
            <div key={stat.label} className="flex flex-col items-center text-center group pl-4">
              <div 
                className="text-4xl md:text-6xl font-sans font-light text-white mb-3 transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = settings.themeColor}
                onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
              >
                {stat.value}
              </div>
              <div 
                className="text-sm uppercase tracking-[0.2em] font-medium font-display"
                style={{ color: settings.themeColor }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ESSENTIALS PRODUCT FOR YOU SECTION - DYNAMIC SPOTLIGHT GRID WITH TYPEWRITER */}
      <section className="py-32 bg-black relative border-t border-b border-zinc-900 overflow-hidden">
        {/* Glow backdrop element */}
        <div className="absolute top-1/2 left-10 w-[450px] h-[450px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#D4AF37]/5 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
          <div className="mb-20">
            <span className="text-[#D4AF37] text-[10px] md:text-xs font-black tracking-[0.45em] uppercase block mb-4">EXCLUSIVE PARTNER SHOWCASE</span>
            <h2 className="text-4xl md:text-7xl font-display font-black text-white uppercase tracking-tight leading-none mb-6">
              ESSENTIALS FOR <span className="gold-text-glow italic text-[#D4AF37] font-serif font-normal">Your Roster</span>
            </h2>
            
            {/* Typewriter subtitle */}
            <div className="mt-4 flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl py-3 px-5 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse shrink-0" />
              <TypewriterText options={[
                "Hand-crafted physical goods vetted for the high-end marketplace...",
                "Aerospace-grade durability matched with ultra-sleek lifestyle aesthetics...",
                "Integrated directly from verified partner dealer warehouses globally...",
                "Express logistics delivering retail perfection within 4 business days..."
              ]} />
            </div>
          </div>

          {/* Dynamic reactive list */}
          {(() => {
            const partnerUploaded = products.filter(p => p.supplier === 'Partner Premium');
            const fallbackProducts = products.filter(p => p.id === 'cj-1001' || p.id === 'cj-1002' || p.id === 'cj-1003' || p.id === 'cj-1004' || p.id === 'cj-1005');
            const essentialShowlist = partnerUploaded.length > 0 ? [...partnerUploaded, ...fallbackProducts].slice(0, 4) : fallbackProducts.slice(0, 4);

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {essentialShowlist.map((p) => (
                  <motion.div
                    key={`ess-home-${p.id}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ ease: "easeOut", duration: 0.8 }}
                  >
                    <EssentialCard product={p} addToCart={addToCart} />
                  </motion.div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* FEATURED PRODUCTS SLIDER */}
      <section className="py-24 w-full bg-[#050505] relative overflow-hidden">
        {/* Scrolling text behind products */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 pointer-events-none opacity-[0.03] select-none">
           <motion.div 
             animate={{ x: [0, -1000] }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="text-[20vw] font-display font-black whitespace-nowrap uppercase"
           >
              TRENDING NOW EXCLUSIVE DROPS TRENDING NOW EXCLUSIVE DROPS
           </motion.div>
        </div>

        <div className="max-w-[1600px] mx-auto px-6 mb-16 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className="text-[#D4AF37] text-[10px] uppercase tracking-[0.5em] font-black mb-4 block">Curated Selection</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white uppercase tracking-tighter">
               Market <span className="gold-text-glow">Leaders</span>
            </h2>
          </div>
          <button 
            onClick={() => setActiveTab('shop')} 
            className="group px-8 py-3 bg-white/5 border border-white/10 text-white font-bold text-[10px] uppercase tracking-[0.3em] rounded-full hover:bg-white hover:text-black transition-all flex items-center gap-4"
          >
            Explore All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Horizontal scroll container with custom scrollbar */}
        <div className="w-full overflow-x-auto pb-12 hide-scrollbar px-6 relative z-10">
          <div className="flex gap-12 w-max max-w-[1600px] mx-auto">
            {featured.map((product) => (
              <div key={product.id} className="w-[350px] shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER-LIKE CALL TO ACTION */}
      <section className="py-32 bg-black flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
         
         <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           className="relative z-10"
         >
            <h2 className="text-5xl md:text-8xl font-display font-black text-white mb-10 uppercase tracking-tighter max-w-4xl mx-auto leading-none">
               READY TO <span className="italic text-[#D4AF37]">DOMINATE</span> THE MARKET?
            </h2>
            <button 
              onClick={() => setActiveTab('auth')}
              className="px-20 py-8 bg-[#D4AF37] text-black font-display font-black text-xl uppercase tracking-[8px] rounded-full hover:scale-110 hover:shadow-[0_0_50px_rgba(212,175,55,0.4)] transition-all duration-500"
            >
               JOIN AURA
            </button>
         </motion.div>
         
         <div className="mt-20 flex gap-12 opacity-30 grayscale contrast-125">
            <Bot className="w-8 h-8" />
            <ShieldCheck className="w-8 h-8" />
            <Zap className="w-8 h-8" />
            <TrendingUp className="w-8 h-8" />
            <Server className="w-8 h-8" />
         </div>
      </section>
      
    </div>
  );
}
