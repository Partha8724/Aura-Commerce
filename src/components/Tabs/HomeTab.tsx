import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useStore } from '../../store/useStore';
import { ArrowRight, Play, ShoppingCart, TrendingUp, ShieldCheck, Server, Bot, Search, Sparkles, Zap, Shield, Globe } from 'lucide-react';
import { ProductCard } from '../ProductCard';
import { ProductFlipCard } from '../ProductFlipCard';

export function HomeTab() {
  const { setActiveTab, stats, products, settings } = useStore();
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
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Demo Bot State
  const [demoUrl, setDemoUrl] = useState("");
  const [demoState, setDemoState] = useState<'idle' | 'importing' | 'success'>('idle');
  const [demoLog, setDemoLog] = useState<string[]>([]);

  const runDemoBot = () => {
    if (!demoUrl) setDemoUrl('https://cjdropshipping.com/product/aurabuds-pro');
    setDemoState('importing');
    setDemoLog(['[SYSTEM] Initializing extraction engine...']);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      
      if (progress === 25) setDemoLog(prev => [...prev, '[NETWORK] Connecting to supplier API...', '✓ Product Found!']);
      if (progress === 50) setDemoLog(prev => [...prev, '[PROCESSING] Extracting high-res images and specs...']);
      if (progress === 75) setDemoLog(prev => [...prev, '[AURA AI] Calculating optimal price markup...']);
      
      if (progress === 100) {
        clearInterval(interval);
        setDemoLog(prev => [...prev, '✓ Product successfully integrated.']);
        setTimeout(() => {
          setDemoState('success');
        }, 800);
      }
    }, 800);
  };

  const featured = products.slice(0, 8);
  const showcaseProducts = products.slice(0, 3);

  return (
    <div ref={containerRef} className="flex flex-col bg-[#0A0A0A] overflow-hidden w-full">
      
      {/* HERO SECTION - APPLE STYLE */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-24 overflow-hidden px-4 md:px-8 bg-black">
        {/* Parallax Background Elements */}
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0 radial-gradient-gold">
           <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#D4AF37] opacity-[0.05] blur-[150px] rounded-full" />
           <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white opacity-[0.02] blur-[100px] rounded-full" />
        </motion.div>

        {/* Floating 3D-Like Shapes */}
        <motion.div 
          style={{ y: y2, rotate }} 
          className="absolute top-40 right-[15%] w-32 h-32 border border-white/10 rounded-2xl backdrop-blur-xl rotate-12 hidden lg:block opacity-20"
        />
        <motion.div 
          style={{ y: y1, rotate: -rotate }} 
          className="absolute bottom-40 left-[10%] w-24 h-24 border border-[#D4AF37]/20 rounded-full backdrop-blur-md -rotate-12 hidden lg:block opacity-20"
        />

        <motion.div 
          style={{ opacity }}
          className="max-w-[1200px] mx-auto w-full text-center relative z-10 flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
             <span className="px-4 py-1.5 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] uppercase tracking-[0.4em] font-bold bg-[#D4AF37]/5 backdrop-blur-sm shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                Luxury Dropshipping Reimagined
             </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-[110px] font-black font-display leading-[1.0] mb-6 tracking-[-0.03em] text-white uppercase text-balance"
          >
            AURA <span className="gold-text-glow">COMMERCE</span>
          </motion.h1>

          <div className="h-12 flex items-center justify-center mb-8">
               <span className="font-mono font-medium text-gray-500 text-sm md:text-base tracking-[0.1em] uppercase">
                 {displayText}
                 <motion.span 
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2 h-5 inline-block ml-2 bg-[#D4AF37] align-middle" 
                 />
               </span>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2, duration: 0.8 }} 
            className="text-xl md:text-2xl font-light text-gray-400 mb-12 max-w-2xl leading-relaxed"
          >
            {settings.heroSubtitle}. Our AI engine automates your entire supply chain with mathematical precision.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4 }} 
            className="flex flex-col sm:flex-row gap-6"
          >
            <button 
              onClick={() => setActiveTab('shop')} 
              className="w-full sm:w-auto px-12 py-5 bg-white text-black font-display font-bold text-sm uppercase tracking-[4px] rounded-full hover:bg-[#D4AF37] hover:scale-105 transition-all duration-300"
            >
              The Collection
            </button>
            <button 
              onClick={() => setActiveTab('auth')} 
              className="w-full sm:w-auto px-12 py-5 bg-transparent border border-white/20 text-white font-display font-bold text-sm uppercase tracking-[4px] rounded-full hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all backdrop-blur-sm"
            >
              Start Selling
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

      {/* SELLING NOW / REGISTER SECTION - 3D MOTION */}
      <section className="relative py-40 overflow-hidden bg-black">
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

      {/* FEATURED PRODUCTS SLIDER */}
      <section className="py-24 w-full bg-[#141414] border-t border-[#222222]">
        <div className="max-w-[1600px] mx-auto px-6 mb-12 flex justify-between items-end">
          <h2 className="text-3xl md:text-4xl font-display font-bold flex items-center gap-3" style={{ color: settings.themeColor }}>
             <TrendingUp className="w-8 h-8" /> TRENDING PRODUCTS
          </h2>
          <button 
            onClick={() => setActiveTab('shop')} 
            className="text-sm font-bold tracking-[0.2em] uppercase text-gray-400 transition-colors flex items-center gap-2"
            onMouseEnter={(e) => e.currentTarget.style.color = settings.themeColor}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
          >
            View Catalog <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal scroll container */}
        <div className="w-full overflow-x-auto pb-12 hide-scrollbar px-6">
          <div className="flex gap-8 w-max max-w-[1600px] mx-auto pl-0 md:pl-6">
            {featured.map((product) => (
              <div key={product.id} className="w-[320px] shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}
