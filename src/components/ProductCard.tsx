import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const addToCart = useStore(state => state.addToCart);
  const setSelectedProductId = useStore(state => state.setSelectedProductId);
  
  const [showQuickView, setShowQuickView] = useState(false);

  // 3D Tilt Effect Setup
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="bg-[#141414] border border-[#D4AF37]/20 rounded-2xl p-5 backdrop-blur-2xl transition-all duration-300 group overflow-hidden flex flex-col h-full relative hover:border-[#D4AF37]/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]"
    >
      {/* Header Badges */}
      <div className="absolute top-8 w-[calc(100%-40px)] left-5 flex justify-between items-start z-30 pointer-events-none">
        <div className="flex flex-col gap-2">
          {!product.isDemo && (
            <span className="bg-[#50C878] text-black text-[9px] font-bold px-2 py-1 rounded inline-block w-fit uppercase tracking-widest shadow-[0_0_10px_rgba(80,200,120,0.4)]">
              Verified Source
            </span>
          )}
          {product.isHot && (
            <span className="bg-[#D4AF37] text-black text-[9px] font-bold px-2 py-1 rounded inline-block w-fit uppercase tracking-widest shadow-[0_0_10px_rgba(212,175,55,0.5)]">
              HOT
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#E5E4E2] text-black text-[9px] font-bold px-2 py-1 rounded inline-block w-fit uppercase tracking-widest">
              NEW
            </span>
          )}
        </div>
        <button 
          onClick={(e) => { e.preventDefault(); setIsWishlist(!isWishlist); }}
          className="pointer-events-auto p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 hover:border-[#D4AF37] transition-all"
        >
          <Heart className={`w-4 h-4 ${isWishlist ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-white'}`} />
        </button>
      </div>

      {/* Image Container */}
      <div 
        className="relative aspect-square bg-[#0A0A0A] rounded-xl mb-5 flex items-center justify-center overflow-hidden border border-white/5 translate-z-[10px] cursor-pointer"
        onClick={() => setSelectedProductId(product.id)}
      >
        <img
          src={product.images?.[0] || product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'}
          alt={product.title}
          className={cn(
            "w-full h-full object-cover transition-all duration-1000 grayscale opacity-70",
            isHovered ? "scale-110 opacity-100 grayscale-0" : "scale-100"
          )}
        />
        
        {/* Quick View Target */}
        <div className={cn(
          "absolute inset-0 bg-[#0A0A0A]/40 backdrop-blur-sm z-10 flex items-center justify-center transition-all duration-500",
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 border border-[#D4AF37] text-[#D4AF37] font-medium tracking-widest uppercase text-[10px] hover:bg-[#D4AF37] hover:text-black transition-colors rounded backdrop-blur-md whitespace-nowrap">
            Quick View
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col flex-grow z-20 bg-transparent translate-z-[20px]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 4) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-700'}`} />
            ))}
            <span className="text-[10px] text-gray-500 ml-1">({product.reviews || Math.floor(Math.random() * 200 + 50)})</span>
          </div>
          <div className="text-[#D4AF37] font-semibold tracking-tight text-lg">
            ${(product.finalPrice || product.price || 0).toFixed(2)}
          </div>
        </div>
        
        <h3 className="text-sm md:text-base font-bold font-sans tracking-tight text-white mb-4 line-clamp-2">{product.title}</h3>
        
        <div className="mt-auto space-y-3">
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="w-full h-12 gold-gradient text-black font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
          >
            <ShoppingCart className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}
