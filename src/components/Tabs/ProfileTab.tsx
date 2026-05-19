import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Package, User as UserIcon, MapPin, Truck, CheckCircle2, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cjApi } from '../../lib/cj-api';

export function ProfileTab() {
  const { user, orders, settings, setUser, setActiveTab } = useStore();
  const [activeSection, setActiveSection] = useState<'profile' | 'orders'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  
  // Guest Tracking State
  const [trackId, setTrackId] = useState('');
  const [trackEmail, setTrackEmail] = useState('');
  const [trackError, setTrackError] = useState('');

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
          // Found tracking on CJ, but we don't have local order. Create a mock one to view.
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
                style={{ '--tw-ring-color': settings.themeColor } as any}
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
              className="w-full py-4 text-black font-bold uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg, ${settings.themeColor}, #FFF)` }}
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
            className="px-10 py-4 bg-transparent border border-white/20 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-colors"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  // Filter orders
  const myOrders = orders.filter(o => o.email === user.email || !user.storeName);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 mb-4 text-center">
            <div className="w-20 h-20 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full mx-auto flex items-center justify-center mb-4 text-2xl font-bold border border-[#D4AF37]/30">
              {user.name.charAt(0)}
            </div>
            <h3 className="text-lg font-bold text-white">{user.name}</h3>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>

          <button 
            onClick={() => { setActiveSection('orders'); setSelectedOrder(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-colors ${activeSection === 'orders' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <Package className="w-4 h-4" /> My Orders
          </button>
          <button 
             onClick={() => setActiveSection('profile')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-colors ${activeSection === 'profile' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <UserIcon className="w-4 h-4" /> Personal Details
          </button>
          
          <button 
             onClick={() => {
               setUser(null);
               setActiveTab('home');
             }}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm text-red-400 hover:bg-red-400/10 transition-colors mt-8"
          >
            Sign Out
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeSection === 'profile' && (
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 md:p-10 space-y-8">
              <div>
                <h2 className="text-2xl font-bold font-display text-white mb-2">Personal Details</h2>
                <p className="text-gray-400">Manage your account information.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block font-bold">Full Name</label>
                  <input type="text" defaultValue={user.name} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block font-bold">Email Address</label>
                  <input type="email" defaultValue={user.email} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37]" disabled />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block font-bold">Phone Number</label>
                  <input type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37]" />
                </div>
              </div>
              
              <button className="px-8 py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all">
                Save Changes
              </button>
            </div>
          )}

          {activeSection === 'orders' && !selectedOrder && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-display text-white mb-2">My Orders</h2>
                <p className="text-gray-400">View and track all your recent purchases.</p>
              </div>

              {myOrders.length === 0 ? (
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-10 text-center flex flex-col items-center">
                  <Package className="w-12 h-12 text-gray-600 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">No orders found</h3>
                  <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                  <button 
                     onClick={() => setActiveTab('shop')}
                     className="px-6 py-3 border border-[#D4AF37] text-[#D4AF37] font-bold rounded-lg hover:bg-[#D4AF37]/10 transition-colors"
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
                           <span className="text-lg font-bold text-white font-mono">{order.id}</span>
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              order.status === 'Completed' || order.status === 'Delivered' ? 'bg-[#50C878]/10 text-[#50C878] border border-[#50C878]/20' : 
                              order.status === 'Out for Delivery' ? 'bg-[#FF6A00]/10 text-[#FF6A00] border border-[#FF6A00]/20' : 
                              order.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                              'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                           }`}>
                             {order.status}
                           </span>
                        </div>
                        <p className="text-gray-400 text-sm">Placed on {order.date}</p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Total</p>
                          <p className="text-xl font-bold font-mono text-[#D4AF37]">${order.total.toFixed(2)}</p>
                        </div>
                        <button 
                           onClick={() => setSelectedOrder(order.id)}
                           className="px-6 py-3 bg-[#0A0A0A] border border-white/10 text-white font-bold rounded-lg hover:border-white/30 transition-colors flex items-center gap-2"
                        >
                           Track <Truck className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'orders' && selectedOrder && (
            <OrderTracker orderId={selectedOrder} onBack={() => setSelectedOrder(null)} />
          )}

        </div>
      </div>
    </div>
  );
}

function OrderTracker({ orderId, onBack }: { orderId: string, onBack: () => void }) {
  const { orders, settings } = useStore();
  const [liveData, setLiveData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Find local order if exists
  const localOrder = orders.find(o => o.id === orderId);

  useEffect(() => {
    async function fetchTracking() {
      if (settings.cjConnected && settings.cjAccessToken) {
        setIsLoading(true);
        setError('');
        try {
          // In real app, we'd use the stored access token
          cjApi.accessToken = settings.cjAccessToken;
          const data = await cjApi.getTracking(orderId);
          if (data) {
            setLiveData(data);
          }
        } catch (err: any) {
          console.error("Live tracking fetch failed:", err);
          // If we have local order, we'll just show that. If not, show error.
          if (!localOrder) {
            setError("Could not retrieve live tracking data. Please try again later.");
          }
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchTracking();
  }, [orderId, settings.cjConnected, settings.cjApiKey, localOrder]);

  if (!localOrder && !liveData && !isLoading && !error) return null;

  const currentStatus = liveData?.status || localOrder?.status || 'Processing';
  const trackingNum = liveData?.trackingNumber || localOrder?.trackingNumber || 'AURA-TRAK-983021';
  const estDelivery = liveData?.estimatedDelivery || localOrder?.estimatedDelivery || '12-15 Business Days';
  
  const isCompleted = currentStatus === 'Completed' || currentStatus === 'Delivered';
  const isShipped = isCompleted || currentStatus === 'Shipped' || currentStatus === 'Out for Delivery';
  const isOut = isCompleted || currentStatus === 'Out for Delivery';

  const steps = [
    { label: 'Processing', active: true, done: isShipped, icon: <Package className="w-5 h-5" /> },
    { label: 'Shipped', active: isShipped, done: isOut, icon: <Truck className="w-5 h-5" /> },
    { label: 'Out for Delivery', active: isOut, done: isCompleted, icon: <MapPin className="w-5 h-5" /> },
    { label: 'Delivered', active: isCompleted, done: isCompleted, icon: <CheckCircle2 className="w-5 h-5" /> }
  ];

  // Default updates if none exist
  const defaultUpdates = [
    { date: 'Today, 8:45 AM', status: 'Out for delivery', location: 'Local Distribution Center' },
    { date: 'Yesterday, 10:20 PM', status: 'Arrived at sorting facility', location: 'Regional Hub' },
    { date: 'Yesterday, 8:00 AM', status: 'Package shipped', location: 'Fulfillment Center' },
    { date: localOrder?.date || '2 days ago', status: 'Order processed', location: 'Aura Commerce' }
  ];

  const trackingUpdates = liveData?.trackingUpdates || localOrder?.trackingUpdates || defaultUpdates;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#141414] border border-white/5 rounded-2xl p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-gray-400 hover:text-white text-sm flex items-center gap-2">
          ← Back
        </button>
        {isLoading && (
          <div className="flex items-center gap-2 text-[#D4AF37] text-sm font-bold animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin" /> Fetching Live Status...
          </div>
        )}
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl text-center mb-8">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <p className="text-white font-bold mb-2">{error}</p>
          <button onClick={() => window.location.reload()} className="text-sm text-gray-400 underline hover:text-white">Try reloading page</button>
        </div>
      ) : null}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
         <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold font-display text-white">Order {orderId}</h2>
              {liveData && <span className="bg-[#50C878]/10 text-[#50C878] text-[8px] px-1.5 py-0.5 rounded border border-[#50C878]/20 font-bold uppercase tracking-widest">Live</span>}
            </div>
            <p className="text-gray-400 text-sm">Placed on {localOrder?.date || 'External Order'}</p>
         </div>
         <div className="grid grid-cols-2 md:block md:text-right gap-4">
            <div className="mb-4">
              <p className="text-gray-500 text-[10px] mb-1 uppercase tracking-widest font-bold">Estimated Delivery</p>
              <p className="text-sm font-bold text-white flex items-center md:justify-end gap-2 text-[#50C878]">
                <Clock className="w-3.5 h-3.5" /> {estDelivery}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-[10px] mb-1 uppercase tracking-widest font-bold">Tracking Number</p>
              <p className="text-lg font-mono font-bold text-[#D4AF37]">{trackingNum}</p>
            </div>
         </div>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-16 mt-8">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-[#0A0A0A] -translate-y-1/2 rounded-full overflow-hidden">
          <motion.div 
             className="h-full bg-gradient-to-r from-transparent to-[#D4AF37]"
             initial={{ width: '0%' }}
             animate={{ width: isCompleted ? '100%' : isOut ? '75%' : isShipped ? '50%' : '12.5%' }}
             transition={{ duration: 1.5, ease: 'easeOut' }}
             style={{ backgroundColor: settings.themeColor }}
          />
        </div>
        <div className="relative flex justify-between z-10">
          {steps.map((step, i) => (
             <div key={i} className="flex flex-col items-center gap-2 bg-[#141414] px-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${step.active ? `bg-[#D4AF37] border-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]` : 'bg-[#0A0A0A] border-gray-700 text-gray-500'}`}
                     style={step.active ? { backgroundColor: settings.themeColor, borderColor: settings.themeColor, boxShadow: `0 0 15px ${settings.themeColor}60` } : {}}>
                   {step.icon}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-tighter sm:tracking-wider ${step.active ? 'text-white' : 'text-gray-500'}`}>{step.label}</span>
             </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
         {/* Tracking Updates */}
         <div className="relative">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              Tracking Journey
              <span className="w-2 h-2 bg-[#50C878] rounded-full animate-ping" />
            </h3>
            
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#D4AF37] before:via-white/10 before:to-transparent">
              {trackingUpdates.map((update, i) => (
                 <div key={i} className="relative flex items-start gap-4">
                    <div className={`mt-1 flex items-center justify-center w-6 h-6 rounded-full border-4 border-[#141414] shrink-0 z-10 ${i === 0 ? 'bg-[#D4AF37] border-[#D4AF37] scale-110 shadow-[0_0_10px_rgba(212,175,55,0.5)]' : 'bg-[#0A0A0A] border-gray-800'}`} 
                         style={i === 0 ? { backgroundColor: settings.themeColor, borderColor: settings.themeColor } : {}} />
                    <div className="flex-1 bg-[#0A0A0A]/50 border border-white/5 p-4 rounded-xl hover:border-white/10 transition-colors">
                       <p className={`font-bold text-sm mb-1 ${i === 0 ? 'text-white' : 'text-gray-300'}`}>{update.status}</p>
                       <p className="text-[10px] text-gray-500 font-mono mb-2">{update.date}</p>
                       <p className="text-[10px] text-[#D4AF37] flex items-center gap-1 uppercase tracking-widest font-bold opacity-80">
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
              <h3 className="text-lg font-bold text-white mb-6">Delivery Details</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Shipping Address</h4>
                    <p className="text-sm text-gray-300">
                      {localOrder?.customerName || 'Customer'}<br />
                      123 Premium Lane, Suite 400<br />
                      Beverly Hills, CA 90210
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t border-white/5">
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Courier Service</h4>
                    <p className="text-sm text-gray-300">Global Express Logistics (CJ)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
               <h3 className="text-lg font-bold text-white mb-6">Package Contents</h3>
               {localOrder?.items && localOrder.items.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {localOrder.items.map((item, i) => (
                      <div key={i} className="flex gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <img src={item.imageUrl || item.images?.[0]} alt={item.title} className="w-14 h-14 rounded-lg object-cover border border-white/10" />
                        <div className="flex-1">
                           <p className="text-sm text-white font-medium line-clamp-1">{item.title}</p>
                           <p className="text-xs text-gray-500 mt-1">Quantity: {item.cartQuantity}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-bold text-[#D4AF37]">${((item.price || item.finalPrice || 0) * item.cartQuantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               ) : (
                  <div className="mb-6 p-8 border border-dashed border-white/10 rounded-xl text-center">
                    <Package className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Order contents synchronized via API</p>
                  </div>
               )}
               
               <div className="space-y-2 border-t border-white/10 pt-6">
                 <div className="flex justify-between text-sm text-gray-400">
                   <span>Order Subtotal</span>
                   <span>${localOrder ? (localOrder.total * 0.9).toFixed(2) : '---'}</span>
                 </div>
                 <div className="flex justify-between text-base font-bold text-[#D4AF37] pt-2 border-t border-white/10 mt-2">
                   <span>Grand Total</span>
                   <span>${localOrder ? localOrder.total.toFixed(2) : '---'}</span>
                 </div>
               </div>
            </div>
         </div>
      </div>
    </motion.div>
  );
}
