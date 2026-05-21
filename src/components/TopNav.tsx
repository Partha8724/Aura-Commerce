import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Bell, Menu, X, Home, ShoppingBag, Bot, Settings, Link as LinkIcon, User as UserIcon, LogOut, ChevronRight, Compass } from 'lucide-react';
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
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
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

  const anchors = [
    { id: 'explosive', label: 'Explosive Products' },
    { id: 'deals', label: 'Deals Zone' },
    { id: 'essentials', label: 'Daily Essentials' },
    { id: 'arrivals', label: 'New Arrivals' },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const scrollToAnchor = (id: string) => {
    setMobileMenuOpen(false);
    if (activeTab !== 'home') {
      setActiveTab('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-[#0A0A0A]/95 backdrop-blur-3xl border-b border-[#D4AF37]/35 shadow-[0_8px_35px_rgba(0,0,0,0.8)] py-3' 
          : 'bg-transparent py-5 border-b border-transparent'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => handleTabClick('home')}
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
              className="w-10 h-10 border border-[#D4AF37] rounded flex items-center justify-center relative overflow-hidden bg-black"
            >
              <motion.div 
                animate={{ 
                  opacity: [0.15, 0.4, 0.15],
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
          <div className="hidden lg:flex items-center gap-2 bg-[#141414]/90 backdrop-blur-md p-1 border border-[#D4AF37]/20 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.05)]">
            {tabs.filter(t => user || t.public).map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative px-5 py-2.5 text-xs transition-all duration-300 flex items-center gap-2 rounded-full cursor-pointer ${
                    isActive ? 'text-[#0A0A0A] font-extrabold' : 'text-gray-400 hover:text-[#D4AF37] font-medium'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 gold-gradient rounded-full shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                    />
                  )}
                  <tab.icon className={`w-3.5 h-3.5 z-10 ${isActive ? 'text-black' : ''}`} />
                  <span className="relative z-10 tracking-[0.15em] uppercase">{tab.label}</span>
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
              className="relative text-[#D4AF37] hover:text-[#F4D03F] transition-all duration-300 p-2 bg-[#D4AF37]/10 rounded-full hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:bg-[#D4AF37]/20 cursor-pointer"
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
                <button onClick={() => setActiveTab('auth')} className="text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-white transition-colors cursor-pointer">Sign In</button>
                <button onClick={() => setActiveTab('auth')} className="text-xs uppercase tracking-widest font-bold text-black gold-gradient px-4 py-2 rounded-full hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all cursor-pointer">Join</button>
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
                      className="absolute top-[calc(100%+10px)] right-0 w-56 bg-[#141414] border border-[#D4AF37]/20 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-white/5 mb-1">
                        <div className="text-white font-bold text-sm truncate">{user.name}</div>
                        <div className="text-gray-500 text-xs truncate">{user.email}</div>
                      </div>
                      
                      <div className="p-2 border-b border-white/5 mb-1 flex flex-col gap-1">
                        <button onClick={() => { setProfileSection('profile'); handleTabClick('profile'); setUserMenuOpen(false); }} className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors rounded-lg cursor-pointer">My Account</button>
                        <button onClick={() => { setProfileSection('orders'); handleTabClick('profile'); setUserMenuOpen(false); }} className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors rounded-lg cursor-pointer">My Orders</button>
                        <button onClick={() => { setProfileSection('addresses'); handleTabClick('profile'); setUserMenuOpen(false); }} className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors rounded-lg cursor-pointer">My Addresses</button>
                        
                        {(user.role === 'owner' || user.email === 'parthadutta8724@gmail.com') && (
                          <button onClick={() => { handleTabClick('admin'); setUserMenuOpen(false); }} className="w-full px-3 py-2 text-left text-sm text-[#D4AF37] hover:bg-[#D4AF37]/10 flex items-center gap-2 transition-colors rounded-lg cursor-pointer">
                            <Settings className="w-4 h-4" /> Admin Panel
                          </button>
                        )}
                      </div>

                      <div className="p-2">
                        <button onClick={handleLogout} className="w-full px-3 py-2 text-left text-sm text-[#DC143C] hover:bg-[#DC143C]/10 flex items-center gap-2 transition-colors rounded-lg cursor-pointer">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Hamburger Button for Off-Canvas */}
            <button 
              className="lg:hidden text-gray-300 ml-2 p-2 hover:bg-white/5 rounded-full cursor-pointer transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Elegant Submodule Anchors Menu (On Desktop when on Home Tab for easier navigation) */}
        {activeTab === 'home' && (
          <div className="hidden lg:flex items-center justify-center gap-10 py-2 border-t border-white/5 bg-[#0A0A0B]/40 backdrop-blur-3xl transition-opacity duration-300">
            {anchors.map(anchor => (
              <button
                key={anchor.id}
                onClick={() => scrollToAnchor(anchor.id)}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]/75 hover:text-white hover:tracking-[0.25em] transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
              >
                <span className="w-1 h-1 bg-[#D4AF37] rounded-full opacity-60 animate-pulse" />
                {anchor.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* OFF-CANVAS BACKDROP MASK */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black z-40 lg:hidden backdrop-blur-xs"
          />
        )}
      </AnimatePresence>

      {/* OFF-CANVAS RESPONSIVE SIDEBAR DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%', opacity: 0.9 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.9 }}
            transition={{ type: 'spring', damping: 26, stiffness: 210 }}
            className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-[#0A0A0A] border-l border-[#D4AF37]/20 z-50 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-3xl lg:hidden overflow-y-auto font-sans"
          >
            {/* Header / Brand with Close Button */}
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border border-[#D4AF37] rounded flex items-center justify-center relative overflow-hidden bg-black">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37] to-[#8C6D23] opacity-30" />
                    <span className="font-display font-medium text-sm text-[#D4AF37] relative z-10">A</span>
                  </div>
                  <span className="text-md font-display font-bold tracking-[0.2em] uppercase text-white">AURA</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-[#D4AF37] hover:bg-white/5 rounded-full transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Tab Pages */}
              <div className="space-y-2 mb-8">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-3">Pages</div>
                {tabs.filter(t => user || t.public).map(tab => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`w-full px-4 py-3 text-left font-bold transition-all duration-300 flex items-center justify-between rounded-xl border cursor-pointer ${
                        isActive 
                          ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30' 
                          : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <tab.icon className="w-4 h-4" />
                        <span className="uppercase tracking-widest text-xs">{tab.label}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 opacity-50 transition-transform ${isActive ? 'translate-x-[2px]' : ''}`} />
                    </button>
                  );
                })}
              </div>

              {/* Home Anchor Fast Scroll Section */}
              <div className="space-y-2 pt-6 border-t border-white/5">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black flex items-center gap-1.5 mb-3">
                  <Compass className="w-3 h-3 text-[#D4AF37]" /> Browse Store Sections
                </div>
                {anchors.map(anchor => (
                  <button
                    key={anchor.id}
                    onClick={() => scrollToAnchor(anchor.id)}
                    className="w-full px-4 py-2.5 text-left text-xs font-bold uppercase tracking-widest text-[#D4AF37] hover:text-white hover:bg-[#D4AF37]/5 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full shrink-0" />
                    {anchor.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Accounts & Support Log */}
            <div className="pt-8 border-t border-white/5 mt-auto">
              {!user ? (
                <div className="flex flex-col gap-2.5">
                  <button 
                    onClick={() => handleTabClick('auth')} 
                    className="w-full py-3.5 text-center text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-white border border-white/10 rounded-xl hover:border-white/25 transition-all cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => handleTabClick('auth')} 
                    className="w-full py-3.5 text-center text-xs uppercase tracking-widest font-bold text-black gold-gradient rounded-xl shadow-lg cursor-pointer"
                  >
                    Join Aura
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-amber-700 flex items-center justify-center text-[#D4AF37] font-bold text-sm">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    <div className="truncate flex-1">
                      <div className="text-white text-xs font-bold leading-none truncate">{user.name}</div>
                      <div className="text-gray-500 text-[10px] mt-0.5 leading-none truncate">{user.email}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }} 
                    className="w-full py-3 text-center text-xs uppercase tracking-widest font-bold text-[#DC143C] bg-[#DC143C]/5 border border-[#DC143C]/10 rounded-xl hover:bg-[#DC143C]/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4.5 h-4.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
