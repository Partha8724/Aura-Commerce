import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, CreditCard } from 'lucide-react';
import { useStore } from '../store/useStore';
import confetti from 'canvas-confetti';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { supabase } from '../lib/supabase';

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, removeFromCart, updateCartQuantity, clearCart, addOrder, addStats, placeOrderAndFulfillToCJ, user } = useStore();
  const [checkoutStep, setCheckoutStep] = useState(0); // 0: cart, 1: details, 2: processing, 3: success
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    cc: ''
  });
  const [paymentType, setPaymentType] = useState('card');
  const [checkoutTotal, setCheckoutTotal] = useState(0);

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  useEffect(() => {
    if (user && isOpen) {
      // Set initial profile values
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }));

      // Fetch saved addresses
      const fetchAddresses = async () => {
        try {
          const { data, error } = await supabase
            .from('customer_addresses')
            .select('*')
            .eq('user_id', user.id);
          
          if (data && data.length > 0) {
            setSavedAddresses(data);
            // Check for default
            const def = data.find(a => a.is_default) || data[0];
            if (def) {
              setSelectedAddressId(def.id);
              setFormData(prev => ({
                ...prev,
                addressLine1: def.address_line1 || '',
                addressLine2: def.address_line2 || '',
                city: def.city || '',
                state: def.state || '',
                zip: def.zip_code || '',
                country: def.country || 'US'
              }));
            }
          } else {
            // Local storage fallback
            const local = JSON.parse(localStorage.getItem(`aura_addresses_${user.id}`) || '[]');
            if (local && local.length > 0) {
              setSavedAddresses(local);
              const def = local.find((a: any) => a.is_default) || local[0];
              if (def) {
                setSelectedAddressId(def.id);
                setFormData(prev => ({
                  ...prev,
                  addressLine1: def.address_line1 || '',
                  addressLine2: def.address_line2 || '',
                  city: def.city || '',
                  state: def.state || '',
                  zip: def.zip_code || '',
                  country: def.country || 'US'
                }));
              }
            }
          }
        } catch (e) {
          console.warn('Sync address load error inside cart checkout:', e);
        }
      };

      fetchAddresses();
    }
  }, [user, isOpen]);

  const handleSelectSavedAddress = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const addrId = e.target.value;
    setSelectedAddressId(addrId);
    if (!addrId) return;

    const selected = savedAddresses.find(a => a.id === addrId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        name: selected.full_name || prev.name,
        phone: selected.phone || prev.phone,
        addressLine1: selected.address_line1 || '',
        addressLine2: selected.address_line2 || '',
        city: selected.city || '',
        state: selected.state || '',
        zip: selected.zip_code || '',
        country: selected.country || 'US'
      }));
    }
  };

  if (!isOpen) return null;

  const totalItems = cart.reduce((acc, item) => acc + item.cartQuantity, 0);
  const totalCost = cart.reduce((acc, item) => acc + ((item.finalPrice || item.price || 0) * item.cartQuantity), 0);
  const totalCommission = cart.reduce((acc, item) => acc + ((item.commission || 0) * item.cartQuantity), 0);

  const handleCheckout = () => {
    setCheckoutStep(1);
  };

  const handlePaySuccess = () => {
    setCheckoutStep(2);
    
    // Simulate payment processing UI briefly even though payment is done
    setTimeout(async () => {
      const payload = {
        customerName: formData.name || 'Customer',
        email: formData.email || 'customer@example.com',
        phone: formData.phone || '555-0100',
        shipping_address: {
          line1: formData.addressLine1 || '123 Luxury Ave',
          line2: formData.addressLine2 || '',
          city: formData.city || 'Los Angeles',
          state: formData.state || 'California',
          zip: formData.zip || '90001',
          country: formData.country || 'US'
        },
        items: [...cart],
        total: totalCost,
        total_commission: totalCommission,
        paymentMethod: 'PayPal',
        payment_status: 'paid'
      };

      setCheckoutTotal(totalCost);
      const res = await placeOrderAndFulfillToCJ(payload);
      if (res.success) {
        setCheckoutStep(3);
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
        clearCart();
      } else {
        setCheckoutStep(0);
        alert(`Order placement issue: ${res.error || 'Please verify form details'}`);
      }
    }, 1000);
  };

  const handlePay = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCheckoutStep(2);
    
    // Simulate payment processing
    setTimeout(async () => {
      const payload = {
        customerName: formData.name || 'Demo Customer',
        email: formData.email || 'demo@example.com',
        phone: formData.phone || '555-0100',
        shipping_address: {
          line1: formData.addressLine1 || '123 Luxury Ave',
          line2: formData.addressLine2 || '',
          city: formData.city || 'Los Angeles',
          state: formData.state || 'California',
          zip: formData.zip || '90001',
          country: formData.country || 'US'
        },
        items: [...cart],
        total: totalCost,
        total_commission: totalCommission,
        paymentMethod: paymentType === 'cod' ? 'Cash on Delivery (COD)' : 'Credit Card',
        payment_status: paymentType === 'cod' ? 'pending' : 'paid'
      };

      setCheckoutTotal(totalCost);
      const res = await placeOrderAndFulfillToCJ(payload);
      if (res.success) {
        setCheckoutStep(3);
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
        clearCart();
      } else {
        setCheckoutStep(0);
        alert(`Order placement issue: ${res.error || 'Please verify form details'}`);
      }
    }, 2000);
  };

  const closeCart = () => {
    onClose();
    setTimeout(() => setCheckoutStep(0), 300); // reset after slide animation
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeCart} />
      <div className="relative w-full max-w-md bg-[#141414] h-full border-l border-[#D4AF37]/20 shadow-2xl flex flex-col transform transition-transform">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0A0A0A]">
          <h2 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2 text-[#D4AF37]">
            {checkoutStep === 0 ? 'Your Cart' : checkoutStep === 3 ? 'Order Confirmed' : 'Checkout'}
          </h2>
          <button onClick={closeCart} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {checkoutStep === 0 && (
            cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                 <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                 <p className="uppercase tracking-widest text-sm">Cart is empty</p>
                 <button onClick={closeCart} className="mt-8 text-[#D4AF37] border-b border-[#D4AF37] hover:text-[#F4D03F] transition-colors">BROWSE CATALOG</button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex gap-4">
                    <div className="w-20 h-20 bg-black rounded-lg overflow-hidden border border-[#D4AF37]/20 shrink-0">
                      <img src={item.images?.[0] || item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h3 className="font-bold text-sm line-clamp-2 text-white">{item.title}</h3>
                      <div className="flex justify-between items-end mt-auto">
                        <div className="flex items-center gap-2 bg-black rounded p-1 border border-white/10">
                          <button onClick={() => updateCartQuantity(item.id, item.cartQuantity - 1)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white">-</button>
                          <span className="text-xs w-4 text-center text-white">{item.cartQuantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, item.cartQuantity + 1)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white">+</button>
                        </div>
                        <div className="text-right">
                           <div className="font-mono text-white font-bold">${((item.finalPrice || item.price || 0) * item.cartQuantity).toFixed(2)}</div>
                           <button onClick={() => removeFromCart(item.id)} className="text-red-400/70 text-[10px] uppercase tracking-widest hover:text-red-400">Remove</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {checkoutStep === 1 && (
            <div className="space-y-6">
               <form id="checkout-form" onSubmit={(e) => handlePay(e)}>
                 <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-4">Customer Info & Shipping</h3>
                 
                 {user && savedAddresses.length > 0 && (
                   <div className="mb-4">
                     <label className="text-[10px] text-[#D4AF37] uppercase tracking-wider block mb-1 font-bold font-sans">Use Saved Address</label>
                     <select
                       value={selectedAddressId}
                       onChange={handleSelectSavedAddress}
                       className="w-full bg-[#0A0A0A] border border-[#D4AF37]/40 rounded p-3 text-sm text-white focus:border-[#D4AF37] outline-none transition-all font-sans"
                     >
                       <option value="">-- Choose saved destination --</option>
                       {savedAddresses.map((addr) => (
                         <option key={addr.id} value={addr.id}>
                           {addr.label} &mdash; {addr.full_name} ({addr.city}, {addr.state})
                         </option>
                       ))}
                     </select>
                   </div>
                 )}

                 <input required placeholder="Full Name" value={formData.name} className="w-full bg-[#0A0A0A] border border-[#D4AF37]/20 rounded p-3 text-sm mb-3 text-white focus:border-[#D4AF37] outline-none transition-colors" onChange={e => setFormData({...formData, name: e.target.value})} />
                 <input required type="email" placeholder="Email Address" value={formData.email} className="w-full bg-[#0A0A0A] border border-[#D4AF37]/20 rounded p-3 text-sm mb-3 text-white focus:border-[#D4AF37] outline-none transition-colors" onChange={e => setFormData({...formData, email: e.target.value})} />
                 <input required placeholder="Phone Number" value={formData.phone} className="w-full bg-[#0A0A0A] border border-[#D4AF37]/20 rounded p-3 text-sm mb-3 text-white focus:border-[#D4AF37] outline-none transition-colors" onChange={e => setFormData({...formData, phone: e.target.value})} />
                 <input required placeholder="Address Line 1" value={formData.addressLine1} className="w-full bg-[#0A0A0A] border border-[#D4AF37]/20 rounded p-3 text-sm mb-3 text-white focus:border-[#D4AF37] outline-none transition-colors" onChange={e => setFormData({...formData, addressLine1: e.target.value})} />
                 <input placeholder="Address Line 2 (Optional)" value={formData.addressLine2} className="w-full bg-[#0A0A0A] border border-[#D4AF37]/20 rounded p-3 text-sm mb-3 text-white focus:border-[#D4AF37] outline-none transition-colors" onChange={e => setFormData({...formData, addressLine2: e.target.value})} />
                 <div className="grid grid-cols-2 gap-3 mb-3">
                   <input required placeholder="City" value={formData.city} className="w-full bg-[#0A0A0A] border border-[#D4AF37]/20 rounded p-3 text-sm text-white focus:border-[#D4AF37] outline-none transition-colors" onChange={e => setFormData({...formData, city: e.target.value})} />
                   <input required placeholder="State" value={formData.state} className="w-full bg-[#0A0A0A] border border-[#D4AF37]/20 rounded p-3 text-sm text-white focus:border-[#D4AF37] outline-none transition-colors" onChange={e => setFormData({...formData, state: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-3 mb-3">
                   <input required placeholder="ZIP Code" value={formData.zip} className="w-full bg-[#0A0A0A] border border-[#D4AF37]/20 rounded p-3 text-sm text-white focus:border-[#D4AF37] outline-none transition-colors" onChange={e => setFormData({...formData, zip: e.target.value})} />
                   <input required placeholder="Country" value={formData.country} className="w-full bg-[#0A0A0A] border border-[#D4AF37]/20 rounded p-3 text-sm text-white focus:border-[#D4AF37] outline-none transition-colors" onChange={e => setFormData({...formData, country: e.target.value})} />
                 </div>
               </form>
               
               <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-4 mt-6">Express Checkout</h3>
                  <PayPalScriptProvider options={{ clientId: "test", currency: "USD" }}>
                      <div className="relative z-0">
                        <PayPalButtons 
                           style={{ layout: "vertical", color: "gold", shape: "rect", label: "paypal" }}
                           createOrder={(data, actions) => {
                               return actions.order.create({
                                   intent: "CAPTURE",
                                   purchase_units: [
                                       {
                                           amount: {
                                               currency_code: "USD",
                                               value: totalCost.toFixed(2),
                                           },
                                       },
                                   ],
                               });
                           }}
                           onApprove={(data, actions) => {
                               return actions.order!.capture().then((details) => {
                                   handlePaySuccess();
                               });
                           }}
                        />
                      </div>
                  </PayPalScriptProvider>
                  
                  <div className="text-center text-xs text-gray-500 my-4 uppercase tracking-widest">OR</div>
                  
                  {/* CC Input Simulator */}
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4 space-y-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2"><CreditCard className="w-4 h-4 text-[#D4AF37]" /> Credit Card (Demo)</div>
                    <input placeholder="Card Number" className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white focus:border-[#D4AF37] outline-none transition-colors" />
                    <div className="flex gap-4">
                      <input placeholder="MM/YY" className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white focus:border-[#D4AF37] outline-none transition-colors" />
                      <input placeholder="CVV" className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white focus:border-[#D4AF37] outline-none transition-colors" />
                    </div>
                  </div>
               </div>
            </div>
          )}

          {checkoutStep === 2 && (
            <div className="h-full flex flex-col items-center justify-center space-y-6">
              <div className="w-16 h-16 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
              <div className="text-lg font-bold text-[#D4AF37] font-mono animate-pulse">PROCESSING...</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">Securing Connection</div>
            </div>
          )}

          {checkoutStep === 3 && (
            <div className="h-full flex flex-col items-center justify-center text-center">
               <div className="w-20 h-20 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                 <div className="w-10 h-10 border-4 border-[#D4AF37] rounded-full flex items-center justify-center">
                   <div className="w-2 h-4 border-r-4 border-b-4 border-[#D4AF37] rotate-45 -translate-y-1" />
                 </div>
               </div>
               <h3 className="text-2xl font-bold font-display mb-2 text-white">Order Confirmed!</h3>
               <p className="text-gray-400 text-sm mb-8">
                 {paymentType === 'cod' ? 'Your order has been placed. You will pay upon delivery.' : 'Payment successful. Automated dropshipping rules triggered.'}
               </p>
               
               <div className="bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-xl p-6 w-full text-left space-y-4 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                 <div className="flex justify-between border-b border-white/10 pb-4">
                   <span className="text-gray-400 text-sm">{paymentType === 'cod' ? 'Total to Pay on Delivery' : 'Total Paid'}</span>
                   <span className="font-bold text-white font-mono">${checkoutTotal.toFixed(2)}</span>
                 </div>
               </div>

               <button onClick={closeCart} className="mt-8 gold-gradient text-black px-8 py-4 font-bold uppercase tracking-widest text-xs rounded-full hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all">
                 Continue Shopping
               </button>
            </div>
          )}
        </div>
        
        {checkoutStep === 0 && cart.length > 0 && (
          <div className="p-6 border-t border-white/5 bg-[#0A0A0A] space-y-4">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Total Items</span>
              <span className="font-mono">{totalItems}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-white border-t border-white/10 pt-4">
              <span>Total</span>
              <span className="font-mono text-[#D4AF37]">${totalCost.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} className="w-full py-4 gold-gradient text-black font-bold uppercase tracking-widest text-sm rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all">
              Proceed to Checkout
            </button>
          </div>
        )}

        {checkoutStep === 1 && (
           <div className="p-6 border-t border-white/5 bg-[#0A0A0A] space-y-3">
            <button type="submit" form="checkout-form" onClick={() => setPaymentType('card')} className="w-full py-4 bg-transparent border border-[#D4AF37] text-[#D4AF37] font-bold uppercase tracking-widest text-sm hover:bg-[#D4AF37] hover:text-black transition-colors rounded-lg">
              Card Checkout - ${totalCost.toFixed(2)}
            </button>
            <button type="submit" form="checkout-form" onClick={() => setPaymentType('cod')} className="w-full py-4 bg-[#2A2A2A] border border-white/10 text-white font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-colors rounded-lg">
              Cash on Delivery (COD)
            </button>
           </div>
        )}
      </div>
    </div>
  );
}
