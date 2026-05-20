import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Package, User as UserIcon, MapPin, Truck, CheckCircle2, Clock, RefreshCw, AlertCircle, Trash2, Edit3, Plus, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cjApi } from '../../lib/cj-api';
import { supabase } from '../../lib/supabase';

export function ProfileTab() {
  const { user, orders, settings, setUser, setActiveTab, profileSection, setProfileSection } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  
  // Guest Tracking State
  const [trackId, setTrackId] = useState('');
  const [trackEmail, setTrackEmail] = useState('');
  const [trackError, setTrackError] = useState('');

  // Profiles State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileStatus, setProfileStatus] = useState<string | null>(null);

  // Address CRUD State
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressLabel, setAddressLabel] = useState('Home');
  const [addressFullName, setAddressFullName] = useState('');
  const [addressPhone, setAddressPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressZip, setAddressZip] = useState('');
  const [addressCountry, setAddressCountry] = useState('United States');

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    if (!user || !user.id) return;
    try {
      const { data, error } = await supabase
        .from('customer_addresses')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setAddresses(data || []);
    } catch (err) {
      console.warn('[Supabase DB Sync] Offline fallback for addresses:', err);
      // Fallback local memory addresses
      const localAddresses = JSON.parse(localStorage.getItem(`aura_addresses_${user.id}`) || '[]');
      setAddresses(localAddresses);
    }
  };

  const saveAddressesToLocalStorage = (addrs: any[]) => {
    if (user?.id) {
      localStorage.setItem(`aura_addresses_${user.id}`, JSON.stringify(addrs));
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSavingProfile(true);
    setProfileStatus(null);
    try {
      if (user.id) {
        const { error } = await supabase
          .from('customer_profiles')
          .update({
            full_name: profileName,
            phone: profilePhone
          })
          .eq('user_id', user.id);
        
        if (error) throw error;
      }
      
      setUser({
        ...user,
        name: profileName,
        phone: profilePhone,
        avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profileName) + '&background=D4AF37&color=000'
      });
      setProfileStatus('Profile information updated successfully!');
      setTimeout(() => setProfileStatus(null), 3000);
    } catch (err: any) {
      console.warn('Profile update error:', err);
      // Local fallback
      setUser({
        ...user,
        name: profileName,
        phone: profilePhone,
        avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profileName) + '&background=D4AF37&color=000'
      });
      setProfileStatus('Profile updated locally.');
      setTimeout(() => setProfileStatus(null), 3000);
    }
    setIsSavingProfile(false);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.id) return;

    const payload = {
      user_id: user.id,
      label: addressLabel,
      full_name: addressFullName,
      phone: addressPhone,
      address_line1: addressLine1,
      address_line2: addressLine2,
      city: addressCity,
      state: addressState,
      zip_code: addressZip,
      country: addressCountry,
      is_default: addresses.length === 0 // Make default if it's the first address
    };

    try {
      if (editingAddressId) {
        // Edit address
        const { error } = await supabase
          .from('customer_addresses')
          .update(payload)
          .eq('id', editingAddressId);
        if (error) throw error;
      } else {
        // Add new address
        const { error } = await supabase
          .from('customer_addresses')
          .insert({
            ...payload,
            id: crypto.randomUUID()
          });
        if (error) throw error;
      }
      
      loadAddresses();
      resetAddressForm();
    } catch (err) {
      console.warn('Address write error, executing offline matching:', err);
      // Offline local sync
      const updatedList = [...addresses];
      if (editingAddressId) {
        const idx = updatedList.findIndex(a => a.id === editingAddressId);
        if (idx !== -1) {
          updatedList[idx] = { ...updatedList[idx], ...payload };
        }
      } else {
        updatedList.push({
          id: 'local-' + Date.now(),
          ...payload
        });
      }
      saveAddressesToLocalStorage(updatedList);
      setAddresses(updatedList);
      resetAddressForm();
    }
  };

  const resetAddressForm = () => {
    setIsEditingAddress(false);
    setEditingAddressId(null);
    setAddressLabel('Home');
    setAddressFullName('');
    setAddressPhone('');
    setAddressLine1('');
    setAddressLine2('');
    setAddressCity('');
    setAddressState('');
    setAddressZip('');
    setAddressCountry('United States');
  };

  const handleEditAddress = (addr: any) => {
    setEditingAddressId(addr.id);
    setAddressLabel(addr.label || 'Home');
    setAddressFullName(addr.full_name || '');
    setAddressPhone(addr.phone || '');
    setAddressLine1(addr.address_line1 || '');
    setAddressLine2(addr.address_line2 || '');
    setAddressCity(addr.city || '');
    setAddressState(addr.state || '');
    setAddressZip(addr.zip_code || '');
    setAddressCountry(addr.country || 'United States');
    setIsEditingAddress(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('customer_addresses')
        .delete()
        .eq('id', id);
      if (error) throw error;
      loadAddresses();
    } catch (err) {
      console.warn('Address delete error, running offline update:', err);
      const filtered = addresses.filter(a => a.id !== id);
      saveAddressesToLocalStorage(filtered);
      setAddresses(filtered);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    if (!user) return;
    try {
      // Set all to false first
      await supabase
        .from('customer_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
      
      // Set this one to true
      await supabase
        .from('customer_addresses')
        .update({ is_default: true })
        .eq('id', id);

      loadAddresses();
    } catch (err) {
      console.warn('Address default set error, running offline swap:', err);
      const items = addresses.map(a => ({
        ...a,
        is_default: a.id === id
      }));
      saveAddressesToLocalStorage(items);
      setAddresses(items);
    }
  };

  const handleGuestTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError('');
    setIsTracking(true);
    
    // First check local orders
    const order = orders.find(o => o.id.toLowerCase() === trackId.toLowerCase() && o.email?.toLowerCase() === trackEmail.toLowerCase());
    
    if (order) {
      setSelectedOrder(order.id);
      setIsTracking(false);
      return;
    } 
    
    // If not found locally, try to query CJ Dropshipping API directly
    try {
      if (settings.cjConnected && settings.cjAccessToken) {
        cjApi.accessToken = settings.cjAccessToken;
        const trackingData = await cjApi.getTracking(trackId);
        if (trackingData) {
          setSelectedOrder(trackId);
          setIsTracking(false);
          return;
        }
      }
      setTrackError('Order not found. Please check your details.');
    } catch (error: any) {
      console.error(error);
      setTrackError('Order not found or tracking not available yet.');
    }
    
    setIsTracking(false);
  };

  // If not logged in, show Guest Tracker + Login CTA
  if (!user) {
    if (selectedOrder) {
      return (
        <div className="max-w-[1200px] mx-auto px-6 py-12">
           <OrderTracker orderId={selectedOrder} onBack={() => { setSelectedOrder(null); setTrackId(''); setTrackEmail(''); }} />
        </div>
      );
    }

    return (
      <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-8 md:p-12">
          <Truck className="w-12 h-12 text-[#D4AF37] mb-6" style={{ color: settings.themeColor }} />
          <h2 className="text-3xl font-display font-bold text-white mb-4">Track Your Order</h2>
          <p className="text-gray-400 mb-8">Enter your order ID and email to get real-time tracking updates.</p>
          
          <form onSubmit={handleGuestTrack} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block font-bold">Order ID</label>
              <input 
                type="text" required
                value={trackId} onChange={e => setTrackId(e.target.value)}
                placeholder="e.g. #ORD-9021" 
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-4 text-white outline-none focus:border-[#D4AF37]" 
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block font-bold">Email Address</label>
              <input 
                type="email" required
                value={trackEmail} onChange={e => setTrackEmail(e.target.value)}
                placeholder="email@example.com" 
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-4 text-white outline-none focus:border-[#D4AF37]" 
              />
            </div>
            {trackError && <p className="text-red-500 text-sm mt-2">{trackError}</p>}
            <button 
              type="submit" disabled={isTracking}
              className="w-full py-4 text-black font-bold uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all mt-4 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${settings.themeColor || '#D4AF37'}, #FFF)` }}
            >
              {isTracking ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Tracking...</span>
                </>
              ) : (
                'Track Order'
              )}
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center justify-center text-center p-8">
          <UserIcon className="w-16 h-16 text-gray-600 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Create an Account</h2>
          <p className="text-gray-400 max-w-md mb-8">Join to save your addresses, view full order history, and checkout faster next time.</p>
          <button 
            onClick={() => setActiveTab('auth')}
            className="px-10 py-4 bg-transparent border border-white/20 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-colors cursor-pointer"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  // Filter orders
  const myOrders = orders.filter(o => o.email?.toLowerCase() === user.email?.toLowerCase());

  if (selectedOrder) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-12">
         <OrderTracker orderId={selectedOrder} onBack={() => setSelectedOrder(null)} />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto mt-6 px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <div className="bg-[#141414] border border-[#D4AF37]/20 rounded-2xl p-6 mb-4 text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-20 h-20 bg-[#D4AF37]/5 rounded-br-full" />
            <div className="w-20 h-20 bg-gradient-to-tr from-[#D4AF37]/40 to-[#FFF]/10 text-[#D4AF37] rounded-full mx-auto flex items-center justify-center mb-4 text-2xl font-black border border-[#D4AF37]/40 shadow-xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-md font-bold text-white tracking-wide truncate">{user.name}</h3>
            <p className="text-xs text-gray-500 truncate mb-1">{user.email}</p>
            {user.role && (
              <span className="inline-block mt-1 font-mono uppercase tracking-widest text-[8px] px-2 py-0.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">{user.role}</span>
            )}
          </div>

          <button 
            onClick={() => setProfileSection('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 border ${profileSection === 'profile' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'}`}
          >
            <UserIcon className="w-4 h-4" /> Profile Info
          </button>
          
          <button 
             onClick={() => setProfileSection('addresses')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 border ${profileSection === 'addresses' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'}`}
          >
            <MapPin className="w-4 h-4" /> Save Addresses
          </button>

          <button 
            onClick={() => setProfileSection('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 border ${profileSection === 'orders' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'}`}
          >
            <Package className="w-4 h-4" /> My Orders
          </button>
          
          <button 
             onClick={() => {
               setUser(null);
               setActiveTab('home');
             }}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors mt-8 border border-transparent"
          >
            Sign Out
          </button>
        </div>

        {/* Content Panel */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {profileSection === 'profile' && (
              <motion.div 
                key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -25 }} transition={{ duration: 0.2 }}
                className="bg-[#141414] border border-white/5 rounded-2xl p-6 md:p-8 space-y-8"
              >
                <div>
                  <h2 className="text-xl font-bold font-display text-white mb-1">Profile Personal Details</h2>
                  <p className="text-xs text-gray-400 font-sans">View or edit your account information.</p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {profileStatus && (
                    <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] p-4 rounded-xl text-xs font-semibold">
                      {profileStatus}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 block font-bold font-sans">Full Name</label>
                      <input 
                        type="text" required
                        value={profileName} onChange={e => setProfileName(e.target.value)} 
                        className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] font-sans" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 block font-bold font-sans">Email Address (Read-only)</label>
                      <input 
                        type="email" disabled
                        value={user.email} 
                        className="w-full bg-[#0A0A0A]/40 border border-white/5 rounded-xl p-3 text-sm text-gray-500 cursor-not-allowed font-sans" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 block font-bold font-sans">Contact Phone Number</label>
                      <input 
                        type="tel"
                        value={profilePhone} onChange={e => setProfilePhone(e.target.value)} 
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] font-sans" 
                      />
                    </div>
                  </div>
                  
                  <button 
                     type="submit" disabled={isSavingProfile}
                     className="px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#ffd700] text-black font-extrabold uppercase tracking-widest text-[10px] rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSavingProfile ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                </form>
              </motion.div>
            )}

            {profileSection === 'addresses' && (
              <motion.div 
                key="addresses" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -25 }} transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {!isEditingAddress ? (
                  <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-bold font-display text-white mb-1">Your Delivery Addresses</h2>
                        <p className="text-xs text-gray-400 font-sans">Add, remove, or modify saved default destinations.</p>
                      </div>
                      <button 
                        onClick={() => { resetAddressForm(); setIsEditingAddress(true); }}
                        className="px-4 py-2.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-extrabold uppercase tracking-widest text-[10px] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Address
                      </button>
                    </div>

                    {addresses.length === 0 ? (
                      <div className="py-12 border border-dashed border-white/10 rounded-xl text-center flex flex-col items-center">
                        <MapPin className="w-10 h-10 text-gray-600 mb-3" />
                        <h3 className="text-sm font-bold text-white mb-1">No Addresses Saved</h3>
                        <p className="text-xs text-gray-500 max-w-xs mb-4">Please register an address to facilitate rapid checkouts.</p>
                        <button 
                          onClick={() => setIsEditingAddress(true)}
                          className="px-6 py-2 bg-white text-black text-[10px] font-extrabold tracking-widest uppercase rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Add New Entry
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                          <div key={addr.id} className={`p-5 bg-[#0A0A0A]/60 border rounded-xl relative flex flex-col justify-between group transition-all duration-300 ${addr.is_default ? 'border-[#D4AF37]' : 'border-white/5 hover:border-white/20'}`}>
                            <div>
                              <div className="flex justify-between items-center mb-3">
                                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${addr.is_default ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20 font-black' : 'bg-white/5 text-gray-400 border-white/10'}`}>
                                  {addr.label}
                                </span>
                                {addr.is_default && (
                                  <span className="text-[9px] font-semibold text-[#50C878] uppercase tracking-wider font-sans">Default</span>
                                )}
                              </div>
                              <p className="text-sm font-bold text-white mb-1 tracking-wide">{addr.full_name}</p>
                              <p className="text-xs text-gray-400 leading-relaxed font-sans">{addr.address_line1}</p>
                              {addr.address_line2 && <p className="text-xs text-gray-400 leading-relaxed font-sans">{addr.address_line2}</p>}
                              <p className="text-xs text-gray-400 leading-relaxed font-sans mb-3">{addr.city}, {addr.state} {addr.zip_code}, {addr.country}</p>
                              <p className="text-[10px] font-mono text-gray-500 mb-4">{addr.phone}</p>
                            </div>

                            <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                              {!addr.is_default && (
                                <button 
                                  onClick={() => handleSetDefaultAddress(addr.id)}
                                  className="text-[9px] font-extrabold uppercase tracking-widest text-[#D4AF37] hover:underline"
                                >
                                  Make Default
                                </button>
                              )}
                              <button 
                                onClick={() => handleEditAddress(addr)}
                                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-[9px] uppercase tracking-widest"
                              >
                                <Edit3 className="w-3 h-3" /> Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="text-red-400/80 hover:text-red-400 transition-colors flex items-center gap-1 text-[9px] uppercase tracking-widest ml-auto"
                              >
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-2">
                      <button onClick={resetAddressForm} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <h2 className="text-xl font-bold font-display text-white">
                        {editingAddressId ? 'Edit saved address' : 'Add shipping address'}
                      </h2>
                    </div>

                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 block font-bold block font-sans">Address Label</label>
                          <select 
                            value={addressLabel} onChange={e => setAddressLabel(e.target.value)}
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none"
                          >
                            <option value="Home">Home Address</option>
                            <option value="Work">Work / Corporate</option>
                            <option value="Other">Other Category</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 block font-bold block font-sans">Full Name</label>
                          <input 
                            type="text" required placeholder="Full Name" value={addressFullName} onChange={e => setAddressFullName(e.target.value)}
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 block font-bold block font-sans">Phone Number</label>
                          <input 
                            type="tel" required placeholder="Phone Number" value={addressPhone} onChange={e => setAddressPhone(e.target.value)}
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 block font-bold block font-sans">Address Line 1</label>
                          <input 
                            type="text" required placeholder="Address Line 1" value={addressLine1} onChange={e => setAddressLine1(e.target.value)}
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 block font-bold block font-sans">Address Line 2 (Optional)</label>
                          <input 
                            type="text" placeholder="Apartment, suite, unit etc." value={addressLine2} onChange={e => setAddressLine2(e.target.value)}
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 block font-bold block font-sans">City</label>
                            <input 
                              type="text" required placeholder="City" value={addressCity} onChange={e => setAddressCity(e.target.value)}
                              className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 block font-bold block font-sans">State / Prov</label>
                            <input 
                              type="text" required placeholder="State" value={addressState} onChange={e => setAddressState(e.target.value)}
                              className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 block font-bold block font-sans">ZIP Code</label>
                            <input 
                              type="text" required placeholder="ZIP Code" value={addressZip} onChange={e => setAddressZip(e.target.value)}
                              className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 block font-bold block font-sans">Country</label>
                            <input 
                              type="text" required placeholder="Country" value={addressCountry} onChange={e => setAddressCountry(e.target.value)}
                              className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button 
                          type="button" onClick={resetAddressForm}
                          className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="px-8 py-3 bg-[#D4AF37] text-black font-extrabold text-[10px] uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
                        >
                          {editingAddressId ? 'Update Address' : 'Save Address'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </motion.div>
            )}

            {profileSection === 'orders' && (
              <motion.div 
                key="orders" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -25 }} transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold font-display text-white mb-1">My Orders</h2>
                  <p className="text-xs text-gray-400 font-sans">Explore history or trigger tracking for dispatch packages.</p>
                </div>

                {myOrders.length === 0 ? (
                  <div className="bg-[#141414] border border-white/5 rounded-2xl p-10 text-center flex flex-col items-center">
                    <Package className="w-12 h-12 text-gray-600 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">No orders found</h3>
                    <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                    <button 
                       onClick={() => setActiveTab('shop')}
                       className="px-6 py-3 border border-[#D4AF37] text-[#D4AF37] font-bold rounded-lg hover:bg-[#D4AF37]/10 transition-colors cursor-pointer"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myOrders.map(order => (
                      <div key={order.id} className="bg-[#141414] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#D4AF37]/30 transition-colors relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-bl-full translate-x-16 -translate-y-16 group-hover:bg-[#D4AF37]/10 transition-colors pointer-events-none" />
                        
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                             <span className="font-mono text-xs font-semibold uppercase text-white bg-[#0A0A0A] px-3 py-1 rounded-full border border-white/5">
                               {order.id}
                             </span>
                             <span className="text-[10px] font-mono text-gray-500">{new Date(order.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-gray-400 mb-2 font-mono font-bold">Courier: {order.supplier || 'Global Carrier'}</p>
                          <div className="text-[#D4AF37] font-extrabold text-base tracking-wide flex items-center gap-1">
                             <span className="text-xs font-normal text-gray-400">Total:</span> 
                             ${order.total?.toFixed(2) || '0.00'}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div>
                            <span className="text-[9px] uppercase tracking-widest block text-gray-500 mb-1 font-bold">Shipping Status</span>
                            <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded border ${
                              order.status === 'Processing' || order.status === 'pending'
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                                : order.status === 'Shipped' || order.status === 'Delivered'
                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}>
                              {order.status || 'Processing'}
                            </span>
                          </div>

                          <button 
                             onClick={() => setSelectedOrder(order.id)}
                             className="px-5 py-3 border border-[#D4AF37] text-[#D4AF37] font-bold uppercase tracking-widest text-[9px] rounded-xl hover:bg-[#D4AF37]/10 transition-colors cursor-pointer"
                          >
                            Track Order
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

// Subcomponent: OrderTracker
function OrderTracker({ orderId, onBack }: { orderId: string, onBack: () => void }) {
  const { orders, settings } = useStore();
  const localOrder = orders.find(o => o.id === orderId);

  // Status mapping
  const status = localOrder?.status || 'Processing';
  const isCancelled = status === 'Cancelled';
  const isCompleted = status === 'Completed' || status === 'Delivered';
  const isShipped = status === 'Shipped' || isCompleted;
  const isOut = status === 'Out for Delivery' || isCompleted;

  const trackingNum = localOrder?.trackingNumber || 'AURA-LTK-89302100US';
  const estDelivery = localOrder?.estimatedDelivery || '5-9 Business Days';

  const steps = [
    { label: 'Registered', icon: <Package className="w-5 h-5" />, active: true },
    { label: 'Shipped', icon: <Truck className="w-5 h-5" />, active: isShipped },
    { label: 'Out for Delivery', icon: <Truck className="w-5 h-5 rotate-12" />, active: isOut },
    { label: 'Delivered', icon: <CheckCircle2 className="w-5 h-5" />, active: isCompleted }
  ];

  const trackingUpdates = localOrder?.trackingUpdates && localOrder.trackingUpdates.length > 0 
    ? localOrder.trackingUpdates 
    : [
        { status: 'Package delivered to address', location: 'Recipient Destination', date: new Date().toLocaleDateString() + ' 11:32 AM', condition: isCompleted },
        { status: 'Out for dynamic courier delivery', location: 'Local Logistics Center', date: new Date().toLocaleDateString() + ' 07:15 AM', condition: isOut },
        { status: 'In transit to destination city Hub', location: 'Regional Courier Hub', date: new Date(Date.now() - 3600000 * 18).toLocaleDateString() + ' 03:40 PM', condition: isShipped },
        { status: 'Express shipper parcel processed & dispatched', location: 'Supplier Distribution Point', date: new Date(Date.now() - 3600000 * 30).toLocaleDateString() + ' 09:12 AM', condition: true }
      ].filter(u => u.condition);

  return (
    <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 md:p-10 space-y-8 mt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
         <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2.5 bg-black hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer border border-white/5">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black font-sans mb-1">Active Tracker</p>
              <h2 className="text-2xl font-black font-display text-white">{orderId}</h2>
            </div>
         </div>
         <div className="flex flex-wrap gap-4 md:text-right">
            <div className="mb-2">
              <p className="text-gray-500 text-[10px] mb-1 uppercase tracking-widest font-bold font-sans">Estimated Delivery</p>
              <p className="text-sm font-bold text-white flex items-center md:justify-end gap-2 text-[#50C878]">
                <Clock className="w-3.5 h-3.5 animate-pulse" /> {estDelivery}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-[10px] mb-1 uppercase tracking-widest font-bold font-sans">Tracking Code</p>
              <p className="text-sm font-mono font-bold text-[#D4AF37]">{trackingNum}</p>
            </div>
         </div>
      </div>

      {isCancelled && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 mb-8 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-500 font-bold text-sm uppercase tracking-wider">Order Cancelled by Aura Store</h3>
            <p className="text-gray-300 text-xs mt-1 leading-relaxed">
              This order has been cancelled by the administrator due to: <strong className="text-white">"{localOrder?.cancelReason || 'Inventory Issues'}"</strong>. 
            </p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="relative mb-16 mt-8 p-4">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-[#0A0A0A] -translate-y-1/2 rounded-full overflow-hidden">
          <motion.div 
             className={`h-full ${isCancelled ? 'bg-red-500' : 'bg-[#D4AF37]'}`}
             initial={{ width: '0%' }}
             animate={{ width: isCancelled ? '100%' : isCompleted ? '100%' : isOut ? '75%' : isShipped ? '50%' : '12.5%' }}
             transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </div>
        <div className="relative flex justify-between z-10">
          {steps.map((step, i) => (
             <div key={i} className="flex flex-col items-center gap-2 bg-[#141414] px-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${step.active ? (isCancelled ? 'bg-red-500 border-red-500 text-white' : `bg-[#D4AF37] border-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]`) : 'bg-[#0A0A0A] border-gray-700 text-gray-500'}`}
                     style={step.active && !isCancelled ? { backgroundColor: settings.themeColor || '#D4AF37', borderColor: settings.themeColor || '#D4AF37' } : {}}>
                   {step.icon}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-tighter sm:tracking-wider ${step.active ? (isCancelled ? 'text-red-500' : 'text-white') : 'text-gray-500'}`}>{step.label}</span>
             </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
         {/* Tracking Updates */}
         <div className="relative">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              Logistics Journey
              <span className="w-2 h-2 bg-[#50C878] rounded-full animate-ping" />
            </h3>
            
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#D4AF37] before:via-white/10 before:to-transparent">
              {trackingUpdates.map((update, i) => (
                 <div key={i} className="relative flex items-start gap-4">
                    <div className={`mt-1 flex items-center justify-center w-6 h-6 rounded-full border-4 border-[#141414] shrink-0 z-10 ${i === 0 ? 'bg-[#D4AF37] border-[#D4AF37] scale-110 shadow-[0_0_10px_rgba(212,175,55,0.5)]' : 'bg-[#0A0A0A] border-gray-800'}`} />
                    <div className="flex-1 bg-[#0A0A0A]/50 border border-white/5 p-4 rounded-xl hover:border-white/10 transition-colors">
                       <p className={`font-bold text-sm mb-1 ${i === 0 ? 'text-white' : 'text-gray-300'}`}>{update.status}</p>
                       <p className="text-[10px] text-gray-500 font-mono mb-2">{update.date}</p>
                       <p className="text-[10px] text-[#D4AF37] flex items-center gap-1 uppercase tracking-widest font-bold opacity-80 font-sans">
                         <MapPin className="w-3 h-3"/> {update.location}
                       </p>
                    </div>
                 </div>
              ))}
            </div>
         </div>

         {/* Order Details & Summary */}
         <div className="space-y-6">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Delivery Destination Details</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1 font-sans">Shipping Address</h4>
                    <p className="text-sm text-gray-300 font-sans">
                      {localOrder?.customerName || 'Demo Customer'}<br />
                      {localOrder?.shipping_address?.line1 || '123 Luxury Ave'}<br />
                      {localOrder?.shipping_address?.line2 && <>{localOrder?.shipping_address?.line2}<br /></>}
                      {localOrder?.shipping_address?.city || 'Los Angeles'}, {localOrder?.shipping_address?.state || 'California'} {localOrder?.shipping_address?.zip || '90001'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t border-white/5">
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1 font-sans">Premium Express Dispatcher</h4>
                    <p className="text-sm text-gray-300 font-sans">{localOrder?.supplier || 'Premium Courier Core'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
               <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Package Contents</h3>
               {localOrder?.items && localOrder.items.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {localOrder.items.map((item: any, i: number) => (
                      <div key={i} className="flex gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <img src={item.imageUrl || item.images?.[0]} alt={item.title} className="w-14 h-14 rounded-lg object-cover border border-white/10 shrink-0" />
                        <div className="flex-1">
                           <p className="text-sm text-white font-medium line-clamp-1">{item.title}</p>
                           <p className="text-xs text-gray-500 mt-1">Quantity: {item.cartQuantity || item.quantity || 1}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-bold text-[#D4AF37]">${((item.price || item.finalPrice || 0) * (item.cartQuantity || item.quantity || 1)).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               ) : (
                  <div className="mb-6 p-8 border border-dashed border-white/10 rounded-xl text-center">
                    <Package className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Order contents loaded via API proxy</p>
                  </div>
               )}
               
               <div className="space-y-2 border-t border-white/10 pt-6">
                  <div className="flex justify-between text-base font-bold text-[#D4AF37] pt-2 mt-2">
                    <span>Grand Total</span>
                    <span>${localOrder ? localOrder.total.toFixed(2) : '---'}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
