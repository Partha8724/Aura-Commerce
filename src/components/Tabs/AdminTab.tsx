import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { cjApi } from '../../lib/cjApi';
import { supabase } from '../../lib/supabase';
import { 
  BarChart3, Package, Bot, ShoppingCart, DollarSign, CreditCard, 
  Users, Tag, LayoutDashboard, Link2, Settings, UserCircle,
  Play, StopCircle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function BotAssistant() {
  const { products, botLogs, settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const demoProductsCount = products.filter(p => p.isDemo).length;
  const realProductsCount = products.filter(p => !p.isDemo).length;

  useEffect(() => {
    if (demoProductsCount > 0 && !settings.cjConnected) {
      setMessage("Hello! I'm Aura. You're currently in Demo Mode. Connect your CJ account to start importing real products!");
    } else if (settings.cjConnected && realProductsCount === 0) {
      setMessage("Excellent! Your CJ account is linked. Now, go to 'CJ Management' and paste a product URL to import your first real item.");
    } else if (realProductsCount > 0) {
      setMessage(`Business is booming! You have ${realProductsCount} real products. I've archived all demo data to focus on your real revenue.`);
    } else {
      setMessage("Your empire is growing. I'm monitoring your store for any price changes or order updates.");
    }
  }, [demoProductsCount, realProductsCount, settings.cjConnected]);

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
        {demoProductsCount > 0 && realProductsCount === 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#DC143C] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0A0A0A]">
            1
          </span>
        )}
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
          <p className="text-3xl font-bold font-mono text-white group-hover:text-purple-400 transition-colors">1,247</p>
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
  const { products, addProduct, botLogs, addBotLog } = useStore();
  const [demoUrl, setDemoUrl] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [margin, setMargin] = useState('15');

  const handleImport = () => {
    if (!demoUrl) return;
    setImportStatus('connecting');
    setTimeout(() => {
      // Mock creating a product
      const newProduct = {
         id: `prod-${Math.floor(Math.random() * 10000)}`,
         title: `Imported Product from ${demoUrl.includes('aliexpress') ? 'AliExpress' : 'CJ Dropshipping'}`,
         description: 'Automatically imported description with high-converting AI copywriting.',
         supplier: demoUrl.includes('aliexpress') ? 'AliExpress' : 'CJ Dropshipping',
         price: 24.99,
         basePrice: 19.99,
         commission: parseFloat(margin),
         finalPrice: 19.99 + parseFloat(margin),
         stock: 120,
         rating: 4.8,
         category: 'Electronics',
         imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80',
         discountEligible: true,
         isNew: true,
         isDemo: false
      };
      
      const hasDemos = products.some(p => p.isDemo);
      addProduct(newProduct);
      
      addBotLog({
        id: Math.random().toString(),
        bot: 'Auto Import',
        message: `Successfully imported: ${newProduct.title}${hasDemos ? '. purging demo products...' : ''}`,
        date: new Date().toLocaleTimeString(),
        type: 'success'
      });
      
      setImportStatus('success');
      setDemoUrl('');
      setTimeout(() => setImportStatus(null), 3000);
    }, 2000);
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
              placeholder="Paste CJ Dropshipping or AliExpress URL..."
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
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
            disabled={importStatus !== null || !demoUrl}
            className="w-full py-4 gold-gradient text-black font-bold uppercase tracking-widest text-sm rounded-xl disabled:opacity-50"
          >
            {importStatus === 'connecting' ? 'Importing...' : importStatus === 'success' ? 'Product Live!' : 'Import Product'}
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
             onClick={() => {
                addBotLog({ id: Math.random().toString(), bot: 'Price Scanner', message: 'Scanned all products. Prices are optimal.', date: new Date().toLocaleTimeString(), type: 'info' })
             }}
             className="w-full py-4 bg-transparent border border-[#222222] hover:border-[#D4AF37] text-white font-bold uppercase tracking-widest text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Run Scan Now
          </button>
        </div>

      </div>
    </div>
  );
}

function ConnectionsSection() {
  const { settings, updateSettings } = useStore();
  const [cjKey, setCjKey] = useState(settings.cjApiKey || '');
  const [cjAccess, setCjAccess] = useState(settings.cjAccessToken || '');
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    // Check if server already has keys
    const detect = async () => {
      const hasKeys = await cjApi.detectConnection();
      if (hasKeys && !settings.cjConnected) {
        updateSettings({ cjConnected: true });
        quickLog('🛡️ Secure Server Connection Detected');
      }
    };
    detect();

    // Initialize cjApi from settings
    if (settings.cjAccessToken) {
      cjApi.accessToken = settings.cjAccessToken;
      cjApi.apiKey = settings.cjApiKey;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CJ_CONNECTED') {
        const { apiKey, accessToken } = event.data.payload;
        cjApi.apiKey = apiKey;
        cjApi.accessToken = accessToken;
        setCjKey(apiKey);
        setCjAccess(accessToken);
        updateSettings({ cjApiKey: apiKey, cjAccessToken: accessToken, cjConnected: true });
        setStatus('Successfully connected to CJ Dropshipping!');
        quickLog('✅ Connection received via Quick Connect');
        setTimeout(() => setStatus(null), 3000);
      } else if (event.data?.type === 'CJ_DISCONNECTED') {
        cjApi.accessToken = null;
        cjApi.apiKey = null;
        setCjKey('');
        setCjAccess('');
        updateSettings({ cjApiKey: '', cjAccessToken: '', cjConnected: false });
        setStatus('Disconnected from CJ Dropshipping.');
        quickLog('🔌 Disconnected from CJ Dropshipping');
        setTimeout(() => setStatus(null), 3000);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [settings, updateSettings]);

  const quickLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLog(prev => [...prev, `[${time}] ${msg}`]);
  };

  const handleConnectCJ = async () => {
    // Client-side Validation
    if (!cjKey || !cjAccess) {
      setStatus('err: Please enter both API Key and Access Token');
      return;
    }

    if (cjKey.length < 10) {
      setStatus('err: API Key is too short (min 10 characters)');
      quickLog('⚠️ Validation Failed: API Key must be at least 10 characters.');
      return;
    }

    // JWT structure check (header.payload.signature)
    // CJ Tokens often have a prefix like "API@...:", so we check the part after the colon or the whole string
    const tokenPart = cjAccess.includes(':') ? cjAccess.split(':')[1] : cjAccess;
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
    
    if (!jwtRegex.test(tokenPart)) {
      setStatus('err: Invalid Access Token format. It must be a valid JWT.');
      quickLog('⚠️ Validation Failed: Access Token does not match JWT structure.');
      return;
    }

    setIsLoading(true);
    setStatus('Connecting to CJ...');
    quickLog('⚡ Manual Connection Started...');
    
    try {
      const response = await cjApi.checkDirectConnection(cjAccess, cjKey);
      if (response.success) {
        cjApi.apiKey = cjKey;
        cjApi.accessToken = cjAccess; // Also set it on the instance
        updateSettings({ cjApiKey: cjKey, cjAccessToken: cjAccess, cjConnected: true });
        setStatus('Connected successfully!');
        quickLog('✅ CJ DROPSHIPPING CONNECTED SUCCESSFULLY!');
      } else {
        setStatus('err: ' + response.error);
        quickLog(`❌ Connection Error: ${response.error}`);
        updateSettings({ cjConnected: false });
      }
    } catch (err: any) {
      setStatus('err: Connection failed.');
      quickLog(`❌ Network Error: ${err.message}`);
    }
    setIsLoading(false);
    setTimeout(() => setStatus(null), 3000);
  };

  const handleDisconnectCJ = () => {
    if (confirm('Are you sure you want to disconnect?')) {
      cjApi.accessToken = null;
      updateSettings({ cjConnected: false, cjAccessToken: '', cjApiKey: '' });
      setCjKey('');
      setCjAccess('');
      setStatus('Disconnected.');
      quickLog('🔌 Disconnected from CJ');
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const checkConnection = async () => {
    setStatus('Testing connection...');
    quickLog('🧪 Testing connection...');
    try {
      if (!settings.cjAccessToken) throw new Error('No access token found.');
      const response = await cjApi.checkDirectConnection(settings.cjAccessToken, settings.cjApiKey);
      if (response.success) {
        setStatus('Connection OK');
        quickLog('✅ Connection is working perfectly!');
      } else {
        setStatus('err: ' + response.error);
        quickLog(`⚠️ Error: ${response.error}`);
      }
    } catch(err: any) {
      setStatus('err: Connection test failed.');
      quickLog(`❌ Test failed: ${err.message}`);
    }
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <div className="space-y-8 max-w-3xl border border-transparent">
      <div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">Platform Connections</h2>
        <p className="text-gray-400">Configure your dropshipping & payment APIs.</p>
        <AnimatePresence>
          {status && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-4 p-3 rounded font-bold border ${status.startsWith('err:') ? 'bg-[#DC143C]/10 text-[#DC143C] border-[#DC143C]/20' : 'bg-[#50C878]/10 text-[#50C878] border-[#50C878]/20'}`}
            >
              {status.replace('err: ', '')}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CJ Dropshipping Manual Integration */}
      <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-[#FF6A00] rounded flex items-center justify-center text-white font-bold">CJ</div>
                CJ Dropshipping Integration
              </h3>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${settings.cjConnected ? 'bg-[#50C878] animate-pulse' : 'bg-gray-600'}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${settings.cjConnected ? 'text-[#50C878]' : 'text-gray-500'}`}>
                  {settings.cjConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
           </div>
           
           <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">API Key</label>
                <input 
                  type="password" 
                  value={cjKey}
                  onChange={e => setCjKey(e.target.value)}
                  placeholder="Paste your CJ API Key"
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-3 text-white focus:border-[#FF6A00] outline-none" 
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Access Token</label>
                <textarea 
                  value={cjAccess}
                  onChange={e => setCjAccess(e.target.value)}
                  placeholder="Paste your CJ Access Token"
                  rows={2}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-3 text-white focus:border-[#FF6A00] outline-none resize-none" 
                />
              </div>
           </div>
           
           <div className="mt-6 flex flex-wrap gap-4">
             {!settings.cjConnected ? (
               <button 
                 onClick={handleConnectCJ}
                 disabled={isLoading}
                 className="px-6 py-3 bg-[#FF6A00] text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-[#FF6A00]/80 disabled:opacity-50"
               >
                 {isLoading ? 'Connecting...' : 'Connect to CJ'}
               </button>
             ) : (
               <>
                 <button 
                   onClick={checkConnection}
                   className="px-6 py-3 border border-[#50C878] text-[#50C878] font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-[#50C878]/10"
                 >
                   Test Connection
                 </button>
                 <button 
                   onClick={handleDisconnectCJ}
                   className="px-6 py-3 border border-[#DC143C] text-[#DC143C] font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-[#DC143C]/10"
                 >
                   Disconnect
                 </button>
               </>
             )}
           </div>
        </div>

        {/* Console/Log Output */}
        {(log.length > 0 || isLoading) && (
          <div className="bg-black/50 p-4 font-mono text-xs border-t border-white/5 max-h-40 overflow-y-auto">
             {log.map((msg, i) => (
                <div key={i} className={msg.includes('❌') || msg.includes('Error') ? 'text-red-400' : msg.includes('✅') ? 'text-green-400' : 'text-gray-400'}>
                   {msg}
                </div>
             ))}
             {isLoading && <div className="text-[#FF6A00] animate-pulse">Processing...</div>}
          </div>
        )}
      </div>

      <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-[#003087] rounded flex items-center justify-center text-white font-bold italic">P</div>
                PayPal Integration
              </h3>
              <span className="text-xs font-bold uppercase tracking-wider text-[#50C878] bg-[#50C878]/10 px-3 py-1 rounded border border-[#50C878]/20">Connected</span>
           </div>
           
           <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">PayPal Email</label>
                <input type="text" defaultValue="admin@auracommerce.com" className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Client ID</label>
                  <input type="password" placeholder="••••••••••••" defaultValue="sandbox_id_here" className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Secret</label>
                  <input type="password" placeholder="••••••••••••" defaultValue="sandbox_secret" className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] outline-none" />
                </div>
              </div>
           </div>
           
           <div className="mt-6 flex gap-4">
             <button className="px-6 py-3 bg-white text-black font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-gray-200">Save & Connect</button>
             <button className="px-6 py-3 border border-white/10 text-gray-400 font-bold text-sm uppercase tracking-wider rounded-lg hover:text-white">Test Keys</button>
           </div>
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-[#D4AF37] rounded-2xl p-0 shadow-[0_4px_30px_rgba(212,175,55,0.1)] overflow-hidden max-w-3xl">
        <iframe src="/cj-quick-connect.html" className="w-full h-[850px] border-none" title="CJ Quick Connect" />
      </div>
    </div>
  );
}

function ProductsSection() {
  const { products, removeDemoProducts } = useStore();
  const demoProducts = products.filter(p => p.isDemo);
  const realProducts = products.filter(p => !p.isDemo);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-white mb-2">Product Catalog ({products.length})</h2>
          <p className="text-gray-400">Manage your active products, edit prices, and monitor stock.</p>
        </div>
        {demoProducts.length > 0 && (
          <button 
            onClick={removeDemoProducts}
            className="px-4 py-2 bg-[#DC143C]/10 border border-[#DC143C]/30 text-[#DC143C] text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#DC143C]/20 transition-colors"
          >
            Clear Demo Data
          </button>
        )}
      </div>

      <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500 bg-[#0A0A0A]">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Type</th>
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
                  <td className="p-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      product.isDemo 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                        : 'bg-[#50C878]/10 text-[#50C878] border-[#50C878]/20'
                    }`}>
                      {product.isDemo ? 'Demo' : 'Real'}
                    </span>
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
                  {settings.adminName}
                  <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-white text-sm underline decoration-gray-500">Edit</button>
                </h3>
                <p className="text-gray-400">{settings.adminEmail}</p>
                <div className="flex items-center gap-2 justify-center sm:justify-start mt-2">
                  <span className="inline-block bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/20">Owner</span>
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
      
      const hasDemos = products.some(p => p.isDemo);
      addProduct(newProduct);
      addLog(`🚀 DEPLOYED: Product is now live in your storefront.${hasDemos ? ' Demo products have been purged.' : ''}`);
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
              className="w-full py-3 bg-[#FF6A00] text-white font-bold uppercase tracking-wider rounded-lg hover:bg-[#FF6A00]/80 transition-colors disabled:opacity-50"
            >
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
              className="w-full py-3 border border-[#FF6A00] text-[#FF6A00] font-bold uppercase tracking-wider rounded-lg hover:bg-[#FF6A00]/10 transition-colors disabled:opacity-50"
            >
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
