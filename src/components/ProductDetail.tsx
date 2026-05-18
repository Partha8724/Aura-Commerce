import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ChevronLeft, ChevronRight, Star, 
  ShoppingCart, Heart, Shield, Undo2, 
  Truck, HelpCircle, Share2, ZoomIn, Info, Check
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Product } from '../types';

interface ProductDetailProps {
  productId: string;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const { products, addToCart, settings, setSelectedProductId } = useStore();
  const product = products.find(p => p.id === productId);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews' | 'qa'>('desc');

  const uniqueColors = Array.from(new Set((product?.variants || []).map((v: any) => v.color).filter(Boolean))) as string[];
  const uniqueSizes = Array.from(new Set((product?.variants || []).map((v: any) => v.size).filter(Boolean))) as string[];

  useEffect(() => {
    // Reset state when product changes
    setActiveImageIndex(0);
    setQuantity(1);
    
    // Set initial colors and sizes
    const colors = Array.from(new Set((product?.variants || []).map((v: any) => v.color).filter(Boolean))) as string[];
    const sizes = Array.from(new Set((product?.variants || []).map((v: any) => v.size).filter(Boolean))) as string[];
    
    const initialColor = colors[0] || '';
    const initialSize = sizes[0] || '';
    
    setSelectedColor(initialColor);
    setSelectedSize(initialSize);
    
    const initialVariant = product?.variants?.find((v: any) => 
      (!initialColor || v.color === initialColor) && (!initialSize || v.size === initialSize)
    ) || product?.variants?.[0] || null;
    
    setSelectedVariant(initialVariant);

    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [productId, product]);

  // Update selectedVariant when color or size changes
  useEffect(() => {
    if (!product?.variants) return;
    const match = product.variants.find((v: any) => 
      (!selectedColor || v.color === selectedColor) && (!selectedSize || v.size === selectedSize)
    );
    setSelectedVariant(match || null);
  }, [selectedColor, selectedSize, product?.variants]);

  const images = [...(product?.images || [])];
  
  if (product?.variants) {
    product.variants.forEach((v: any) => {
      if (v.image && !images.includes(v.image)) {
        images.push(v.image);
      }
    });
  }

  if (images.length === 0) images.push('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop');

  useEffect(() => {
    if (selectedVariant?.image) {
      const idx = images.indexOf(selectedVariant.image);
      if (idx !== -1) setActiveImageIndex(idx);
    }
  }, [selectedVariant]);

  if (!product) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0A0A0A] flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <button 
            onClick={() => setSelectedProductId(null)}
            className="px-6 py-2 border border-white/20 rounded hover:bg-white/10"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const finalPrice = selectedVariant?.price || product.finalPrice || product.price || 0;
  const stock = selectedVariant?.stock ?? product.stock ?? 100;
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    // Ideally map variant to item, here we just use the product
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col overflow-y-auto overflow-x-hidden pt-20 pb-24"
    >
      {/* Top Bar with Back Button */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-[#0A0A0A] border-b border-white/10 px-6 flex items-center justify-between z-20">
        <button 
          onClick={() => setSelectedProductId(null)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Shop
        </button>
        <div className="text-xs text-gray-500 hidden sm:flex items-center gap-2">
          <span>Home</span> <ChevronRight className="w-3 h-3" />
          <span>{product.category || 'Product'}</span> <ChevronRight className="w-3 h-3" />
          <span className="text-gray-300 truncate max-w-[200px]">{product.title}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 mt-8 flex flex-col md:flex-row xl:flex-row gap-8 lg:gap-12 relative z-10">
        
        {/* LEFT COLUMN: IMAGES */}
        <div className="w-full md:w-[50%] lg:w-[60%] flex flex-col gap-4">
          {/* Main Image */}
          <div 
            className="relative w-full aspect-square bg-[#141414] rounded-2xl border border-white/5 overflow-hidden group cursor-zoom-in flex items-center justify-center p-8"
            onClick={() => setIsZoomModalOpen(true)}
          >
            <img 
              src={images[activeImageIndex]} 
              alt={product.title}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-125 origin-center"
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isHot && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Hot Seller</span>}
            </div>
            {/* Zoom Icon Overlay */}
            <div className="absolute bottom-4 right-4 bg-black/50 p-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={cn(
                  "w-20 h-20 flex-shrink-0 bg-[#141414] rounded-xl border-2 overflow-hidden flex items-center justify-center p-2",
                  activeImageIndex === idx ? "border-[#D4AF37]" : "border-transparent hover:border-white/20"
                )}
                style={{ borderColor: activeImageIndex === idx ? settings.themeColor : undefined }}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS */}
        <div className="w-full md:w-[50%] lg:w-[40%] flex flex-col gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight">
              {product.title}
            </h1>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Brand: <span className="text-[#D4AF37] cursor-pointer" style={{color: settings.themeColor}}>{product.brand || 'Generic'}</span></span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("w-4 h-4", i < Math.floor(product.rating || 4.5) ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-700")} style={{ color: i < Math.floor(product.rating || 4.5) ? settings.themeColor : undefined, fill: i < Math.floor(product.rating || 4.5) ? settings.themeColor : undefined }} />
                ))}
                <span className="text-sm text-gray-400 ml-2">({product.reviewsCount || 124})</span>
              </div>
            </div>
          </div>

          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Price */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold" style={{ color: settings.themeColor }}>
                ${finalPrice.toFixed(2)}
              </span>
              {product.is_on_offer && product.discount_price && (
                <span className="text-lg text-gray-500 line-through">
                  ${product.price?.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-sm text-gray-400 mt-1">Inclusive of all taxes</span>
          </div>

          {/* Offers */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-4 space-y-3">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" /> Available Offers
            </div>
            <ul className="text-sm text-gray-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span> 
                <span><strong className="text-gray-300">Bank Offer:</strong> 10% off with participating banks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span> 
                <span><strong className="text-gray-300">Free Shipping</strong> on orders above $50</span>
              </li>
            </ul>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-6">
              
              {/* Colors */}
              {uniqueColors.length > 0 && (
                <div className="space-y-3">
                  <div className="text-sm font-bold text-white flex gap-2">
                    Color: <span className="text-gray-400 font-normal">{selectedColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {uniqueColors.map(color => {
                      const isAvailable = product.variants!.some(v => v.color === color && v.stock > 0 && (!selectedSize || v.size === selectedSize));
                      const isSelected = selectedColor === color;
                      
                      // Check if there is an image for this color
                      const varWithImg = product.variants!.find(v => v.color === color && v.image);
                      
                      return (
                        <button
                          key={color}
                          onClick={() => {
                            setSelectedColor(color);
                            // Auto-select size if current one unavailable with new color
                            if (selectedSize && !product.variants!.some(v => v.color === color && v.size === selectedSize && v.stock > 0)) {
                              const availSize = product.variants!.find(v => v.color === color && v.size && v.stock > 0)?.size;
                              if (availSize) setSelectedSize(availSize);
                            }
                          }}
                          className={cn(
                            "w-10 h-10 rounded-full border-2 transition-all ring-offset-2 ring-offset-[#0A0A0A]",
                            isSelected ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/50" : "border-white/10 hover:border-white/50",
                            !isAvailable && "opacity-30 cursor-not-allowed hidden-or-strikethrough"
                          )}
                          style={{ 
                            backgroundColor: color.toLowerCase().replace(/ /g, ''),
                            borderColor: isSelected ? settings.themeColor : undefined 
                          }}
                          title={color}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {uniqueSizes.length > 0 && (
                <div className="space-y-3 mt-4">
                  <div className="text-sm font-bold text-white flex gap-2">
                    Size: <span className="text-gray-400 font-normal">{selectedSize}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {uniqueSizes.map(size => {
                      const isAvailable = product.variants!.some(v => v.size === size && v.stock > 0 && (!selectedColor || v.color === selectedColor));
                      const isOverallAvailable = product.variants!.some(v => v.size === size && v.stock > 0);
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => {
                            setSelectedSize(size);
                            if (selectedColor && !product.variants!.some(v => v.color === selectedColor && v.size === size && v.stock > 0)) {
                              const availColor = product.variants!.find(v => v.size === size && v.color && v.stock > 0)?.color;
                              if (availColor) setSelectedColor(availColor);
                            }
                          }}
                          disabled={!isOverallAvailable}
                          className={cn(
                            "px-5 py-2 border rounded-md text-sm font-medium transition-all",
                            isSelected 
                              ? "bg-[#D4AF37] border-[#D4AF37] text-black" 
                              : "border-white/10 text-gray-300 hover:border-white/30",
                            !isAvailable && "opacity-20 cursor-not-allowed bg-black text-gray-500 line-through"
                          )}
                          style={isSelected ? { backgroundColor: settings.themeColor, borderColor: settings.themeColor } : undefined}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Other Options / Styles (if no colors or sizes) */}
              {uniqueColors.length === 0 && uniqueSizes.length === 0 && (
                <div className="space-y-4">
                  <div className="text-sm font-bold text-white">Options:</div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVariant(v)}
                        className={cn(
                          "px-4 py-2 border rounded-lg text-sm transition-all",
                          selectedVariant === v 
                            ? "border-[#D4AF37] bg-white/5 text-white" 
                            : "border-white/10 text-gray-400 hover:border-white/30",
                          v.stock <= 0 && "opacity-50 cursor-not-allowed"
                        )}
                        style={{ borderColor: selectedVariant === v ? settings.themeColor : undefined }}
                        disabled={v.stock <= 0}
                      >
                        {v.sku || `Variant ${idx+1}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-sm text-gray-400 mb-2">Quantity:</span>
              <div className="flex items-center bg-[#1A1A1A] border border-white/10 rounded-lg w-fit">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-white hover:bg-white/5 transition-colors rounded-l-lg">-</button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(stock, quantity + 1))} className="px-4 py-3 text-white hover:bg-white/5 transition-colors rounded-r-lg">+</button>
              </div>
            </div>
            <div className="flex flex-col justify-end pb-2">
              {stock > 10 ? (
                <span className="text-green-500 text-sm font-bold">In Stock</span>
              ) : stock > 0 ? (
                <span className="text-orange-500 text-sm font-bold">Only {stock} left - order soon</span>
              ) : (
                <span className="text-red-500 text-sm font-bold">Out of Stock</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-4">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className={cn(
                "w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]",
                isAdded ? "bg-green-500 text-white" : "text-black"
              )}
              style={!isAdded ? { background: `linear-gradient(135deg, ${settings.themeColor}, #FFF)` } : undefined}
            >
              {isAdded ? <Check className="w-5 h-5 " /> : <ShoppingCart className="w-5 h-5" />} 
              {isAdded ? "Added to Cart" : "Add to Cart"}
            </motion.button>
            <div className="flex gap-3">
              <button className="flex-1 py-4 rounded-xl bg-transparent border border-white/20 text-white font-bold uppercase tracking-widest text-sm hover:bg-white/5 transition-all">
                Buy Now
              </button>
              <button 
                onClick={() => setIsWishlist(!isWishlist)}
                className="px-6 py-4 rounded-xl bg-[#1A1A1A] border border-white/5 text-white hover:bg-white/5 transition-all flex items-center justify-center"
              >
                <Heart className={cn("w-5 h-5", isWishlist ? "fill-red-500 text-red-500" : "")} />
              </button>
            </div>
          </div>

          {/* Shipping & Trust */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <Truck className="w-5 h-5 text-gray-300" />
              <div>
                <p className="font-bold text-gray-300">Free Shipping</p>
                <p className="text-xs">Est. 5-15 Days</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <Undo2 className="w-5 h-5 text-gray-300" />
              <div>
                <p className="font-bold text-gray-300">7 Days Return</p>
                <p className="text-xs">Money back guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS SECTION */}
      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 mt-16 z-10 relative">
        <div className="flex items-center border-b border-white/10 overflow-x-auto scrollbar-hide">
          {[
            { id: 'desc', label: 'Description' },
            { id: 'specs', label: 'Specifications' },
            { id: 'reviews', label: 'Reviews' },
            { id: 'qa', label: 'Q & A' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-8 py-4 text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-colors border-b-2",
                activeTab === tab.id 
                  ? "text-[#D4AF37] border-[#D4AF37]" 
                  : "text-gray-500 border-transparent hover:text-gray-300"
              )}
              style={{ 
                color: activeTab === tab.id ? settings.themeColor : undefined,
                borderColor: activeTab === tab.id ? settings.themeColor : undefined
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-8 text-gray-300 bg-[#141414]/30 rounded-b-2xl px-6 border-x border-b border-white/5 min-h-[400px]">
          {activeTab === 'desc' && (
            <div className="max-w-3xl space-y-6">
              <h3 className="text-2xl font-bold text-white mb-4">Product Description</h3>
              <div 
                className="text-gray-400 leading-relaxed product-description-html"
                dangerouslySetInnerHTML={{ __html: product.description || 'Elevate your lifestyle with this premium product, sourced with precision and handled with care. This item brings top-tier quality seamlessly straight to your door.' }}
              />
              <ul className="space-y-2 mt-6">
                <li className="flex gap-2">
                  <span style={{ color: settings.themeColor }}>•</span> 
                  High-quality materials and exquisite craftsmanship.
                </li>
                <li className="flex gap-2">
                  <span style={{ color: settings.themeColor }}>•</span> 
                  Designed to last with durability in mind.
                </li>
                <li className="flex gap-2">
                  <span style={{ color: settings.themeColor }}>•</span> 
                  Sleek profile suitable for any occasion.
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <h3 className="text-xl font-bold text-white mb-6">Technical Specifications</h3>
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ['Brand', product.brand || 'Generic'],
                    ['Category', product.category || 'N/A'],
                    ['Weight', product.weight ? `${product.weight} kg` : 'N/A'],
                    ['Shipping Method', product.shipping_method || 'Standard'],
                    ['Material', 'Premium Composite'],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-4 text-gray-500 font-medium w-1/3">{row[0]}</td>
                      <td className="py-4 text-gray-300">{row[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="w-full md:w-1/3 space-y-6">
                  <h3 className="text-xl font-bold text-white">Customer Reviews</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-bold">{product.rating || 4.5}</span>
                    <div className="flex flex-col">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={cn("w-4 h-4", i < Math.floor(product.rating || 4.5) ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-700")} style={{ color: i < Math.floor(product.rating || 4.5) ? settings.themeColor : undefined, fill: i < Math.floor(product.rating || 4.5) ? settings.themeColor : undefined }} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{product.reviewsCount || 124} global ratings</span>
                    </div>
                  </div>
                  <button className="w-full py-3 border border-white/20 rounded-lg font-bold hover:bg-white/5 transition-colors">
                    Write a Review
                  </button>
                </div>
                <div className="w-full md:w-2/3 space-y-6">
                   {/* Dummy Review */}
                   <div className="space-y-2 border-b border-white/5 pb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500" />
                        <span className="font-bold text-white">Sarah Jenkins</span>
                        <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded">Verified Purchase</span>
                      </div>
                      <div className="flex mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={cn("w-3 h-3", i < 5 ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-700")} style={{ color: settings.themeColor, fill: settings.themeColor }} />
                        ))}
                      </div>
                      <h4 className="font-bold text-white">Exceeded my expectations!</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        I was hesitant to order at first, but the quality of this product is fantastic. The shipping was fast and it arrived in perfect condition. Highly recommend!
                      </p>
                      <div className="text-xs text-gray-500 mt-4">Helpful? <span className="hover:text-white cursor-pointer ml-1">Yes (12)</span> | <span className="hover:text-white cursor-pointer">No (0)</span></div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'qa' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Customer Questions</h3>
                <button className="text-sm font-bold text-[#D4AF37] hover:underline" style={{ color: settings.themeColor }}>Ask a Question</button>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="font-bold text-white flex gap-3 items-start"><span className="text-[#D4AF37]">Q:</span> Is this item covered by warranty?</p>
                  <p className="text-gray-400 mt-2 flex gap-3 items-start ml-6">
                    <span className="text-gray-500">A:</span> 
                    Yes, it comes with a standard 1-year manufacturer warranty against defects.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ZOOM MODAL */}
      <AnimatePresence>
        {isZoomModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black flex items-center justify-center p-4 sm:p-12"
          >
            <button 
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-6 right-6 text-white p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-6 text-white p-4 bg-white/5 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button 
              onClick={() => setActiveImageIndex((prev) => (prev + 1) % images.length)}
              className="absolute right-6 text-white p-4 bg-white/5 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
            
            <img 
              src={images[activeImageIndex]} 
              alt="Zoomed" 
              className="w-full h-full object-contain cursor-zoom-out"
              onClick={() => setIsZoomModalOpen(false)}
            />
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
              {activeImageIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
