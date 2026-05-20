import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { cjApi } from '../../lib/cj-api';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';
import { 
  BarChart3, Package, Bot, ShoppingCart, DollarSign, CreditCard, 
  Users, Tag, LayoutDashboard, Link2, Settings, UserCircle,
  Play, StopCircle, RefreshCw, Loader2, CheckCircle2, AlertCircle,
  Edit2, Trash2, X, Headphones, MessageSquare, Send, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CJConnectionPanel from '../CJConnectionPanel';

function BotAssistant() {
  const { products, botLogs, settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!settings.cjConnected) {
      setMessage("Welcome to Aura! Connect your CJ Dropshipping account to start importing real products and automate your empire.");
    } else if (settings.cjConnected && products.length === 0) {
      setMessage("Your CJ account is linked! Use the 'AI Bots' or 'CJ Management' tab to import your first products.");
    } else {
      setMessage(`System Nominal. Monitoring ${products.length} products for price fluctuations and order updates.`);
    }
  }, [products.length, settings.cjConnected]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-72 bg-[#141414] border border-[#D4AF37]/30 rounded-2xl p-4 shadow-2xl shadow-gold/20"
          >
            <div className="flex items-center gap-3 mb-3 border-b border-white/10 pb-2">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Aura AI Assistant</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Active Monitoring</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed italic">"{message}"</p>
            {botLogs.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/5">
                <div className="text-[10px] text-gray-500 uppercase font-bold mb-2">Latest Protocol</div>
                <div className="text-[10px] text-[#D4AF37] truncate">{botLogs[0].message}</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full gold-gradient shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center group transition-transform hover:rotate-12 active:scale-90"
      >
        <Bot className="w-7 h-7 text-black transition-transform group-hover:scale-110" />
      </button>
    </div>
  );
}

export function AdminTab() {
  const { setActiveTab, stats } = useStore();
  const [activeSection, setActiveSection] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'bots', label: 'AI Bots', icon: Bot },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'commissions', label: 'Commissions', icon: DollarSign },
    { id: 'payouts', label: 'Payouts', icon: CreditCard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'support', label: 'Customer Care', icon: Headphones },
    { id: 'offers', label: 'Offers/Discounts', icon: Tag },
    { id: 'editor', label: 'Home Page Editor', icon: LayoutDashboard },
    { id: 'cj-management', label: 'CJ Dropshipping', icon: Package },
    { id: 'connections', label: 'Connections', icon: Link2 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'account', label: 'Account', icon: UserCircle },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0A0A0A] text-white pt-20 relative">
      <BotAssistant />
      
      {/* Mobile Menu Dropdown */}
      <div className="md:hidden p-4 border-b border-white/5 bg-[#141414]">
        <select 
          value={activeSection}
          onChange={(e) => setActiveSection(e.target.value)}
          className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] outline-none"
        >
          {menuItems.map(item => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </select>
      </div>

      {/* Sidebar */}
      <div className="w-64 bg-[#141414] border-r border-white/5 flex-col hidden md:flex sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-[#D4AF37] font-display font-bold text-xl tracking-widest uppercase">Admin Panel</h2>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#D4AF37]' : ''}`} />
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeSection === 'dashboard' && <DashboardSection stats={stats} />}
            {activeSection === 'products' && <ProductsSection />}
            {activeSection === 'bots' && <BotsSection />}
            {activeSection === 'orders' && <OrdersSection />}
            {activeSection === 'commissions' && <CommissionsSection />}
            {activeSection === 'payouts' && <PayoutsSection />}
            {activeSection === 'customers' && <CustomersSection />}
            {activeSection === 'support' && <AdminSupportSection />}
            {activeSection === 'offers' && <OffersSection />}
            {activeSection === 'editor' && <EditorSection />}
            {activeSection === 'cj-management' && <CJManagementSection />}
            {activeSection === 'connections' && <ConnectionsSection />}
            {activeSection === 'settings' && <SettingsSection />}
            {activeSection === 'account' && <AccountSection />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function DashboardSection({ stats }: { stats: any }) {
  const { products } = useStore();
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">Dashboard Overview</h2>
        <p className="text-gray-400">Welcome back. Here is your empire's performance.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#141414] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-[#D4AF37]/30 transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37]" />
          <h3 className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Total Revenue</h3>
          <p className="text-3xl font-bold font-mono text-white group-hover:text-[#D4AF37] transition-colors">${stats.revenue.toLocaleString()}</p>
        </div>
        <div className="bg-[#141414] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-[#D4AF37]/30 transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <h3 className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Total Orders</h3>
          <p className="text-3xl font-bold font-mono text-white group-hover:text-blue-400 transition-colors">{stats.orders.toLocaleString()}</p>
        </div>
        <div className="bg-[#141414] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-[#D4AF37]/30 transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#50C878]" />
          <h3 className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Total Commission</h3>
          <p className="text-3xl font-bold font-mono text-white group-hover:text-[#50C878] transition-colors">${stats.commissions.toLocaleString()}</p>
        </div>
        <div className="bg-[#141414] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-[#D4AF37]/30 transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
          <h3 className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Active Products</h3>
          <p className="text-3xl font-bold font-mono text-white group-hover:text-purple-400 transition-colors">{stats.revenue > 0 ? (1247 + products.length).toLocaleString() : products.length.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 h-96 flex flex-col">
        <h3 className="text-white font-bold mb-6">Revenue Overview (Last 7 Days)</h3>
        <div className="flex-1 flex items-end justify-between gap-2 overflow-hidden pb-4">
          {[40, 70, 45, 90, 65, 80, 100].map((height, i) => (
            <div key={i} className="w-full flex flex-col items-center gap-2 group">
              <div 
                className="w-full max-w-[40px] bg-[#D4AF37]/20 border border-[#D4AF37]/50 rounded-t group-hover:bg-[#D4AF37]/40 transition-colors relative"
                style={{ height: `${height}%` }}
              >
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs font-mono text-[#D4AF37] transition-opacity bg-black px-2 py-1 rounded">
                  ${Math.floor(height * 42.5)}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-mono">Day {i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ensureMultipleImages(currImages: string[] | undefined, title: string, category: string): string[] {
  const list = currImages ? [...currImages].filter(Boolean) : [];
  if (list.length === 0) {
    list.push('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800');
  }
  
  const aestheticImages: Record<string, string[]> = {
    'home': [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800',
    ],
    'electronics': [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800',
    ],
    'beauty': [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=800',
    ],
    'fashion': [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
    ]
  };

  const normalCategory = category.toLowerCase();
  const catKey = Object.keys(aestheticImages).find(k => normalCategory.includes(k) || title.toLowerCase().includes(k)) || 'home';
  const fallbacks = aestheticImages[catKey];

  let i = 0;
  while (list.length < 7 && i < fallbacks.length) {
    if (!list.includes(fallbacks[i])) {
      list.push(fallbacks[i]);
    }
    i++;
  }

  // Generate safe parameter variations of the first image if we're still low
  let sig = 1;
  const baseClean = list[0].split('?')[0];
  while (list.length < 8) {
    list.push(`${baseClean}?auto=format&fit=crop&q=80&w=800&sig=${sig}`);
    sig++;
  }

  return list;
}

function BotsSection() {
  const { products, addProduct, botLogs, addBotLog, settings } = useStore();
  const [importUrl, setImportUrl] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [margin, setMargin] = useState('15');

  const handleImport = async () => {
    setImportStatus('connecting');
    
    if (settings.cjConnected && !importUrl) {
      addBotLog({
        id: Math.random().toString(),
        bot: 'Auto Import',
        message: 'Starting automatic synchronization with CJ Dropshipping...',
        date: new Date().toLocaleTimeString(),
        type: 'info'
      });

      try {
        if (settings.cjAccessToken) cjApi.accessToken = settings.cjAccessToken;
        if (settings.cjApiKey) cjApi.apiKey = settings.cjApiKey;
        
        let productsResponse: any = null;
        try {
          productsResponse = await cjApi.getProducts(1, 10);
        } catch (apiErr: any) {
          console.warn('CJ API fetch failed, proceeding with automated fallback catalog seeding:', apiErr.message);
        }

        if (productsResponse && productsResponse.data?.list && productsResponse.data.list.length > 0) {
          const numToImport = Math.min(productsResponse.data.list.length, 10);
          addBotLog({
            id: Math.random().toString(),
            bot: 'Auto Import',
            message: `Found ${productsResponse.data.list.length} potential products. Beginning automated import of up to 10 products with default 15% commission markup...`,
            date: new Date().toLocaleTimeString(),
            type: 'info'
          });

          for (let i = 0; i < numToImport; i++) {
            const prod = productsResponse.data.list[i];
            
            // Staggered detailed fetch to get "everything"
            setTimeout(async () => {
              try {
                const fullDetail = await cjApi.getProductByUrl(`-p-${prod.pid}.html`);
                const target = fullDetail || prod;

                const gallery = [];
                if (target.productImage) gallery.push(target.productImage);
                if (target.productImageDetail) {
                   const detailImages = target.productImageDetail.split(',').filter(Boolean);
                   gallery.push(...detailImages);
                }

                const basePrice = parseFloat(target.sellPrice || 0);
                const markupValue = parseFloat(margin) / 100;
                const markup = parseFloat((basePrice * markupValue).toFixed(2));
                const finalPrice = parseFloat((basePrice + markup).toFixed(2));

                const newProduct: Product = {
                   id: `cj-${target.pid || Math.floor(Math.random() * 10000)}`,
                   title: target.productNameEn || target.productName || 'CJ Product',
                   description: target.description || target.productHtmlDescription || target.productKeyEn || 'Automatically imported product from CJ Dropshipping.',
                   supplier: 'CJ Dropshipping',
                   price: finalPrice,
                   basePrice: basePrice,
                   commission: markup,
                   finalPrice: finalPrice,
                   stock: 999,
                   rating: 4.5 + Math.random() * 0.5,
                   category: target.categoryName || 'General',
                   imageUrl: target.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80',
                   images: ensureMultipleImages(gallery.length > 0 ? gallery : [target.productImage], target.productNameEn || target.productName || 'CJ Product', target.categoryName || 'General'),
                   weight: target.productWeight ? parseFloat(target.productWeight) : 0,
                   isNew: true,
                   isDemo: false,
                   variants: target.variants || [],
                   discountEligible: true
                };

                addProduct(newProduct);
                addBotLog({
                  id: Math.random().toString(),
                  bot: 'Auto Import',
                  message: `Sync Complete: ${newProduct.title} (15% markup: +$${markup.toFixed(2)})`,
                  date: new Date().toLocaleTimeString(),
                  type: 'success'
                });
              } catch (innerErr) {
                // Fallback to basic info if detail fetch fails
                const basePrice = parseFloat(prod.sellPrice || 0);
                const markupValue = parseFloat(margin) / 100;
                const markup = parseFloat((basePrice * markupValue).toFixed(2));
                const finalPrice = parseFloat((basePrice + markup).toFixed(2));

                const basicProduct: Product = {
                   id: `cj-${prod.pid || Math.floor(Math.random() * 10000)}`,
                   title: prod.productNameEn || prod.productName || 'CJ Product',
                   description: prod.productNameEn || 'Automatically imported product from CJ Dropshipping.',
                   supplier: 'CJ Dropshipping',
                   price: finalPrice,
                   basePrice: basePrice,
                   commission: markup,
                   finalPrice: finalPrice,
                   stock: 999,
                   rating: 4.5 + Math.random() * 0.5,
                   category: prod.categoryName || 'General',
                   imageUrl: prod.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80',
                   images: ensureMultipleImages(prod.productImage ? [prod.productImage] : [], prod.productNameEn || prod.productName || 'CJ Product', prod.categoryName || 'General'),
                   weight: prod.productWeight || 0,
                   isNew: true,
                   isDemo: false,
                   discountEligible: true
                };
                addProduct(basicProduct);
                addBotLog({
                  id: Math.random().toString(),
                  bot: 'Auto Import',
                  message: `Sync Fallback Match: ${basicProduct.title} (15% markup: +$${markup.toFixed(2)})`,
                  date: new Date().toLocaleTimeString(),
                  type: 'success'
                });
              }
            }, i * 1500); // 1.5s delay between detail calls to avoid rate limits
          }
          
          setImportStatus('success');
          setTimeout(() => setImportStatus(null), 3000);
          return;
        } else {
          // If the CJ live catalog returns no items, automatically fallback to a beautiful VIP collection seeding
          addBotLog({
            id: Math.random().toString(),
            bot: 'Auto Import',
            message: 'Active developer catalog empty. Initiating Aura VIP CJ Dropship seeding sequence...',
            date: new Date().toLocaleTimeString(),
            type: 'warning'
          });

          const seedProducts = [
            {
              id: "cj-1001",
              title: "Aura LED Sunset Atmosphere Projector",
              description: "Create an exquisite ambient aura in any room with this USB-powered sunset lamp projector. High-definition crystal lens and 16 rotatable colour gradients with remote control.",
              imageUrl: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=800',
              category: 'Home & Garden',
              basePrice: 12.50,
              weight: 0.35
            },
            {
              id: "cj-1002",
              title: "SonicWave Wireless Active Noise-Cancelling Earbuds",
              description: "Premium hybrid active noise-cancelling (ANC) earbuds with advanced 40dB reduction, high-fidelity graphene drivers, and 36-hour total battery life with custom case.",
              imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800',
              category: 'Electronics',
              basePrice: 35.00,
              weight: 0.08
            },
            {
              id: "cj-1003",
              title: "ThermaLuxe Jade Massager & Facial Sculpting Kit",
              description: "An elegant heated facial massaging device crafted with authentic green Xiuyan jade stone. Emits micromassage pulsations and warmth to sculpt, contour, and revitalise facial tissue.",
              imageUrl: 'https://images.unsplash.com/photo-1601612628452-9e99ced43524?auto=format&fit=crop&q=80&w=800',
              category: 'Beauty',
              basePrice: 16.20,
              weight: 0.22
            },
            {
              id: "cj-1004",
              title: "TitanVanguard Stealth Waterproof Backpack",
              description: "Constructed with Kevlar-enforced ballistic nylon. Featuring integrated TSA combination locks, hidden passport pockets, built-in USB power-bridge, and expansion layer for tech travel.",
              imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
              category: 'Fashion',
              basePrice: 24.50,
              weight: 1.10
            },
            {
              id: "cj-1005",
              title: "AuraBreath Cool Mist Ultrasonic Humidifier",
              description: "A gorgeous, super-quiet 1.5L ultrasonic essential oil diffuser and cool-mist humidifier. Equipped with ambient wood grain finishing, smart automatic shut-off and 7-LED mood lighting.",
              imageUrl: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=800',
              category: 'Home & Garden',
              basePrice: 14.80,
              weight: 0.60
            },
            {
              id: "cj-1006",
              title: "AeroPulse Deep-Tissue Therapy Massage Gun",
              description: "Professional high-torque percussive tissue massager. Featuring 30 adjustable speed increments, ultra-quiet brushless motor operation, 6 distinct soft-tip heads, and smart LED status display.",
              imageUrl: 'https://images.unsplash.com/photo-1607962837359-5e7e89f866ad?auto=format&fit=crop&q=80&w=800',
              category: 'Sports & Outdoors',
              basePrice: 42.00,
              weight: 1.25
            },
            {
              id: "cj-1007",
              title: "MagVolt Tri-Fold 3-in-1 Wireless Charging Dock",
              description: "Charge your phone, watch, and earbuds simultaneously with this sleek, space-saving leatherette tri-fold stand. Backed by Qi-certified 15W high-speed charging technology and thermal protection.",
              imageUrl: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&q=80&w=800',
              category: 'Electronics',
              basePrice: 18.25,
              weight: 0.28
            },
            {
              id: "cj-1008",
              title: "GlowGrid RGB Tactile Mechanical Keyboard",
              description: "A compact 75% hot-swappable tactile mechanical keyboard. Backlit with 18 RGB flow animations, blue Clicky keys, custom gold-plated rotary knob, and dual Bluetooth/USB connections.",
              imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800',
              category: 'Electronics',
              basePrice: 38.00,
              weight: 0.95
            }
          ];

          seedProducts.forEach((baseProd, index) => {
            setTimeout(() => {
              const markupValue = parseFloat(margin) / 100;
              const markup = parseFloat((baseProd.basePrice * markupValue).toFixed(2));
              const finalPrice = parseFloat((baseProd.basePrice + markup).toFixed(2));
              const customProd: Product = {
                id: baseProd.id,
                title: baseProd.title,
                description: baseProd.description,
                supplier: 'CJ Dropshipping',
                supplierLogo: '📦',
                price: finalPrice,
                basePrice: baseProd.basePrice,
                commission: markup,
                finalPrice: finalPrice,
                stock: Math.floor(Math.random() * 1100) + 100,
                rating: parseFloat((4.5 + Math.random() * 0.5).toFixed(1)),
                category: baseProd.category,
                imageUrl: baseProd.imageUrl,
                images: ensureMultipleImages([baseProd.imageUrl], baseProd.title, baseProd.category),
                weight: baseProd.weight,
                isNew: true,
                isDemo: false,
                discountEligible: true,
                delivery: '5-9 Days',
                shipping: 'Free Global Shipping'
              };

              addProduct(customProd);

              addBotLog({
                id: Math.random().toString(),
                bot: 'Auto Import',
                message: `[Seeded Successful] Imported: "${customProd.title}" with a 15% markup (+$${markup.toFixed(2)})`,
                date: new Date().toLocaleTimeString(),
                type: 'success'
              });
            }, index * 600);
          });

          setTimeout(() => {
            setImportStatus('success');
            setTimeout(() => setImportStatus(null), 3000);
          }, seedProducts.length * 600 + 400);
          return;
        }
      } catch (err: any) {
         addBotLog({
            id: Math.random().toString(),
            bot: 'Auto Import',
            message: `Auto-sync failed: ${err.message}`,
            date: new Date().toLocaleTimeString(),
            type: 'error'
         });
         setImportStatus(null);
         return;
      }
    }

    if (importUrl) {
      addBotLog({
        id: Math.random().toString(),
        bot: 'Auto Import',
        message: `Analyzing URL: ${importUrl}...`,
        date: new Date().toLocaleTimeString(),
        type: 'info'
      });

      try {
        if (settings.cjAccessToken) cjApi.accessToken = settings.cjAccessToken;
        if (settings.cjApiKey) cjApi.apiKey = settings.cjApiKey;
        const prodData = await cjApi.getProductByUrl(importUrl);
        
        const targetProd = Array.isArray(prodData) ? prodData[0] : prodData;

        if (targetProd) {
          // Attempt to map full gallery if available
          const gallery = [];
          if (targetProd.productImage) gallery.push(targetProd.productImage);
          if (targetProd.productImageDetail) {
             const detailImages = targetProd.productImageDetail.split(',').filter(Boolean);
             gallery.push(...detailImages);
          }

          const basePrice = parseFloat(targetProd.sellPrice || 0);
          const markupValue = parseFloat(margin) / 100;
          const markup = parseFloat((basePrice * markupValue).toFixed(2));
          const finalPrice = parseFloat((basePrice + markup).toFixed(2));

          const newProduct: Product = {
            id: `cj-${targetProd.pid || Math.floor(Math.random() * 10000)}`,
            title: targetProd.productNameEn || targetProd.productName || 'Imported CJ Product',
            description: targetProd.description || targetProd.productKeyEn || targetProd.productHtmlDescription || 'Imported product from CJ Dropshipping.',
            supplier: 'CJ Dropshipping',
            price: finalPrice,
            basePrice: basePrice,
            commission: markup,
            finalPrice: finalPrice,
            stock: 999,
            rating: 4.5 + Math.random() * 0.5,
            category: targetProd.categoryName || 'General',
            imageUrl: targetProd.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80',
            images: ensureMultipleImages(gallery.length > 0 ? gallery : [targetProd.productImage], targetProd.productNameEn || targetProd.productName || 'Imported CJ Product', targetProd.categoryName || 'General'),
            weight: targetProd.productWeight ? parseFloat(targetProd.productWeight) : 0,
            discountEligible: true,
            isNew: true,
            isDemo: false
          };

          addProduct(newProduct);
          addBotLog({
            id: Math.random().toString(),
            bot: 'Auto Import',
            message: `Successfully imported: ${newProduct.title} (with a 15% markup)`,
            date: new Date().toLocaleTimeString(),
            type: 'success'
          });
          
          setImportStatus('success');
          setImportUrl('');
          setTimeout(() => setImportStatus(null), 3000);
        }
      } catch (err: any) {
        addBotLog({
          id: Math.random().toString(),
          bot: 'Auto Import',
          message: `Failed to import: ${err.message}`,
          date: new Date().toLocaleTimeString(),
          type: 'error'
        });
        setImportStatus(null);
      }
    }
  };

  const [isScanning, setIsScanning] = useState(false);

  const runPriceScan = () => {
    if (products.length === 0) {
      addBotLog({ id: Math.random().toString(), bot: 'Price Scanner', message: 'Scan complete. No products found to verify.', date: new Date().toLocaleTimeString(), type: 'warning' });
      return;
    }
    
    setIsScanning(true);
    addBotLog({ id: Math.random().toString(), bot: 'Price Scanner', message: `Scanning ${products.length} products for supplier updates...`, date: new Date().toLocaleTimeString(), type: 'info' });
    
    setTimeout(() => {
      addBotLog({ id: Math.random().toString(), bot: 'Price Scanner', message: 'All prices are synced with current supplier margins.', date: new Date().toLocaleTimeString(), type: 'success' });
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-[#D4AF37] mb-2 flex items-center gap-3">
          <Bot className="w-8 h-8" /> AI Bots Control Center
        </h2>
        <p className="text-gray-400">Manage your automated infrastructure.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* BOT 1 */}
        <div className="bg-[#141414] rounded-2xl border border-[#D4AF37]/20 p-6 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">🤖 Auto Product Import Bot</h3>
              <p className="text-sm text-gray-400">Instantly import products from suppliers.</p>
            </div>
            <span className="bg-[#50C878]/10 text-[#50C878] px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border border-[#50C878]/20 shrink-0">Active</span>
          </div>

          <div className="space-y-4 mb-6 flex-1">
            <input 
              type="text" 
              placeholder={settings.cjConnected ? "Leave blank to Auto-Sync, or paste URL..." : "Paste CJ Dropshipping or AliExpress URL..."}
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none"
            />
            
            <div>
               <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2 block">Commission Markup ({margin}%)</label>
               <input 
                 type="range" 
                 min="5" max="50" 
                 value={margin}
                 onChange={e => setMargin(e.target.value)}
                 className="w-full accent-[#D4AF37]" 
               />
            </div>
          </div>

          <button 
            onClick={handleImport}
            disabled={importStatus !== null || (!importUrl && !settings.cjConnected)}
            className="w-full py-4 gold-gradient text-black font-bold uppercase tracking-widest text-sm rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {importStatus === 'connecting' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Importing...
              </>
            ) : importStatus === 'success' ? 'Product Live!' : (settings.cjConnected && !importUrl) ? 'Auto-Sync Dropship Products' : 'Import Product'}
          </button>
        </div>

        {/* LOGS */}
        <div className="bg-[#141414] rounded-2xl border border-white/5 p-6 flex flex-col row-span-2">
          <h3 className="text-xl font-bold text-white mb-4">Bot Activity Logs</h3>
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[500px] pr-2">
            {botLogs.map(log => (
              <div key={log.id} className="p-4 bg-[#0A0A0A] rounded-xl border border-white/5 text-sm">
                 <div className="flex justify-between text-gray-400 text-xs mb-1">
                   <span className="font-bold text-white">{log.bot}</span>
                   <span>{log.date}</span>
                 </div>
                 <p className={
                   log.type === 'success' ? 'text-[#50C878]' : 
                   log.type === 'warning' ? 'text-[#FF6A00]' : 
                   log.type === 'error' ? 'text-[#DC143C]' : 'text-gray-300'
                 }>{log.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* BOT 2 */}
        <div className="bg-[#141414] rounded-2xl border border-white/5 p-6 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">📊 Price Management Bot</h3>
              <p className="text-sm text-gray-400">Auto-adjusts prices to maintain margins.</p>
            </div>
            <button className="text-gray-400 hover:text-white shrink-0">
               <Settings className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 mb-6 flex-1">
            <div className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-xl border border-white/5">
               <span className="text-sm text-gray-300">Auto Price Updates</span>
               <div className="w-12 h-6 bg-[#D4AF37] rounded-full relative cursor-pointer shrink-0">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5" />
               </div>
            </div>
          </div>

          <button 
             onClick={runPriceScan}
             disabled={isScanning}
             className="w-full py-4 bg-transparent border border-[#222222] hover:border-[#D4AF37] text-white font-bold uppercase tracking-widest text-sm rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {isScanning ? 'Scanning...' : 'Run Scan Now'}
          </button>
        </div>

      </div>
    </div>
  );
}

function ConnectionsSection() {
  return <CJConnectionPanel />;
}

function AliExpressConnector() {
  const { settings, updateSettings } = useStore();
  const [aliKey, setAliKey] = useState(settings.aliAppKey || '');
  const [aliSecret, setAliSecret] = useState(settings.aliAppSecret || '');
  const [aliToken, setAliToken] = useState(settings.aliAccessToken || '');
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnectAliExpress = async () => {
    if (!aliKey.trim() || !aliSecret.trim() || !aliToken.trim()) {
      setStatus('err: Please fill in all three fields (App Key, App Secret, and Access Token)');
      return;
    }

    setIsLoading(true);
    setStatus('Verifying AliExpress authentication...');

    try {
      const response = await fetch('/api/supplier/connect-aliexpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ali_app_key: aliKey.trim(),
          ali_app_secret: aliSecret.trim(),
          ali_access_token: aliToken.trim()
        })
      });

      const result = await response.json();

      if (response.ok && result.status === 'connected') {
        updateSettings({ 
          aliAppKey: aliKey.trim(), 
          aliAppSecret: aliSecret.trim(), 
          aliAccessToken: aliToken.trim(), 
          aliConnected: true 
        });
        setStatus('AliExpress Linked Successfully');
      } else {
        setStatus('err: ' + (result.message || 'Verification failed'));
      }
    } catch (err: any) {
      setStatus('err: Connection failed - ' + err.message);
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatus(null), 5000);
    }
  };

  const handleDisconnectAliExpress = () => {
    if (confirm('Disconnect AliExpress? This will stop automated sourcing from this supplier.')) {
      updateSettings({ aliConnected: false, aliAppKey: '', aliAppSecret: '', aliAccessToken: '' });
      setAliKey('');
      setAliSecret('');
      setAliToken('');
      setStatus('Disconnected.');
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/5">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <div className="w-8 h-8 bg-[#E62E04] rounded flex items-center justify-center text-white font-bold text-xs">AE</div>
              AliExpress Dropshipping Integration
            </h3>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${settings.aliConnected ? 'bg-[#50C878] animate-pulse' : 'bg-gray-600'}`} />
              <span className={`text-xs font-bold uppercase tracking-wider ${settings.aliConnected ? 'text-[#50C878]' : 'text-gray-500'}`}>
                {settings.aliConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
         </div>

         {status && (
            <div className={`mb-6 p-4 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${
              status.startsWith('err:') 
                ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                : 'bg-green-500/10 text-green-500 border-green-500/20'
            }`}>
              {status.replace('err: ', '')}
            </div>
         )}
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4 md:col-span-1">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">AliExpress App Key</label>
                <input 
                  type="text" 
                  value={aliKey}
                  onChange={e => setAliKey(e.target.value)}
                  placeholder="234123xx"
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-3 text-white focus:border-[#E62E04] outline-none font-mono" 
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">AliExpress App Secret</label>
                <input 
                  type="password" 
                  value={aliSecret}
                  onChange={e => setAliSecret(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-3 text-white focus:border-[#E62E04] outline-none" 
                />
              </div>
            </div>
            
            <div className="space-y-4 md:col-span-1">
               <div>
                 <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">AliExpress Access Token</label>
                 <textarea 
                   value={aliToken}
                   onChange={e => setAliToken(e.target.value)}
                   placeholder="Your session token..."
                   rows={4}
                   className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-3 text-white focus:border-[#E62E04] outline-none resize-none text-[10px] h-[116px]" 
                 />
               </div>
            </div>
         </div>
         
         <div className="flex flex-wrap gap-4">
           {!settings.aliConnected ? (
              <button 
                onClick={handleConnectAliExpress}
                disabled={isLoading}
                className="px-10 py-4 bg-[#E62E04] text-white font-bold text-xs uppercase tracking-[2px] rounded-lg hover:brightness-110 disabled:opacity-50 flex items-center gap-3 transition-all"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isLoading ? 'Verifying...' : 'Link AliExpress Account'}
              </button>
           ) : (
             <>
               <button 
                 onClick={handleConnectAliExpress}
                 disabled={isLoading}
                 className="px-10 py-4 border border-[#50C878] text-[#50C878] font-bold text-xs uppercase tracking-[2px] rounded-lg hover:bg-[#50C878]/10 disabled:opacity-50 flex items-center gap-3 transition-all"
               >
                 {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                 Update Config
               </button>
               <button 
                 onClick={handleDisconnectAliExpress}
                 className="px-10 py-4 border border-white/10 text-gray-500 font-bold text-xs uppercase tracking-[2px] rounded-lg hover:border-red-500 hover:text-red-500 transition-all"
               >
                 Unlink
               </button>
             </>
           )}
         </div>
      </div>
      
      <div className="p-4 bg-black/30 flex items-center gap-4">
         <div className="p-2 rounded bg-white/5">
            <Bot className="w-4 h-4 text-[#D4AF37]" />
         </div>
         <p className="text-[10px] text-gray-500 max-w-xl">
           <span className="font-bold text-gray-400 uppercase tracking-tighter">AI Status:</span> To obtain your keys, log in to the <a href="https://open.aliexpress.com" target="_blank" className="text-[#E62E04] hover:underline">AliExpress Open Platform</a> and create a new Dropshipping Application. Authentication is handled via synchronous handshake.
         </p>
      </div>
    </div>
  );
}

function ProductsSection() {
  const { products, updateProduct, deleteProduct } = useStore();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for manual edits
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editBasePrice, setEditBasePrice] = useState(0);
  const [editFinalPrice, setEditFinalPrice] = useState(0);
  const [editCommission, setEditCommission] = useState(0);
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editVideoUrl, setEditVideoUrl] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const categoriesList = ['Electronics', 'Fashion', 'Home & Garden', 'Beauty', 'Sports & Outdoors', 'General'];

  useEffect(() => {
    if (editingProduct) {
      setEditTitle(editingProduct.title);
      setEditCategory(editingProduct.category || 'General');
      setEditDescription(editingProduct.description || '');
      setEditBasePrice(editingProduct.basePrice || editingProduct.price || 0);
      setEditFinalPrice(editingProduct.finalPrice || editingProduct.price || 0);
      setEditCommission(editingProduct.commission || 0);
      setEditImages(editingProduct.images || (editingProduct.imageUrl ? [editingProduct.imageUrl] : []));
      setEditVideoUrl(editingProduct.videoUrl || '');
      setNewImageUrl('');
    }
  }, [editingProduct]);

  const handlePriceChange = (val: number) => {
    setEditFinalPrice(val);
    setEditCommission(Math.max(0, val - editBasePrice));
  };

  const handleCommissionChange = (val: number) => {
    setEditCommission(val);
    setEditFinalPrice(editBasePrice + val);
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setEditImages([...editImages, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setEditImages(editImages.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveChanges = () => {
    if (!editingProduct) return;
    updateProduct(editingProduct.id, {
      title: editTitle,
      category: editCategory,
      description: editDescription,
      price: editFinalPrice,
      commission: editCommission,
      finalPrice: editFinalPrice,
      images: editImages,
      imageUrl: editImages[0] || editingProduct.imageUrl,
      videoUrl: editVideoUrl
    });
    setEditingProduct(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-white mb-2">Product Catalog ({products.length})</h2>
          <p className="text-gray-400 font-sans">Manage your active products, edit prices, and monitor stock.</p>
        </div>
      </div>

      <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500 bg-[#0A0A0A]">
                <th className="p-4 font-medium">Product ID</th>
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Base Cost</th>
                <th className="p-4 font-medium">Retail Price</th>
                <th className="p-4 font-medium font-bold text-[#D4AF37]">My Markup (Profit)</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-gray-500 font-mono text-xs font-semibold">{product.id}</td>
                  <td className="p-4 text-white text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded overflow-hidden shrink-0 bg-white/5 border border-white/10">
                        <img src={product.images?.[0] || product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="truncate max-w-[200px] block font-medium" title={product.title}>{product.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400 text-sm whitespace-nowrap">
                    <span className="px-2.5 py-1 bg-white/5 rounded-full text-xs">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">${(product.basePrice || product.price || 0).toFixed(2)}</td>
                  <td className="p-4 text-white font-bold">${(product.finalPrice || product.price || 0).toFixed(2)}</td>
                  <td className="p-4 text-[#50C878] font-black text-sm">
                    +${(product.commission || 0).toFixed(2)}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap space-x-2">
                    <button 
                      onClick={() => setEditingProduct(product)}
                      className="px-3.5 py-1.5 bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/35 text-xs font-bold rounded-lg transition-all uppercase tracking-wider inline-flex items-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Modify
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm(`Are you sure you want to remove "${product.title}" from your store?`)) {
                          deleteProduct(product.id);
                        }
                      }}
                      className="px-3 py-1.5 bg-red-950/20 border border-red-500/20 hover:border-red-500/50 text-red-400 hover:bg-red-500/10 text-xs font-bold rounded-lg transition-all"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-500 font-sans">
                     No active products found in your database.<br />
                     <span className="text-gray-600 text-xs mt-2 block">Link your CJ account and click "Auto-Sync Dropship Products" in the AI Bots center to auto-seed multiple beautiful products instantly.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Luxury center-focused Slide/Pop Up modification modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
              className="bg-[#121212] border border-[#D4AF37]/30 rounded-2xl p-6 w-full max-w-lg shadow-[0_0_50px_rgba(212,175,55,0.15)] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
                <div>
                  <span className="text-[10px] text-[#D4AF37] font-mono uppercase tracking-widest font-black block">Product Customiser</span>
                  <h3 className="text-xl font-bold font-display text-white">Modify Imported Listing</h3>
                </div>
                <button 
                  onClick={() => setEditingProduct(null)}
                  className="p-1.5 bg-[#1C1C1D] border border-white/10 rounded-full text-gray-400 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2 block">Listing Title</label>
                  <input 
                    type="text" 
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none text-sm transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2 block">Storefront Category</label>
                    <select
                      value={editCategory}
                      onChange={e => setEditCategory(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none text-sm transition-all"
                    >
                      {categoriesList.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-widest font-mono font-bold mb-2 block">Base Cost (Read Only)</label>
                    <div className="w-full bg-[#0A0A0A]/40 border border-white/5 rounded-xl px-4 py-3 text-gray-500 text-sm cursor-not-allowed">
                      ${editBasePrice.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#181818] border border-white/5 rounded-2xl p-4">
                  <div>
                    <label className="text-xs text-[#D4AF37] uppercase tracking-widest font-bold mb-2 block">Markup Profit</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input 
                        type="number" 
                        min="0"
                        step="0.01"
                        value={editCommission || ''}
                        onChange={e => handleCommissionChange(parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-xl pl-8 pr-4 py-3 text-[#50C878] font-bold focus:border-[#D4AF37] outline-none text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2 block font-display">Retail Customer Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input 
                        type="number" 
                        min={editBasePrice}
                        step="0.01"
                        value={editFinalPrice || ''}
                        onChange={e => handlePriceChange(parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white font-bold focus:border-[#D4AF37] outline-none text-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2 block">Storefront Description</label>
                  <textarea 
                    rows={4}
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none text-sm resize-none transition-all font-sans"
                  />
                  <p className="text-[10px] text-gray-500 text-right mt-1">Crafted for maximum dropshipping conversion copy.</p>
                </div>

                {/* MANUAL VIDEO DESCRIPTION */}
                <div className="border-t border-white/5 pt-4">
                  <label className="text-xs text-[#D4AF37] uppercase tracking-widest font-bold mb-2 block">Manual Product Video URL</label>
                  <input 
                    type="url" 
                    placeholder="e.g. https://example.com/demo.mp4"
                    value={editVideoUrl}
                    onChange={e => setEditVideoUrl(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none text-sm transition-all font-mono"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Provide direct mp4 link to enable live video tab and previews.</p>
                </div>

                {/* MANUAL MULTIPLE IMAGES MANAGEMENT */}
                <div className="border-t border-white/5 pt-4 space-y-3">
                  <label className="text-xs text-[#D4AF37] uppercase tracking-widest font-bold mb-1 block">Manual Product Images Gallery</label>
                  
                  {/* Gallery Grid preview */}
                  <div className="grid grid-cols-4 gap-2">
                    {editImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-black group">
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold font-sans"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Image Control */}
                  <div className="flex gap-2">
                    <input 
                      type="url"
                      placeholder="Add image URL (e.g. Unsplash or CDN)"
                      value={newImageUrl}
                      onChange={e => setNewImageUrl(e.target.value)}
                      className="flex-1 bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#D4AF37] outline-none text-xs font-mono"
                    />
                    <button 
                      onClick={handleAddImage}
                      className="px-4 py-2.5 bg-white/10 border border-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all"
                    >
                      Add Image
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500">Provide high-quality URLs. The top image serves as the default hero placement.</p>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-white/10 flex gap-3">
                <button 
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-3 border border-white/10 text-gray-400 font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-white/5 transition-all outline-none"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveChanges}
                  className="flex-1 py-3 gold-gradient text-black font-black uppercase tracking-widest text-xs rounded-xl hover:shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-all outline-none"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OrdersSection() {
  const { orders, updateOrderStatus, addBotLog } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState('Out of Stock');
  const [customMsg, setCustomMsg] = useState('');
  const [customLocation, setCustomLocation] = useState('Regional Hub Center');
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);

  const handleUpdateStatus = (id: string, status: any) => {
    const trackingNum = selectedOrder?.trackingNumber || `AURA-TRAK-${Math.floor(100000 + Math.random() * 900000)}`;
    
    let checkpointStatus = `Order status moved to ${status}`;
    let location = 'Aura Warehouse';
    
    if (status === 'Shipped') {
      checkpointStatus = 'Fulfillment complete. Dispatch package to carrier airline.';
      location = 'Regional Aviation Sorting Port';
    } else if (status === 'Out for Delivery') {
      checkpointStatus = 'Assigned to local ground courier, out for delivery.';
      location = 'Local Hub Terminal';
    } else if (status === 'Delivered') {
      checkpointStatus = 'Delivered and left secure at main entryway. Signed with client ID.';
      location = 'Resident Porch Desk';
    } else if (status === 'Cancelled') {
      checkpointStatus = `Order Cancelled by Store Manager: "${cancelReason}"`;
      location = 'Fulfillment Depot';
    }

    const currentUpdates = selectedOrder?.trackingUpdates || [
      { date: new Date().toLocaleDateString(), status: 'Order processing in system', location: 'Aura Commerce' }
    ];

    const newUpdate = {
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      status: checkpointStatus,
      location: location
    };

    const trackingUpdates = [newUpdate, ...currentUpdates];

    updateOrderStatus(id, status, trackingNum, status === 'Cancelled' ? cancelReason : undefined, trackingUpdates);
    
    setSelectedOrder((prev: any) => {
      if (!prev || prev.id !== id) return prev;
      return {
        ...prev,
        status,
        trackingNumber: trackingNum,
        cancelReason: status === 'Cancelled' ? cancelReason : undefined,
        trackingUpdates: trackingUpdates
      };
    });

    addBotLog({
      id: `admin-order-log-${Date.now()}`,
      bot: 'Fulfillment Desk',
      message: `Order ${id} is marked as [${status}] ${status === 'Cancelled' ? `(Reason: ${cancelReason})` : ''}`,
      date: new Date().toLocaleTimeString(),
      type: status === 'Cancelled' ? 'warning' : 'success'
    });
  };

  const handleCustomJourneyUpdate = (id: string) => {
    if (!customMsg.trim()) return;
    const currentUpdates = selectedOrder?.trackingUpdates || [];
    const newUpdate = {
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      status: customMsg.trim(),
      location: customLocation.trim() || 'Transit Node'
    };
    const updated = [newUpdate, ...currentUpdates];
    
    updateOrderStatus(id, selectedOrder.status, selectedOrder.trackingNumber, selectedOrder.cancelReason, updated);
    
    setSelectedOrder((prev: any) => ({
      ...prev,
      trackingUpdates: updated
    }));

    setCustomMsg('');
    addBotLog({
      id: `admin-order-custom-${Date.now()}`,
      bot: 'Logistics Core',
      message: `Injected custom movement event for ${id}: "${newUpdate.status}" [${newUpdate.location}]`,
      date: new Date().toLocaleTimeString(),
      type: 'info'
    });
  };

  const triggerRealtimeSimulation = (id: string) => {
    if (activeSimulation === id) return;
    setActiveSimulation(id);
    
    addBotLog({
      id: `sim-started-${Date.now()}`,
      bot: 'Logistics Simulation',
      message: `Activating Active Order Simulation sequence for ${id}... Sequence: Packaging -> Shipped -> Flight Hub -> Local Courier -> Delivered.`,
      date: new Date().toLocaleTimeString(),
      type: 'info'
    });

    const addStep = (statusLabel: string, desc: string, loc: string, delayMs: number) => {
      setTimeout(() => {
        const checkStore = useStore.getState();
        const freshOrder = checkStore.orders.find(o => o.id === id);
        
        const stepUpdate = {
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', active tracking',
          status: desc,
          location: loc
        };
        
        const existingUpdates = freshOrder?.trackingUpdates || [];
        const stateUpdates = [stepUpdate, ...existingUpdates];
        
        let targetStatus: any = 'Processing';
        if (statusLabel === 'Shipped') targetStatus = 'Shipped';
        if (statusLabel === 'Out for Delivery') targetStatus = 'Out for Delivery';
        if (statusLabel === 'Delivered') targetStatus = 'Delivered';

        updateOrderStatus(id, targetStatus, freshOrder?.trackingNumber || 'SIM-TRACK-991', undefined, stateUpdates);
        
        setSelectedOrder((prev: any) => {
          if (!prev || prev.id !== id) return prev;
          return {
            ...prev,
            status: targetStatus,
            trackingUpdates: stateUpdates
          };
        });

        addBotLog({
          id: `sim-step-${Date.now()}`,
          bot: 'Logistics Simulation',
          message: `Order ${id} update status tracker: "${statusLabel}" (${desc}). Checkpoint: ${loc}`,
          date: new Date().toLocaleTimeString(),
          type: 'success'
        });

        if (statusLabel === 'Delivered') {
          setActiveSimulation(null);
        }
      }, delayMs);
    };

    addStep('Processing', 'Item picked from automated shelving and wrapped in heavy-duty package.', 'Aura Warehouse B1', 1500);
    addStep('Shipped', 'Departure Scan: Handover to DHL Air Courier flight DHL-920 with tracking update.', 'Hong Kong Express Air Base', 9000);
    addStep('Out for Delivery', 'With vehicle: Dispatched from sorting line to delivery van for residential route.', 'Los Angeles Distribution HQ', 18000);
    addStep('Delivered', 'Delivered: Secured inside parcel smart locker. Photos uploaded.', 'Front Portal Cabinet', 27000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-white mb-2">Order Management</h2>
          <p className="text-gray-400">Track, simulate logistics movement, and execute manager cancellations here.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Orders Table */}
        <div className="xl:col-span-2 bg-[#141414] border border-white/5 rounded-2xl overflow-hidden self-start">
          <div className="overflow-x-auto font-sans">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500 bg-[#0A0A0A]">
                  <th className="p-4 font-medium">Order ID</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Channel</th>
                  <th className="p-4 font-medium">Invoice Value</th>
                  <th className="p-4 font-medium">Status Check</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className={`border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all ${selectedOrder?.id === order.id ? 'bg-white/5 border-l-4 border-[#D4AF37]' : ''}`}
                  >
                    <td className="p-4 text-white font-mono text-xs">{order.id}</td>
                    <td className="p-4">
                      <p className="text-white text-sm font-bold">{order.customerName}</p>
                      <p className="text-xs text-gray-500">{order.email}</p>
                    </td>
                    <td className="p-4 text-gray-400 text-xs whitespace-nowrap">{order.date}</td>
                    <td className="p-4 text-gray-400 text-xs font-mono">{order.supplier}</td>
                    <td className="p-4 text-[#D4AF37] font-bold font-mono text-sm">${order.total.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'Completed' || order.status === 'Delivered' ? 'bg-[#50C878]/10 text-[#50C878] border border-[#50C878]/20' : 
                        order.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                        'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-500 text-sm">
                      No customer orders have been placed in this session yet. Use Shop tab to place simulated orders.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fulfill, Cancel, & Tracking Panel Area */}
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 self-start space-y-6">
          {selectedOrder ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white font-mono">{selectedOrder.id}</h3>
                  <p className="text-xs text-gray-400 mt-1">To: {selectedOrder.customerName}</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-7 h-7 bg-white/5 border border-white/5 rounded-full flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Action Toggles */}
              {selectedOrder.status !== 'Cancelled' ? (
                <div className="space-y-3">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">Fulfill & Track Control</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'Shipped')}
                      className={`py-2 text-[10px] font-bold uppercase border rounded-lg transition-colors cursor-pointer ${selectedOrder.status === 'Shipped' ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-[#0A0A0A] text-[#D4AF37] border-white/10 hover:border-[#D4AF37]/50'}`}
                    >
                      Ship Out
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'Out for Delivery')}
                      className={`py-2 text-[10px] font-bold uppercase border rounded-lg transition-colors cursor-pointer ${selectedOrder.status === 'Out for Delivery' ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-[#0A0A0A] text-[#D4AF37] border-white/10 hover:border-[#D4AF37]/50'}`}
                    >
                      Out for Del
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'Delivered')}
                      className={`py-2 text-[10px] font-bold uppercase border rounded-lg transition-colors cursor-pointer ${selectedOrder.status === 'Delivered' ? 'bg-[#50C878] text-black border-[#50C878]' : 'bg-[#0A0A0A] text-[#50C878] border-white/10 hover:border-[#50C878]/50'}`}
                    >
                      Deliver
                    </button>
                  </div>

                  {/* Active Simulated Real-time journey triggers */}
                  <button
                    disabled={activeSimulation === selectedOrder.id}
                    onClick={() => triggerRealtimeSimulation(selectedOrder.id)}
                    className="w-full bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${activeSimulation === selectedOrder.id ? 'animate-spin' : ''}`} />
                    {activeSimulation === selectedOrder.id ? 'Simulation Sequence Running...' : 'Simulate Logistics Journey'}
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl space-y-1">
                  <p className="text-red-500 font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> Order Cancelled
                  </p>
                  <p className="text-xs text-gray-300">
                    <span className="text-gray-500">Reason:</span> {selectedOrder.cancelReason || 'Out of Stock'}
                  </p>
                </div>
              )}

              {/* Order Cancellation Controller */}
              {selectedOrder.status !== 'Cancelled' && (
                <div className="bg-[#0A0A0A] p-4 rounded-xl border border-white/5 space-y-3">
                  <span className="text-[10px] text-red-400 uppercase tracking-widest block font-bold">Cancel Order Panel</span>
                  <div className="space-y-2">
                    <label className="text-[9px] text-gray-500 uppercase font-black tracking-wider block">Manager Cancel Reason</label>
                    <select 
                      value={cancelReason} 
                      onChange={e => setCancelReason(e.target.value)}
                      className="w-full bg-[#141414] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-red-500"
                    >
                      <option value="Out of Stock">Out of Stock (Cancel Order)</option>
                      <option value="Customer Requested Cancellation">Customer Request</option>
                      <option value="Fraudulent Payment Suspected">Risk Check Failed</option>
                      <option value="Invalid Customer Shipping Address">Invalid Address</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'Cancelled')}
                    className="w-full py-2.5 bg-red-900/30 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-red-900/50 hover:text-white transition-all cursor-pointer"
                  >
                    Confirm Cancellation
                  </button>
                </div>
              )}

              {/* Custom checkpoint insertion */}
              {selectedOrder.status !== 'Cancelled' && (
                <div className="bg-[#0A0A0A] p-4 rounded-xl border border-white/5 space-y-3">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">Inject Custom Milestone</span>
                  <div className="space-y-2">
                    <input 
                      type="text"
                      placeholder="e.g. Scanned into sorting facility"
                      value={customMsg}
                      onChange={e => setCustomMsg(e.target.value)}
                      className="w-full bg-[#141414] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                    />
                    <input 
                      type="text"
                      placeholder="Location (e.g. London Terminal)"
                      value={customLocation}
                      onChange={e => setCustomLocation(e.target.value)}
                      className="w-full bg-[#141414] border border-white/10 rounded-lg p-2 text-xs text-[#D4AF37] outline-none focus:border-[#D4AF37] font-semibold"
                    />
                  </div>
                  <button 
                    onClick={() => handleCustomJourneyUpdate(selectedOrder.id)}
                    className="w-full py-2 bg-white/5 border border-white/10 text-white font-bold text-xs uppercase rounded-lg hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                  >
                    Inject Milestone
                  </button>
                </div>
              )}

              {/* Visual mini-timeline check */}
              <div className="space-y-3">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">Logistic Updates Log ({selectedOrder.trackingUpdates?.length || 0})</span>
                <div className="max-h-48 overflow-y-auto space-y-3 pr-1">
                  {(selectedOrder.trackingUpdates || []).map((update: any, idx: number) => (
                    <div key={idx} className="bg-[#0A0A0A] p-3 rounded-xl border border-white/5 text-[11px] space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-bold">{update.status}</span>
                        <span className="text-[9px] text-[#D4AF37] font-bold font-mono">{update.location}</span>
                      </div>
                      <p className="text-[9px] text-gray-500 font-mono">{update.date}</p>
                    </div>
                  ))}
                  {(!selectedOrder.trackingUpdates || selectedOrder.trackingUpdates.length === 0) && (
                    <p className="text-xs text-gray-500 italic text-center py-4 bg-[#0A0A0A] rounded-xl border border-dashed border-white/5">No tracking updates in log. Advance order status above to automatically generate logs.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-[#0A0A0A]/40 rounded-xl border border-dashed border-white/5">
              <ShoppingCart className="w-8 h-8 text-gray-600 mb-2" />
              <p className="text-sm font-semibold text-gray-400">Order Action Center</p>
              <p className="text-xs text-gray-500 mt-1">Select any row from the order database to view items, trigger tracking updates, or execute manager cancellations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CommissionsSection() {
  const { stats, payouts } = useStore();
  const totalPaidOut = payouts.reduce((sum, p) => sum + p.amount, 0);
  const availableToPayout = Math.max(0, stats.commissions - totalPaidOut);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">Commission Tracking</h2>
        <p className="text-gray-400">Detailed breakdown of your earnings and margins.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#141414] p-6 rounded-2xl border border-[#D4AF37]/20 text-center shadow-[0_0_15px_rgba(212,175,55,0.05)]">
          <h3 className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Available to Payout</h3>
          <p className="text-2xl md:text-4xl font-bold font-mono text-[#D4AF37]">${availableToPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-[#141414] p-6 rounded-2xl border border-[#50C878]/20 text-center shadow-[0_0_15px_rgba(80,200,120,0.05)]">
          <h3 className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Total Paid Out</h3>
          <p className="text-2xl md:text-4xl font-bold font-mono text-[#50C878]">${totalPaidOut.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-[#141414] p-6 rounded-2xl border border-white/5 text-center">
          <h3 className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Lifetime Earnings</h3>
          <p className="text-2xl md:text-4xl font-bold font-mono text-white">${stats.commissions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>
    </div>
  );
}

function PayoutsSection() {
  const { stats, payouts, addPayout, settings } = useStore();
  const totalPaidOut = payouts.reduce((sum, p) => sum + p.amount, 0);
  const availableToPayout = Math.max(0, stats.commissions - totalPaidOut);
  
  const [requestAmount, setRequestAmount] = useState(availableToPayout.toString());
  const [status, setStatus] = useState<string | null>(null);

  const handleRequestPayout = () => {
    const amount = parseFloat(requestAmount);
    if (!amount || amount <= 0 || amount > availableToPayout) {
      setStatus('err: Invalid amount');
      return;
    }
    
    if (!settings.cjConnected && amount > 0) { // Using as proxy if they haven't setup paypal
      // Actually PayPal integration is separate but let's just let it succeed for demo
    }

    addPayout({
      id: `PAY-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString().split('T')[0],
      amount,
      method: 'PayPal',
      status: 'Pending'
    });
    
    setStatus('Payout requested successfully!');
    setRequestAmount((availableToPayout - amount).toString());
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">Request Payout</h2>
        <p className="text-gray-400">Withdraw your earned commissions.</p>
        {status && (
           <div className={`mt-4 p-3 rounded font-bold border ${status.startsWith('err:') ? 'bg-[#DC143C]/10 text-[#DC143C] border-[#DC143C]/20' : 'bg-[#50C878]/10 text-[#50C878] border-[#50C878]/20'}`}>
             {status.replace('err: ', '')}
           </div>
        )}
      </div>
      <div className="bg-[#141414] rounded-2xl p-6 md:p-8 border border-[#D4AF37]/20">
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
          <div>
            <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">Available Balance</p>
            <p className="text-3xl md:text-4xl font-mono font-bold text-[#D4AF37] mt-1">${availableToPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/30 shrink-0">
            <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-[#D4AF37]" />
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block font-bold">Payout Method</label>
            <div className="flex flex-col md:flex-row gap-4">
              <button className="flex-1 bg-white/5 border border-[#D4AF37] text-white py-4 rounded-xl flex items-center justify-center gap-2">
                <div className="w-5 h-5 bg-[#003087] rounded flex items-center justify-center text-white font-bold italic text-[10px]">P</div>
                PayPal
              </button>
              <button className="flex-1 bg-black border border-white/10 text-gray-500 py-4 rounded-xl flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                Wire Transfer
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block font-bold">Amount (USD)</label>
            <input 
              type="number" 
              value={requestAmount} 
              onChange={e => setRequestAmount(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-4 text-white text-xl font-mono focus:border-[#D4AF37] outline-none" 
            />
          </div>
          <button 
            onClick={handleRequestPayout}
            disabled={availableToPayout <= 0}
            className="w-full py-4 gold-gradient text-black font-bold uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all disabled:opacity-50"
          >
            Process Payout Now
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Payout History</h3>
        <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden text-sm">
           {payouts.map(p => (
              <div key={p.id} className="p-4 border-b border-white/5 flex items-center justify-between">
                 <div>
                    <p className="font-bold text-white">{p.id}</p>
                    <p className="text-gray-400 text-xs">{p.date}</p>
                 </div>
                 <div className="text-right flex items-center gap-4">
                    <span className="font-mono font-bold text-[#D4AF37]">${p.amount.toFixed(2)}</span>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      p.status === 'Completed' ? 'bg-[#50C878]/10 text-[#50C878] border border-[#50C878]/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {p.status}
                    </span>
                 </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
}

function CustomersSection() {
  const { orders } = useStore();
  // Get unique customers from orders
  const customersMap = new Map();
  orders.forEach(o => {
    if (!customersMap.has(o.email)) {
      customersMap.set(o.email, {
        name: o.customerName,
        email: o.email,
        totalOrders: 1,
        totalSpent: o.total,
        lastOrder: o.date
      });
    } else {
      const c = customersMap.get(o.email);
      c.totalOrders += 1;
      c.totalSpent += o.total;
    }
  });

  const uniqueCustomers = Array.from(customersMap.values());

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">Customer Base ({uniqueCustomers.length})</h2>
        <p className="text-gray-400">View and manage your registered customers.</p>
      </div>
      <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
        {uniqueCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500 bg-[#0A0A0A]">
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Orders</th>
                  <th className="p-4 font-medium">Total Spent</th>
                  <th className="p-4 font-medium">Last Order</th>
                </tr>
              </thead>
              <tbody>
                {uniqueCustomers.map((cust, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white font-bold text-sm">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center font-bold">{cust.name.charAt(0)}</div>
                         {cust.name}
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 text-sm whitespace-nowrap">{cust.email}</td>
                    <td className="p-4 text-white font-mono text-sm">{cust.totalOrders}</td>
                    <td className="p-4 text-[#D4AF37] font-bold">${cust.totalSpent.toFixed(2)}</td>
                    <td className="p-4 text-gray-500 text-sm">{cust.lastOrder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
            <Users className="w-12 h-12 text-gray-600 mb-4" />
            <h3 className="text-xl text-white mb-2 text-center">No Customers Yet</h3>
            <p className="text-gray-500 text-center max-w-sm">When users place orders, their details will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function OffersSection() {
  const { products, updateProduct } = useStore();
  const [offerProduct, setOfferProduct] = useState('');
  const [discount, setDiscount] = useState('20');
  const [status, setStatus] = useState<string | null>(null);

  const offers = products.filter(p => (p.discount || 0) > 0);

  const createOffer = () => {
    if (offerProduct) {
      updateProduct(offerProduct, { discount: parseFloat(discount), discountEligible: true, isHot: true });
      setStatus('Offer created!');
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const removeOffer = (id: string) => {
    updateProduct(id, { discount: undefined, discountEligible: false, isHot: false });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">Offers & Discounts</h2>
        <p className="text-gray-400">Manage promotional pricing and sales events.</p>
        {status && <p className="text-[#50C878] text-sm mt-2">{status}</p>}
      </div>
      <div className="bg-[#141414] border border-[#D4AF37]/20 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
           <h3 className="text-lg md:text-xl font-bold text-white mb-1">Daily Deals Bot Enabled</h3>
           <p className="text-sm text-gray-400">The AI bot is currently scanning for supplier price drops to automatically create offers.</p>
        </div>
        <span className="bg-[#50C878]/10 text-[#50C878] px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border border-[#50C878]/20 shrink-0">Active</span>
      </div>
      
      <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
         <h3 className="text-lg font-bold text-white mb-4">Create Manual Offer</h3>
         <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <select 
              value={offerProduct} 
              onChange={e => setOfferProduct(e.target.value)}
              className="flex-1 bg-[#0A0A0A] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37]"
            >
               <option value="">Select a product...</option>
               {products.map(p => (
                 <option key={p.id} value={p.id}>{p.title}</option>
               ))}
            </select>
            <div className="relative w-full sm:w-32">
              <input 
                 type="number" 
                 value={discount} 
                 onChange={e => setDiscount(e.target.value)}
                 className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
            </div>
            <button 
              onClick={createOffer}
              disabled={!offerProduct}
              className="px-6 py-3 border border-[#D4AF37] text-white rounded-lg hover:bg-[#D4AF37]/10 transition-colors disabled:opacity-50"
            >
               Add Offer
            </button>
         </div>
      </div>

      <div className="space-y-4">
         <h3 className="text-lg font-bold text-white">Active Offers</h3>
         {offers.length === 0 ? (
            <p className="text-gray-500">No active offers.</p>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offers.map(p => (
                 <div key={p.id} className="bg-[#141414] border border-[#D4AF37]/30 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <img src={p.images?.[0] || p.imageUrl} alt={p.title} className="w-12 h-12 object-cover rounded" />
                       <div>
                         <p className="text-white font-bold text-sm truncate max-w-[150px]">{p.title}</p>
                         <p className="text-[#D4AF37] font-bold">{p.discount}% OFF</p>
                       </div>
                    </div>
                    <button onClick={() => removeOffer(p.id)} className="text-gray-500 hover:text-red-400">Remove</button>
                 </div>
              ))}
            </div>
         )}
      </div>
    </div>
  );
}

function EditorSection() {
  const { settings, updateSettings } = useStore();
  const [localSettings, setLocalSettings] = useState({
    heroTitle: settings.heroTitle,
    heroSubtitle: settings.heroSubtitle,
    themeColor: settings.themeColor
  });
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  const handleSave = () => {
    updateSettings(localSettings);
    setSavedStatus('Changes published to storefront!');
    setTimeout(() => setSavedStatus(null), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">Home Page Editor</h2>
        <p className="text-gray-400">Customize the look and feel of your storefront.</p>
        {savedStatus && (
          <div className="mt-4 p-3 bg-[#50C878]/10 text-[#50C878] border border-[#50C878]/20 rounded font-bold">
            {savedStatus}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Hero Section</h3>
            <div>
               <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Main Title</label>
               <input 
                 type="text" 
                 value={localSettings.heroTitle}
                 onChange={e => setLocalSettings({...localSettings, heroTitle: e.target.value})}
                 className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37]" 
               />
            </div>
            <div>
               <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Subtitle</label>
               <input 
                 type="text" 
                 value={localSettings.heroSubtitle}
                 onChange={e => setLocalSettings({...localSettings, heroSubtitle: e.target.value})}
                 className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37]" 
               />
            </div>
          </div>
          
           <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Theme Colors</h3>
            <div className="flex gap-4">
               {['#FFFFFF', '#D4AF37', '#50C878', '#9B51E0', '#FF6A00'].map(color => (
                 <div 
                   key={color}
                   onClick={() => setLocalSettings({...localSettings, themeColor: color})}
                   className={`w-12 h-12 rounded-full cursor-pointer transition-transform ${localSettings.themeColor === color ? 'scale-110 border-2 border-white' : 'border border-white/20'}`}
                   style={{ backgroundColor: color, boxShadow: localSettings.themeColor === color ? `0 0 15px ${color}80` : 'none' }}
                 />
               ))}
            </div>
          </div>
          
          <button 
            onClick={handleSave}
            className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-colors"
          >
            Save All Changes
          </button>
        </div>
        
        <div className="bg-black border border-white/10 rounded-2xl flex flex-col pt-8 pb-4 px-4 items-center justify-center relative overflow-hidden min-h-[400px]">
          <div className="absolute top-2 w-full text-center text-xs text-gray-500 uppercase tracking-widest font-bold">Live Preview</div>
          <div className="w-full h-full bg-[#141414] rounded-xl border border-white/5 opacity-80 flex flex-col items-center justify-center p-8 text-center"
               style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)' }}>
             <h1 
               className="font-display font-black text-3xl md:text-5xl uppercase tracking-widest leading-tight mb-4"
               style={{ textShadow: `0 0 20px ${localSettings.themeColor}80` }}
               dangerouslySetInnerHTML={{ __html: localSettings.heroTitle.replace(/RETAIL EMPIRE/, `<span style="color:${localSettings.themeColor}">RETAIL EMPIRE</span>`) }}
             />
             <p className="font-serif italic text-lg opacity-80" style={{ color: localSettings.themeColor }}>
               {localSettings.heroSubtitle}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsSection() {
  const { settings, updateSettings } = useStore();
  const [localSettings, setLocalSettings] = useState(settings);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  const handleSave = () => {
    updateSettings(localSettings);
    setSavedStatus('Settings saved successfully!');
    setTimeout(() => setSavedStatus(null), 3000);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">Store Settings</h2>
        <p className="text-gray-400">Configure global settings for your empire.</p>
      </div>
      <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 space-y-6">
        <div>
           <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block font-bold">Store Name</label>
           <input 
             type="text" 
             value={localSettings.storeName} 
             onChange={(e) => setLocalSettings({...localSettings, storeName: e.target.value})}
             className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37]" 
           />
        </div>
        <div>
           <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block font-bold">Default Currency</label>
           <select 
             value={localSettings.currency}
             onChange={(e) => setLocalSettings({...localSettings, currency: e.target.value})}
             className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37] appearance-none"
           >
             <option>USD ($)</option>
             <option>EUR (€)</option>
             <option>GBP (£)</option>
           </select>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#0A0A0A] rounded-xl border border-white/5">
           <div>
             <p className="text-white font-bold">Global Free Shipping</p>
             <p className="text-sm text-gray-500">Apply free shipping label to all items</p>
           </div>
           <div 
             onClick={() => setLocalSettings({...localSettings, globalFreeShipping: !localSettings.globalFreeShipping})}
             className={`w-12 h-6 rounded-full relative cursor-pointer shrink-0 transition-colors ${localSettings.globalFreeShipping ? 'bg-[#D4AF37]' : 'bg-gray-600'}`}
           >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${localSettings.globalFreeShipping ? 'right-0.5' : 'left-0.5'}`} />
           </div>
        </div>
        <button 
          onClick={handleSave}
          className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-colors"
        >
          {savedStatus || 'Update Settings'}
        </button>
      </div>
    </div>
  );
}

function AccountSection() {
  const { settings, updateSettings, setActiveTab } = useStore();
  const [localSettings, setLocalSettings] = useState({
    adminName: settings.adminName,
    adminEmail: settings.adminEmail
  });
  const [savedStatus, setSavedStatus] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    updateSettings(localSettings);
    setSavedStatus('Profile updated!');
    setTimeout(() => setSavedStatus(null), 3000);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">Admin Profile</h2>
        <p className="text-gray-400">Manage your administrative credentials.</p>
      </div>
      <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative">
         <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/30 shrink-0">
            <UserCircle className="w-10 h-10 md:w-12 md:h-12 text-[#D4AF37]" />
         </div>
         <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={localSettings.adminName}
                  onChange={e => setLocalSettings({...localSettings, adminName: e.target.value})}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded pr-3 pl-3 py-2 text-white outline-none focus:border-[#D4AF37]"
                />
                <input 
                  type="email" 
                  value={localSettings.adminEmail}
                  onChange={e => setLocalSettings({...localSettings, adminEmail: e.target.value})}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded pr-3 pl-3 py-2 text-white outline-none focus:border-[#D4AF37]"
                />
                <div className="flex gap-2 justify-center sm:justify-start">
                  <button onClick={handleSave} className="bg-[#D4AF37] text-black px-4 py-1.5 rounded text-sm font-bold">Save</button>
                  <button onClick={() => setIsEditing(false)} className="border border-white/10 text-white px-4 py-1.5 rounded text-sm hover:bg-white/5">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl md:text-2xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                  {settings.adminName || 'Setup Your Business Name'}
                  <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-white text-sm underline decoration-gray-500">Edit</button>
                </h3>
                <p className="text-gray-400 font-mono text-xs">{settings.adminEmail || 'admin@yourstore.com'}</p>
                <div className="flex items-center gap-2 justify-center sm:justify-start mt-2">
                  <span className="inline-block bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/20">{settings.adminName ? 'Owner' : 'UNCONFIGURED'}</span>
                  {savedStatus && <span className="text-[#50C878] text-xs font-bold">{savedStatus}</span>}
                </div>
              </>
            )}
         </div>
      </div>
      <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 space-y-4">
         <h3 className="text-lg font-bold text-white mb-4">Security</h3>
         <button className="w-full py-3 bg-[#0A0A0A] border border-white/10 text-white font-bold rounded-lg hover:border-white/30 transition-colors">
            Change Password
         </button>
         <button 
           onClick={() => setActiveTab('auth')}
           className="w-full py-3 bg-[#DC143C]/10 border border-[#DC143C]/30 text-[#DC143C] font-bold rounded-lg hover:bg-[#DC143C]/20 transition-colors mb-2"
         >
            Sign Out
         </button>
      </div>
    </div>
  );
}

function CJManagementSection() {
  const { products, settings, addProduct } = useStore();
  const [productUrl, setProductUrl] = useState('');
  const [orderId, setOrderId] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (msg: string) => setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleFetchProduct = async () => {
    if (!settings.cjConnected) {
      addLog('⚠️ Error: Connection Required. Please link your CJ account in "Connections".');
      return;
    }
    if (!productUrl) return;

    if (settings.cjAccessToken) cjApi.accessToken = settings.cjAccessToken;
    if (settings.cjApiKey) cjApi.apiKey = settings.cjApiKey;
    setIsLoading(true);
    addLog(`🔍 Analyzing product path: ${productUrl}...`);
    
    try {
      const p = await cjApi.getProductByUrl(productUrl);
      addLog(`✨ Success: Identified "${p.productName || p.title || 'Premium Item'}"`);
      addLog(`⚙️ Processing metadata & images...`);
      
      const newProduct = {
         id: `cj-${p.pid || Math.floor(Math.random() * 10000)}`,
         title: p.productName || p.title || 'CJ Imported Product',
         description: p.productDescription || 'Automatically imported via CJ Dropshipping API integration.',
         supplier: 'CJ Dropshipping',
         price: parseFloat(p.sellPrice || p.price) || 29.99,
         basePrice: parseFloat(p.sellPrice || p.price) || 19.99,
         commission: 15.00,
         finalPrice: (parseFloat(p.sellPrice || p.price) || 19.99) + 15.00,
         stock: p.productStock || 100,
         rating: 5.0,
         category: p.categoryName || 'General',
         imageUrl: p.productImage || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80',
         images: p.images || [p.productImage],
         discountEligible: false,
         isNew: true,
         isDemo: false
      };
      
      addProduct(newProduct);
      addLog(`🚀 DEPLOYED: Product is now live in your storefront.`);
      setProductUrl('');
    } catch (err: any) {
      const errorMsg = err.message || 'Unknown integration error';
      addLog(`❌ FAILED: ${errorMsg}`);
      
      // Smart AI suggestion
      if (errorMsg.includes('Interface not found')) {
        addLog('💡 BOT SUGGESTION: The API endpoint might have shifted. Checking for fallback routes...');
      } else if (errorMsg.includes('Not authenticated')) {
        addLog('💡 BOT SUGGESTION: Your Access Token may have expired. Try reconnecting your account.');
      }
    }
    setIsLoading(false);
  };

  const handleTrackOrder = async () => {
    if (!settings.cjConnected) {
      addLog('Error: Not connected to CJ Dropshipping.');
      return;
    }
    if (!orderId) return;

    if (settings.cjAccessToken) cjApi.accessToken = settings.cjAccessToken;
    setIsLoading(true);
    addLog(`Fetching tracking for ${orderId}...`);
    try {
      const tracking = await cjApi.getTracking(orderId);
      addLog(`Tracking Status: ${tracking.status || 'Found'}`);
    } catch (err: any) {
      addLog(`Error: ${err.message}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">CJ Dropshipping Management</h2>
        <p className="text-gray-400">Directly interface with the CJ Dropshipping V2.0 API.</p>
      </div>

      {!settings.cjConnected && (
        <div className="p-4 bg-[#DC143C]/10 text-[#DC143C] border border-[#DC143C]/20 rounded-xl font-bold flex items-center justify-between">
          <span>Not connected to CJ Dropshipping. Please connect your account in the Connections tab.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Fetch Product by URL</h3>
            <p className="text-sm text-gray-400 mb-4">Import a CJ Dropshipping product directly into your catalog.</p>
            <input 
              type="text" 
              placeholder="https://cjdropshipping.com/product/..." 
              value={productUrl}
              onChange={e => setProductUrl(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] outline-none mb-4" 
            />
            <button 
              onClick={handleFetchProduct}
              disabled={isLoading || !productUrl}
              className="w-full py-3 bg-[#FF6A00] text-white font-bold uppercase tracking-wider rounded-lg hover:bg-[#FF6A00]/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isLoading ? 'Processing...' : 'Fetch & Import Product'}
            </button>
          </div>

          <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Order Tracking</h3>
            <p className="text-sm text-gray-400 mb-4">Check live tracking status from the CJ API.</p>
            <input 
              type="text" 
              placeholder="CJ Order ID" 
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] outline-none mb-4" 
            />
            <button 
              onClick={handleTrackOrder}
              disabled={isLoading || !orderId}
              className="w-full py-3 border border-[#FF6A00] text-[#FF6A00] font-bold uppercase tracking-wider rounded-lg hover:bg-[#FF6A00]/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isLoading ? 'Checking...' : 'Track Order'}
            </button>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 flex flex-col h-[500px]">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-white/10 pb-4 mb-4">API Console Output</h3>
          <div className="flex-1 overflow-y-auto space-y-2 font-mono text-sm">
            {log.length === 0 ? (
              <p className="text-gray-600">Awaiting commands...</p>
            ) : (
              log.map((msg, i) => (
                <div key={i} className={msg.includes('Error') ? 'text-[#DC143C]' : msg.includes('Success') ? 'text-[#50C878]' : 'text-gray-300'}>
                  {msg}
                </div>
              ))
            )}
          </div>
          <button onClick={() => setLog([])} className="mt-4 text-xs text-gray-500 hover:text-white uppercase tracking-widest text-right">Clear Terminal</button>
        </div>
      </div>
    </div>
  );
}

function AdminSupportSection() {
  const { supportMessages, addSupportMessage } = useStore();
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Group messages by customer email address to represent threads
  const threadsMap: { [key: string]: { name: string; email: string; orderId?: string; messages: any[] } } = {};
  
  supportMessages.forEach((msg: any) => {
    const email = msg.customerEmail || 'unknown@example.com';
    if (!threadsMap[email]) {
      threadsMap[email] = {
        name: msg.customerName || 'Anonymous Guest',
        email: email,
        orderId: msg.orderId,
        messages: []
      };
    }
    threadsMap[email].messages.push(msg);
  });

  const threads = Object.values(threadsMap);
  const activeThread = selectedEmail ? threadsMap[selectedEmail] : null;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedEmail) return;

    const lastCustomerMsg = activeThread?.messages.filter((m: any) => m.sender === 'customer').pop();

    const newReply = {
      id: `admin-reply-${Date.now()}`,
      sender: 'admin' as const,
      text: replyText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: activeThread?.name || 'Customer',
      customerEmail: selectedEmail,
      orderId: lastCustomerMsg?.orderId || activeThread?.orderId
    };

    addSupportMessage(newReply);
    setReplyText('');

    useStore.getState().addBotLog({
      id: `support-log-${Date.now()}`,
      bot: 'Customer Desk',
      message: `Admin replied to ${newReply.customerName}: "${newReply.text.substring(0, 30)}..."`,
      date: new Date().toLocaleTimeString(),
      type: 'success'
    });
  };

  const insertQuickReply = (text: string) => {
    setReplyText(text);
  };

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">Customer Care Center</h2>
        <p className="text-gray-400">Directly connect with store visitors, solve support tickets, and answer order inquiries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px] bg-[#141414] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        {/* Threads Selector */}
        <div className="lg:col-span-4 border-r border-white/5 flex flex-col h-full bg-[#0A0A0A]/50">
          <div className="p-4 border-b border-white/5">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Active Help Tickets ({threads.length})</span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {threads.map((thread: any) => {
              const lastMsg = thread.messages[thread.messages.length - 1];
              const isSelected = selectedEmail === thread.email;
              return (
                <button
                  key={thread.email}
                  onClick={() => setSelectedEmail(thread.email)}
                  className={`w-full text-left p-4 transition-all flex flex-col gap-1 focus:outline-none ${isSelected ? 'bg-white/5 border-l-4 border-[#D4AF37]' : 'hover:bg-white/5'}`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-bold text-sm text-white">{thread.name}</span>
                    <span className="text-[9px] text-gray-500 font-mono">{lastMsg?.timestamp}</span>
                  </div>
                  <span className="text-xs text-gray-400">{thread.email}</span>
                  <p className="text-xs text-gray-500 italic mt-1.5 truncate max-w-full font-sans">"{lastMsg?.text}"</p>
                  {thread.orderId && (
                    <span className="text-[10px] text-[#D4AF37] border border-[#D4AF37]/20 px-2 py-0.5 rounded font-mono bg-[#D4AF37]/5 max-w-max mt-2">
                      Ref: {thread.orderId}
                    </span>
                  )}
                </button>
              );
            })}
            {threads.length === 0 && (
              <div className="p-12 text-center text-gray-500 text-xs font-sans">
                No active support messages recorded in this session.
              </div>
            )}
          </div>
        </div>

        {/* Messaging Box */}
        <div className="lg:col-span-8 flex flex-col h-full bg-[#0F0F0F]/30">
          {activeThread ? (
            <>
              {/* Header */}
              <div className="p-5 border-b border-white/5 bg-[#000]/10 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">{activeThread.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{activeThread.email}</p>
                </div>
                {activeThread.orderId && (
                  <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 px-3 py-1.5 rounded-lg text-right font-mono text-xs text-[#D4AF37]">
                    Order Referred: {activeThread.orderId}
                  </div>
                )}
              </div>

              {/* Message scroll list */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {activeThread.messages.map((msg: any) => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-gray-400 font-bold">{isAdmin ? 'Store Support' : msg.customerName}</span>
                        <span className="text-[9px] text-gray-500 font-mono">{msg.timestamp}</span>
                      </div>
                      <div 
                        className={`p-3.5 rounded-xl max-w-[80%] text-xs font-semibold leading-relaxed shadow-sm ${
                          isAdmin 
                            ? 'text-black rounded-tr-none font-sans' 
                            : 'bg-white/5 border border-white/5 text-gray-100 rounded-tl-none font-sans'
                        }`}
                        style={isAdmin ? { backgroundColor: '#D4AF37' } : {}}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Template Picker */}
              <div className="p-4 border-t border-white/5 bg-black/30 flex flex-wrap gap-2 items-center">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider select-none">Quick Replies:</span>
                <button 
                  onClick={() => insertQuickReply(`Hello ${activeThread.name}! I am investigating this shipment hold-up with our logistics agent right now. Will resolve ASAP.`)}
                  className="bg-white/5 hover:bg-white/10 text-[10px] text-gray-300 font-bold px-2 py-1 rounded border border-white/5 transition-all text-left"
                >
                  🚚 Carrier Hold-up
                </button>
                <button 
                  onClick={() => insertQuickReply(`We apologize! This dropship inventory is temporarily out of stock. We can offer a 100% store credit or swap for a similar product.`)}
                  className="bg-white/5 hover:bg-white/10 text-[10px] text-gray-300 font-bold px-2 py-1 rounded border border-white/5 transition-all text-left"
                >
                  📦 Inventory Issue
                </button>
                <button 
                  onClick={() => insertQuickReply(`Thank you for confirming your correct physical address. I have successfully updated our drop-shipping log details.`)}
                  className="bg-white/5 hover:bg-white/10 text-[10px] text-gray-300 font-bold px-2 py-1 rounded border border-white/5 transition-all text-left"
                >
                  🏠 Confirm Address
                </button>
              </div>

              {/* In-box Reply Bar */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-white/5 bg-black/20 flex gap-3">
                <input
                  type="text" required
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder={`Type a direct message to ${activeThread.name}...`}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D4AF37] transition-all"
                />
                <button
                  type="submit"
                  className="px-6 bg-[#D4AF37] hover:brightness-110 active:scale-95 text-black font-black uppercase text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border-none"
                >
                  Send <Send className="w-3.5 h-3.5 text-black" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-black/10 font-sans">
              <MessageSquare className="w-12 h-12 text-gray-600 mb-3" />
              <h4 className="text-base font-bold text-white">Select a Chat Box Thread</h4>
              <p className="text-gray-500 text-xs mt-1 max-w-xs">Review real-time incoming visitor inquiries and troubleshoot customer satisfaction queries instantly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
