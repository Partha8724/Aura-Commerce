import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ShoppingCart, ArrowRight, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';

interface ProductFlipCardProps {
  product: any;
}

export function ProductFlipCard({ product }: ProductFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { setSelectedProductId, settings } = useStore();
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsFlipped(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 150, rotateZ: -10, scale: 0.5 }}
      whileInView={{ opacity: 1, y: 0, rotateZ: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        type: "spring", 
        stiffness: 80, 
        damping: 15,
        delay: Math.random() * 0.3
      }}
      ref={cardRef}
      className="relative w-full aspect-[4/5] perspective-[2000px] cursor-pointer group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => setSelectedProductId(product.id)}
    >
      <motion.div
        className="w-full h-full relative transition-all duration-500"
        style={{ 
          transformStyle: 'preserve-3d',
          rotateX: isFlipped ? 0 : rotateX,
          rotateY: isFlipped ? "180deg" : rotateY,
        }}
        animate={{ 
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      >
        {/* Front Side */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-[40px] overflow-hidden bg-[#0D0D0D] border border-white/5 p-8 flex flex-col items-center justify-center text-center shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          <motion.div 
            className="w-52 h-52 mb-8 relative"
            style={{ transform: 'translateZ(80px)' }}
          >
            <img 
              src={product.imageUrl || product.images?.[0]} 
              alt={product.title} 
              className="w-full h-full object-contain filter drop-shadow(0 30px 40px rgba(0,0,0,0.6))"
            />
          </motion.div>

          <div style={{ transform: 'translateZ(50px)' }} className="flex flex-col items-center">
            <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.4em] font-bold mb-3">Limited Edition</p>
            <h3 className="text-2xl font-display font-medium text-white mb-2 line-clamp-2 px-4 leading-tight">{product.title}</h3>
            <div className="w-8 h-[1px] bg-white/20 mb-6" />
            <p className="text-3xl font-light text-white tracking-tighter">$ {(product.price || 0).toFixed(2)}</p>
          </div>
        </div>

        {/* Back Side */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-[40px] overflow-hidden border border-[#D4AF37]/20 p-10 flex flex-col justify-between text-left"
          style={{ 
            transform: 'rotateY(180deg) translateZ(1px)', 
            background: 'linear-gradient(135deg, #050505 0%, #151515 100%)' 
          }}
        >
          <div className="absolute top-0 right-0 p-8">
             <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
          </div>

          <div>
            <h4 className="text-gray-500 font-display font-bold text-[10px] mb-6 uppercase tracking-[0.3em]">Technical Specifications</h4>
            <div className="space-y-6">
              {[
                { label: 'Supply Speed', value: '4.2s (Instant)' },
                { label: 'Global Availability', value: '180+ Countries' },
                { label: 'Risk Factor', value: '0.02% (Verified)' }
              ].map((spec, i) => (
                <div key={i} className="border-l border-white/10 pl-4">
                  <div className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">{spec.label}</div>
                  <div className="text-white text-sm font-medium mt-1">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
             <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Estimated Profit</span>
                <span className="text-2xl font-bold font-display text-[#D4AF37]">
                  +${((product.price || 0) * 0.4).toFixed(2)}
                </span>
             </div>
             
             <button 
                className="group/btn w-full py-4 rounded-full bg-white text-black font-bold uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-[#D4AF37] transition-all duration-500 active:scale-95"
             >
                <ShoppingCart className="w-4 h-4" /> Import to my shop
             </button>
             
             <button className="w-full text-[9px] text-gray-600 uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:text-[#D4AF37] transition-colors">
               Full Intelligence Report <ArrowRight className="w-3 h-3" />
             </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
