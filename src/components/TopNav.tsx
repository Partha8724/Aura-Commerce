import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Bell, Menu, X, Home, ShoppingBag, Bot, Settings, Link as LinkIcon, User as UserIcon, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CartDrawer } from './CartDrawer';

export function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  
  const { 
    activeTab, 
    setActiveTab, 
    cart, 
    stats, 
    user, 
    setUser, 
    isCartOpen, 
    setIsCartOpen,
    notifications,
    markAllNotificationsRead,
    clearNotifications,
    setProfileSection
  } = useStore();

  const [bouncing, setBouncing] = useState(false);
  const totalItems = cart.reduce((acc, item) => acc + item.cartQuantity, 0);

  useEffect(() => {
    if (totalItems > 0) {
      setBouncing(true);
      const t = setTimeout(() => setBouncing(false), 300);
      return () => clearTimeout(t);
    }
  }, [totalItems]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userNotifications = (notifications || []).filter(n => {
    if (n.email) {
      return user && n.email.toLowerCase() === user.email.toLowerCase();
    }
    return true; // global system or automation bot updates
  });

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, public: true },
    { id: 'shop', label: 'Shop', icon: ShoppingBag, public: true },
    { id: 'partner', label: 'Partner Central', icon: Bot, public: true },
    { id: 'profile', label: 'Track Order', icon: LinkIcon, public: true },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#141414]/80 backdrop-blur-3xl border-b border-[#D4AF37]/30 shadow-[0_4px_30px_rgba(212,175,55,0.05)] py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => handleTabClick('shop')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              animate={{ 
                borderColor: ["#D4AF37", "#F4D03F", "#D4AF37"],
                boxShadow: [
                  "0 0 0px rgba(212,175,55,0)",
                  "0 0 15px rgba(212,175,55,0.3)",
                  "0 0 0px rgba(212,175,55,0)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-10 h-10 border border-[#D4AF37] rounded flex items-center justify-center relative overflow-hidden"
            >
              <motion.div 
                animate={{ 
                  opacity: [0.2, 0.5, 0.2],
                  rotate: [0, 90, 180, 270, 360]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37] to-[#8C6D23]" 
              />
              <span className="font-display font-black text-xl text-[#D4AF37] relative z-10">A</span>
            </motion.div>
            <motion.span 
              animate={{ 
                color: ["#FFFFFF", "#D4AF37", "#FFFFFF"],
                textShadow: [
                  "0 0 0px rgba(255,255,255,0)",
                  "0 0 10px rgba(212,175,55,0.5)",
                  "0 0 0px rgba(255,255,255,0)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-xl font-display font-bold tracking-[0.2em] uppercase hidden sm:block gold-text-shadow"
            >
              AURA
            </motion.span>
          </motion.div>

          {/* Desktop Tabs */}
          <div className="hidden lg:flex items-center gap-2 bg-[#1A1A1A]/80 backdrop-blur-md p-1 border border-[#D4AF37]/20 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.05)]">
            {tabs.filter(t => user || t.public).map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative px-5 py-2 text-sm transition-colors flex items-center gap-2 rounded-full ${
                    isActive ? 'text-[#0A0A0A] font-bold' : 'text-gray-400 hover:text-[#D4AF37] font-medium'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 gold-gradient rounded-full shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                    />
                  )}
                  <tab.icon className={`w-4 h-4 z-10 ${isActive ? 'text-black' : ''}`} />
                  <span className="relative z-10 tracking-widest uppercase text-xs">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            {user && (
              <div className="relative" ref={notifMenuRef}>
                <button 
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    if (!notificationsOpen) {
                      markAllNotificationsRead();
                    }
                  }}
                  className="relative text-gray-400 hover:text-[#D4AF37] transition-colors p-2 hover:bg-white/5 rounded-full cursor-pointer"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#DC143C] rounded-full shadow-[0_0_8px_#DC143C]" />
                  )}
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-[calc(100%+10px)] right-0 w-80 sm:w-96 bg-[#141414] border border-[#D4AF37]/20 rounded-2xl shadow-[0_15px_45px_rgba(0,0,0,0.9)] backdrop-blur-2xl overflow-hidden py-1 z-50 font-sans"
                    >
                      <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-xs tracking-wider uppercase">Alert logs</span>
                          {unreadCount > 0 && (
                            <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border border-[#D4AF37]/10 animate-pulse">
                              {unreadCount} NEW
                            </span>
                          )}
                        </div>
                        {userNotifications.length > 0 && (
                          <button 
                            onClick={clearNotifications}
                            className="text-[10px] uppercase tracking-widest text-red-500 hover:text-red-400 font-bold transition-colors cursor-pointer"
                          >
                            Clear all
                          </button>
                        )}
                      </div>

                      <div className="max-h-[320px] overflow-y-auto divide-y divide-white/5">
                        {userNotifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-500 font-sans text-xs">
                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-20 text-gray-400" />
                            No alerts or updates yet
                          </div>
                        ) : (
                          userNotifications.map(n => (
                            <div 
                              key={n.id} 
                              className={`p-4 transition-colors relative hover:bg-white/5 ${!n.read ? 'bg-[#D4AF37]/5' : ''}`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <span className="font-bold text-white text-xs uppercase tracking-wide">
                                  {n.title}
                                </span>
                                <span className="text-[9px] text-gray-500 whitespace-nowrap font-mono">{n.date}</span>
                              </div>
                              <p className="text-gray-300 text-xs mt-1 leading-relaxed">
                                {n.message}
                              </p>
                              
                              <div className="flex gap-2 mt-2">
                                {n.type === 'order' && (
                                  <span className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[9px] text-[#D4AF37] tracking-wider uppercase px-2 py-0.5 rounded font-mono font-bold">
                                    Delivery Dispatch
                                  </span>
                                )}
                                {n.type === 'support' && (
                                  <span className="bg-blue-500/10 border border-blue-500/20 text-[9px] text-blue-400 tracking-wider uppercase px-2 py-0.5 rounded font-mono font-bold">
                                    Care Desk
                                  </span>
                                )}
                                {n.type === 'bot' && (
                                  <span className="bg-purple-500/10 border border-purple-500/20 text-[9px] text-purple-400 tracking-wider uppercase px-2 py-0.5 rounded font-mono font-bold">
                                    Dropship Bot
                                  </span>
                                )}
                                {n.type === 'system' && (
                                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 tracking-wider uppercase px-2 py-0.5 rounded font-mono font-bold">
                                    Aura Core
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative text-[#D4AF37] hover:text-[#F4D03F] transition-all duration-300 p-2 bg-[#D4AF37]/10 rounded-full hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:bg-[#D4AF37]/20"
            >
              <motion.div animate={bouncing ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}} transition={{ duration: 0.3 }}>
                <ShoppingCart className="w-5 h-5" />
              </motion.div>
              {totalItems > 0 && (
                <motion.span 
                  initial={{ scale: 0 }} 
                  animate={bouncing ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -top-1 -right-1 gold-gradient text-black text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-md"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            {/* Login / User Dropdown */}
            {!user ? (
              <div className="hidden md:flex items-center gap-3">
                <button onClick={() => setActiveTab('auth')} className="text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-white transition-colors">Sign In</button>
                <button onClick={() => setActiveTab('auth')} className="text-xs uppercase tracking-widest font-bold text-black gold-gradient px-4 py-2 rounded-full hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all">Join</button>
              </div>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all overflow-hidden cursor-pointer"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-5 h-5" />
                  )}
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-[calc(100%+10px)] right-0 w-56 bg-[#141414] border border-[#D4AF37]/20 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden py-2"
                    >
                      <div className="px-4 py-3 border-b border-white/5 mb-1">
                        <div className="text-white font-bold text-sm truncate">{user.name}</div>
                        <div className="text-gray-500 text-xs truncate">{user.email}</div>
                      </div>
                      
                      <div className="p-2 border-b border-white/5 mb-1 flex flex-col gap-1">
                        <button onClick={() => { setProfileSection('profile'); handleTabClick('profile'); setUserMenuOpen(false); }} className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors rounded-lg">My Account</button>
                        <button onClick={() => { setProfileSection('orders'); handleTabClick('profile'); setUserMenuOpen(false); }} className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors rounded-lg">My Orders</button>
                        <button onClick={() => { setProfileSection('addresses'); handleTabClick('profile'); setUserMenuOpen(false); }} className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors rounded-lg">My Addresses</button>
                        
                        {(user.role === 'owner' || user.email === 'parthadutta8724@gmail.com') && (
                          <button onClick={() => { handleTabClick('admin'); setUserMenuOpen(false); }} className="w-full px-3 py-2 text-left text-sm text-[#D4AF37] hover:bg-[#D4AF37]/10 flex items-center gap-2 transition-colors rounded-lg">
                            <Settings className="w-4 h-4" /> Admin Panel
                          </button>
                        )}
                      </div>

                      <div className="p-2">
                        <button onClick={handleLogout} className="w-full px-3 py-2 text-left text-sm text-[#DC143C] hover:bg-[#DC143C]/10 flex items-center gap-2 transition-colors rounded-lg">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <button 
              className="lg:hidden text-gray-300 ml-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#141414] border-b border-[#D4AF37]/20 py-4 px-6 flex flex-col gap-2 shadow-2xl backdrop-blur-2xl">
            {tabs.filter(t => user || t.public).map(tab => (
               <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-4 py-3 text-left font-medium transition-colors flex items-center gap-3 rounded-lg ${
                    activeTab === tab.id ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="uppercase tracking-widest text-xs">{tab.label}</span>
                </button>
            ))}
            {!user && (
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
                <button onClick={() => { handleTabClick('auth') }} className="px-4 py-3 text-center text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-white transition-colors">Sign In</button>
                <button onClick={() => { handleTabClick('auth') }} className="px-4 py-3 text-center text-xs uppercase tracking-widest font-bold text-black gold-gradient rounded-lg">Join</button>
              </div>
            )}
          </div>
        )}
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

