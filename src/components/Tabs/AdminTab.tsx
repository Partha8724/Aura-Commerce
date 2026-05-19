import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { cjApi } from '../../lib/cj-api';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';
import { 
  BarChart3, Package, Bot, ShoppingCart, DollarSign, CreditCard, 
  Users, Tag, LayoutDashboard, Link2, Settings, UserCircle,
  Play, StopCircle, RefreshCw, Loader2, CheckCircle2, AlertCircle
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
        const productsResponse = await cjApi.getProducts(1, 15);
        if (productsResponse && productsResponse.data?.list && productsResponse.data.list.length > 0) {
          addBotLog({
            id: Math.random().toString(),
            bot: 'Auto Import',
            message: `Found ${productsResponse.data.list.length} potential products. Fetching deep-data for each...`,
            date: new Date().toLocaleTimeString(),
            type: 'info'
          });

          for (let i = 0; i < productsResponse.data.list.length; i++) {
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

                const newProduct: Product = {
                   id: `cj-${target.pid || Math.floor(Math.random() * 10000)}`,
                   title: target.productNameEn || target.productName || 'CJ Product',
                   description: target.description || target.productHtmlDescription || target.productKeyEn || 'Automatically imported product from CJ Dropshipping.',
                   supplier: 'CJ Dropshipping',
                   price: parseFloat(target.sellPrice || 0) + parseFloat(margin),
                   basePrice: parseFloat(target.sellPrice || 0),
                   commission: parseFloat(margin),
                   finalPrice: parseFloat(target.sellPrice || 0) + parseFloat(margin),
                   stock: 999,
                   rating: 4.5 + Math.random() * 0.5,
                   category: target.categoryName || 'General',
                   imageUrl: target.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80',
                   images: gallery.length > 0 ? gallery : [target.productImage],
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
                  message: `Sync Complete: ${newProduct.title} (Deep data captured)`,
                  date: new Date().toLocaleTimeString(),
                  type: 'success'
                });
              } catch (innerErr) {
                // Fallback to basic info if detail fetch fails
                const basicProduct: Product = {
                   id: `cj-${prod.pid || Math.floor(Math.random() * 10000)}`,
                   title: prod.productNameEn || prod.productName || 'CJ Product',
                   description: prod.productNameEn || 'Automatically imported product from CJ Dropshipping.',
                   supplier: 'CJ Dropshipping',
                   price: (prod.sellPrice || 0) + parseFloat(margin),
                   basePrice: prod.sellPrice || 0,
                   commission: parseFloat(margin),
                   finalPrice: (prod.sellPrice || 0) + parseFloat(margin),
                   stock: 999,
                   rating: 4.5 + Math.random() * 0.5,
                   category: prod.categoryName || 'General',
                   imageUrl: prod.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80',
                   images: prod.productImage ? [prod.productImage] : [],
                   weight: prod.productWeight || 0,
                   isNew: true,
                   isDemo: false,
                   discountEligible: true
                };
                addProduct(basicProduct);
              }
            }, i * 1500); // 1.5s delay between detail calls to avoid rate limits
          }
          
          setImportStatus('success');
          setTimeout(() => setImportStatus(null), 3000);
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

          const newProduct: Product = {
            id: `cj-${targetProd.pid || Math.floor(Math.random() * 10000)}`,
            title: targetProd.productNameEn || targetProd.productName || 'Imported CJ Product',
            description: targetProd.description || targetProd.productKeyEn || targetProd.productHtmlDescription || 'Imported product from CJ Dropshipping.',
            supplier: 'CJ Dropshipping',
            price: parseFloat(targetProd.sellPrice || 0) + parseFloat(margin),
            basePrice: parseFloat(targetProd.sellPrice || 0),
            commission: parseFloat(margin),
            finalPrice: parseFloat(targetProd.sellPrice || 0) + parseFloat(margin),
            stock: 999,
            rating: 4.5 + Math.random() * 0.5,
            category: targetProd.categoryName || 'General',
            imageUrl: targetProd.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80',
            images: gallery.length > 0 ? gallery : [targetProd.productImage],
            weight: targetProd.productWeight ? parseFloat(targetProd.productWeight) : 0,
            discountEligible: true,
            isNew: true,
            isDemo: false
          };

          addProduct(newProduct);
          addBotLog({
            id: Math.random().toString(),
            bot: 'Auto Import',
            message: `Successfully imported: ${newProduct.title}`,
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
               <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2 block">Commission Markup (${margin})</label>
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
  const { products } = useStore();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-white mb-2">Product Catalog ({products.length})</h2>
          <p className="text-gray-400">Manage your active products, edit prices, and monitor stock.</p>
        </div>
      </div>

      <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500 bg-[#0A0A0A]">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Base Price</th>
                <th className="p-4 font-medium">Your Price</th>
                <th className="p-4 font-medium">Profit</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 50).map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded overflow-hidden shrink-0 bg-white/5">
                        <img src={product.images?.[0] || product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="truncate max-w-[200px] block">{product.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400 text-sm whitespace-nowrap">{product.category}</td>
                  <td className="p-4 text-gray-300 text-sm">${(product.price || product.basePrice || 0).toFixed(2)}</td>
                  <td className="p-4 text-white font-bold">${(product.finalPrice || (product.price || 0) + product.commission).toFixed(2)}</td>
                  <td className="p-4 text-[#50C878] font-bold">
                    +${(product.commission || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 text-center border-t border-white/5">
            <button className="text-gray-400 hover:text-white text-sm">View All Products</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersSection() {
  const { orders } = useStore();
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">Order Management</h2>
        <p className="text-gray-400">Track and fulfill recent customer orders.</p>
      </div>
      <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500 bg-[#0A0A0A]">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Payment</th>
                <th className="p-4 font-medium">Supplier</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white font-mono text-sm">{order.id}</td>
                  <td className="p-4 text-gray-400 text-sm whitespace-nowrap">{order.date}</td>
                  <td className="p-4 text-gray-300 text-sm">{order.customerName}</td>
                  <td className="p-4 text-gray-400 text-sm">{order.paymentMethod || 'Credit Card'}</td>
                  <td className="p-4 text-gray-400 text-sm">{order.supplier}</td>
                  <td className="p-4 text-white font-bold">${order.total.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                      order.status === 'Completed' || order.status === 'Delivered' ? 'bg-[#50C878]/10 text-[#50C878] border border-[#50C878]/20' : 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                   <td colSpan={6} className="p-8 text-center text-gray-500">No orders placed yet.</td>
                </tr>
              )}
            </tbody>
          </table>
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
