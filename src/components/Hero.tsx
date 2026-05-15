import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronRight, Zap, Target, Globe } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Hero() {
  const { products } = useStore();
  const [textIndex, setTextIndex] = useState(0);
  const titles = ["Where AI Meets Profit", "The Future of Retail", "Automated Commerce"];
  const [stats, setStats] = useState({ deals: 1420, profit: 89 });
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % titles.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const statsInterval = setInterval(() => {
      setStats(prev => ({
        deals: prev.deals + Math.floor(Math.random() * 3),
        profit: prev.profit + (Math.random() > 0.5 ? 1 : 0)
      }));
    }, 3000);
    return () => clearInterval(statsInterval);
  }, []);

  const heroProduct = products[0] || {
    id: 'default',
    title: 'Aura Premium Product',
    supplier: 'AURA',
    stock: 0,
    basePrice: 0,
    profit: 0,
    commission: 0,
    price: 0,
    finalPrice: 0,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-[#020202]"
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-[-150px] right-[-100px] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]" 
        />
        
        {/* Subtle Grid Pattern with parallax */}
        <motion.div 
          style={{ y: y3, opacity }}
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
        />

        {/* Floating Decorative Elements */}
        <motion.div
          style={{ y: y2, x: 50 }}
          className="absolute top-1/4 right-1/4 w-2 h-2 bg-indigo-500/30 rounded-full blur-sm"
        />
        <motion.div
          style={{ y: y1, x: -100 }}
          className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-blue-400/20 rounded-full blur-sm"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-10 relative z-20 w-full items-center">
        
        {/* Left Section: Hero & Intro */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 flex items-center gap-3"
          >
            <span className="h-[1px] w-12 bg-indigo-500"></span>
            <span className="text-indigo-400 text-xs font-bold tracking-[0.3em] uppercase">The Future of Automated Retail</span>
          </motion.div>

          <div className="space-y-4 mb-8">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black leading-[0.85] tracking-tighter">
              <span className="block text-white">AURA</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/30">COMMERCE.</span>
            </h1>
          </div>

          <p className="text-neutral-400 text-lg max-w-md leading-relaxed mb-10">
            The world's first AI-native dropshipping infrastructure. Deploy a global storefront in <span className="text-white font-bold">0.8 seconds</span> with autonomous supply chain fulfillment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-none hover:bg-indigo-400 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)] inline-flex items-center justify-center gap-2"
            >
              Initialize Store <ChevronRight className="w-4 h-4" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 border border-white/20 font-bold uppercase tracking-widest text-xs rounded-none backdrop-blur-sm hover:border-indigo-400 hover:text-indigo-400 transition-colors inline-flex items-center justify-center"
            >
              Watch Keynote
            </motion.button>
          </div>

          {/* Live Stats */}
          <div className="flex flex-wrap gap-12 pt-8 border-t border-white/5">
            <div className="flex flex-col">
              <span className="text-indigo-400 text-lg font-black flex items-center gap-2">
                {stats.deals.toLocaleString()} <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Active Deals</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white text-lg font-black flex items-center gap-1">
                {stats.profit}% <Zap className="w-4 h-4 text-indigo-400" />
              </span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Avg. Margin</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white text-lg font-black flex items-center gap-1">
                24/7 <Target className="w-4 h-4 text-indigo-400" />
              </span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest">AI Sourcing</span>
            </div>
          </div>
        </div>

        {/* Right Section: Product Showcase */}
        <div className="lg:col-span-5 flex items-center justify-center relative perspective-[1000px]">
          <motion.div 
            animate={{ 
              rotateY: [0, 3, 0, -3, 0],
              rotateX: [0, -1, 0, 1, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="relative w-full max-w-[380px] bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl group overflow-hidden transform-style-3d"
          >
            {/* Glass Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start mb-8 relative z-20">
              <span className="bg-indigo-500/10 text-indigo-300 text-[10px] font-bold px-3 py-1 rounded-full border border-indigo-500/20 uppercase">
                {heroProduct?.supplier || 'AURA'}
              </span>
              <div className="text-right">
                <div className="text-[10px] opacity-40 uppercase tracking-tighter">Inventory Level</div>
                <div className="text-green-400 font-mono text-sm">{heroProduct?.stock || 0} UNITS</div>
              </div>
            </div>

            <div className="aspect-[4/5] bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl mb-8 flex items-center justify-center relative overflow-hidden group/img">
               <div className="w-48 h-48 bg-white/5 rounded-full blur-2xl absolute pointer-events-none" />
               <img 
                  src={heroProduct?.images?.[0] || heroProduct?.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'} 
                  alt={heroProduct?.title || 'Product'}
                  className="w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover/img:scale-110"
                />
            </div>

            <div className="space-y-4 relative z-20">
              <h3 className="text-2xl font-bold tracking-tight text-white">{heroProduct?.title || 'Loading...'}</h3>
              <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4">
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase">Unit Cost</div>
                  <div className="text-xl font-mono text-neutral-300">${(heroProduct?.basePrice || 0).toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-indigo-400 uppercase">Net Profit</div>
                  <div className="text-xl font-mono text-indigo-400">+${(heroProduct?.profit || heroProduct?.commission || 0).toFixed(2)}</div>
                </div>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                <span className="text-xs text-neutral-400">Consumer Listing</span>
                <span className="text-2xl font-bold text-white">${(heroProduct?.finalPrice || heroProduct?.price || 0).toFixed(2)}</span>
              </div>
            </div>
            
          </motion.div>
        </div>

      </div>
    </section>
  );
}
