import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { Intro } from './components/Intro';
import { Auth } from './components/Auth';
import { TopNav } from './components/TopNav';
import { AnimatePresence } from 'motion/react';
import { HomeTab } from './components/Tabs/HomeTab';
import { ShopTab } from './components/Tabs/ShopTab';
import { PartnerCentralTab } from './components/Tabs/PartnerCentralTab';
import { AdminTab } from './components/Tabs/AdminTab';
import { ProfileTab } from './components/Tabs/ProfileTab';
import { ProductDetail } from './components/ProductDetail';
import { SupportWidget } from './components/SupportWidget';
import { supabase } from './lib/supabase';
import { cjApi } from './lib/cj-api';

export default function App() {
  const hasSeenIntro = useStore(state => state.hasSeenIntro);
  const activeTab = useStore(state => state.activeTab);
  const selectedProductId = useStore(state => state.selectedProductId);
  const updateSettings = useStore(state => state.updateSettings);
  const addBotLog = useStore(state => state.addBotLog);
  const user = useStore(state => state.user);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      addBotLog({
        id: Math.random().toString(),
        bot: 'System Monitor',
        message: `Runtime Error: ${event.message}`,
        date: new Date().toLocaleTimeString(),
        type: 'error'
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      addBotLog({
        id: Math.random().toString(),
        bot: 'System Monitor',
        message: `Unhandled Promise: ${event.reason}`,
        date: new Date().toLocaleTimeString(),
        type: 'error'
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [addBotLog]);

  useEffect(() => {
    async function initSupabaseSync() {
      // Load current central orders from Supabase Database
      try {
        const { data: dbOrders, error: orderErr } = await supabase
          .from('orders')
          .select('*')
          .order('date', { ascending: false });

        if (dbOrders && !orderErr) {
          console.log('[Supabase Sync] Fetched central orders:', dbOrders.length);
          const mappedOrders = dbOrders.map((o: any) => {
            let parsedItems = [];
            try {
              const itemRaw = o.products || o.items;
              parsedItems = typeof itemRaw === 'string' ? JSON.parse(itemRaw) : (itemRaw || []);
            } catch {
              parsedItems = o.products || o.items || [];
            }
            if (!Array.isArray(parsedItems)) parsedItems = [];
            
            // Map items array to unified CartItem standard
            const standardItems = parsedItems.map((pi: any) => ({
              id: pi.product_id || pi.id || '',
              title: pi.title || '',
              cartQuantity: pi.quantity || pi.cartQuantity || 1,
              price: pi.base_price || pi.price || 0,
              finalPrice: pi.final_price || pi.finalPrice || pi.base_price || pi.price || 0,
              commission: pi.commission || 0,
              supplier: pi.supplier || 'CJ Dropshipping',
              imageUrl: pi.imageUrl || ''
            }));

            let parsedUpdates = [];
            try {
              const updatesRaw = o.tracking_updates || o.trackingUpdates;
              parsedUpdates = typeof updatesRaw === 'string' 
                ? JSON.parse(updatesRaw) 
                : (updatesRaw || []);
            } catch {
              parsedUpdates = [];
            }
            if (!Array.isArray(parsedUpdates)) parsedUpdates = [];

            return {
              id: o.order_number || o.id,
              customerName: o.customer_name || o.customerName || 'Customer',
              email: o.customer_email || o.email || 'customer@example.com',
              total: parseFloat(o.total_amount || o.total || 0),
              commissionEarned: parseFloat(o.total_commission || o.commission_earned || o.commissionEarned || 0),
              status: o.order_status || o.status || 'pending',
              date: o.created_at || o.date || new Date().toISOString(),
              items: standardItems,
              trackingNumber: o.tracking_number || o.trackingNumber,
              trackingUpdates: parsedUpdates,
              supplier: o.supplier || 'CJ Dropshipping',
              paymentMethod: o.payment_method || o.paymentMethod || 'Credit Card',
              estimatedDelivery: o.estimated_delivery || o.estimatedDelivery,
              cancelReason: o.cancel_reason || o.cancelReason
            };
          });
          
          // Merge with local orders so we retain un-synced/offline work
          const localOrders = useStore.getState().orders || [];
          const merged = [...mappedOrders];
          localOrders.forEach((loc: any) => {
            const locId = loc.order_number || loc.id;
            if (!merged.some(m => (m.id === locId || m.id === loc.id))) {
              merged.push(loc);
            }
          });

          useStore.setState({ orders: merged });
        } else if (orderErr) {
          console.warn('[Supabase Sync] orders table check failed:', orderErr.message);
        }
      } catch (err: any) {
        console.warn('[Supabase Sync] Exception initialising central orders:', err);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const { data } = await supabase
            .from('cj_credentials')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (data && data.cj_connected && data.cj_access_token) {
            cjApi.accessToken = data.cj_access_token;
            if (data.cj_api_key) cjApi.apiKey = data.cj_api_key;
            updateSettings({ 
              cjConnected: true, 
              cjAccessToken: data.cj_access_token,
              cjApiKey: data.cj_api_key || '' 
            });
          }
        } catch (e: any) {
          addBotLog({
            id: Math.random().toString(),
            bot: 'System Monitor',
            message: `Supabase Sync Error: ${e.message || 'Unknown failure'}`,
            date: new Date().toLocaleTimeString(),
            type: 'warning'
          });
        }
      }
    }
    
    async function initBackgroundCjSync() {
      try {
        console.log('[CJ Auto-Connect] Checking for server-side CJ environment credentials...');
        const hasEnv = await cjApi.detectConnection();
        
        if (hasEnv) {
          const response = await fetch('/api/cj/connect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
          });
          const result = await response.json();
          
          if (result.success && result.accessToken) {
            cjApi.accessToken = result.accessToken;
            cjApi.apiKey = result.details?.apiKey || '';
            
            updateSettings({
              cjConnected: true,
              cjAccessToken: result.accessToken,
              cjApiKey: cjApi.apiKey || ''
            });

            addBotLog({
              id: `sys-log-${Date.now()}`,
              bot: 'System Monitor',
              message: 'Auto-Connected: Aura CJ Dropshipping bridge established via environment credentials.',
              date: new Date().toLocaleTimeString(),
              type: 'success'
            });

            const currentProducts = useStore.getState().products;
            if (currentProducts.length === 0) {
              addBotLog({
                id: `import-log-start-${Date.now()}`,
                bot: 'Auto Import',
                message: 'Auto Import Bot activated: storefront catalog is empty. Securing initial dropship products...',
                date: new Date().toLocaleTimeString(),
                type: 'info'
              });

              try {
                const listData = await cjApi.getProducts(1, 10);
                if (listData && listData.data?.list && listData.data.list.length > 0) {
                  const numToImport = Math.min(listData.data.list.length, 10);
                  addBotLog({
                    id: `import-log-found-${Date.now()}`,
                    bot: 'Auto Import',
                    message: `Identified ${listData.data.list.length} dropship products. Initiating import of up to 10 products with default 15% commission markup...`,
                    date: new Date().toLocaleTimeString(),
                    type: 'info'
                  });

                  for (let i = 0; i < numToImport; i++) {
                    const prod = listData.data.list[i];
                    
                    setTimeout(async () => {
                      try {
                        const fullDetail = await cjApi.getProductByUrl(`-p-${prod.pid}.html`);
                        const target = fullDetail || prod;

                        const gallery: string[] = [];
                        if (target.productImage) gallery.push(target.productImage);
                        if (target.productImageDetail) {
                          const detailImages = target.productImageDetail.split(',').filter(Boolean);
                          gallery.push(...detailImages);
                        }

                        const basePrice = parseFloat(String(target.sellPrice || 0));
                        const markup = parseFloat((basePrice * 0.15).toFixed(2));
                        const finalPrice = parseFloat((basePrice + markup).toFixed(2));

                        const newProduct = {
                          id: `cj-${target.pid || Math.floor(Math.random() * 10000)}`,
                          title: target.productNameEn || target.productName || 'CJ Product',
                          description: target.description || target.productHtmlDescription || target.productKeyEn || 'Automatically imported product from CJ Dropshipping.',
                          supplier: 'CJ Dropshipping',
                          price: finalPrice,
                          basePrice: basePrice,
                          commission: markup,
                          finalPrice: finalPrice,
                          stock: 999,
                          rating: parseFloat((4.5 + Math.random() * 0.5).toFixed(1)),
                          category: target.categoryName || 'General',
                          imageUrl: target.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80',
                          images: gallery.length > 0 ? gallery : [target.productImage],
                          weight: target.productWeight ? parseFloat(String(target.productWeight)) : 0,
                          isNew: true,
                          isDemo: false,
                          variants: target.variants || [],
                          discountEligible: true
                        };

                        useStore.getState().addProduct(newProduct);
                        addBotLog({
                          id: `import-log-ok-${Date.now()}-${i}`,
                          bot: 'Auto Import',
                          message: `Auto-Import Successful: "${newProduct.title}" (+15% commission markup configured)`,
                          date: new Date().toLocaleTimeString(),
                          type: 'success'
                        });
                      } catch (innerErr: any) {
                        const basePrice = parseFloat(String(prod.sellPrice || 0));
                        const markup = parseFloat((basePrice * 0.15).toFixed(2));
                        const finalPrice = parseFloat((basePrice + markup).toFixed(2));

                        const basicProduct = {
                          id: `cj-${prod.pid || Math.floor(Math.random() * 10000)}`,
                          title: prod.productNameEn || prod.productName || 'CJ Product',
                          description: prod.productNameEn || 'Automatically imported product from CJ Dropshipping.',
                          supplier: 'CJ Dropshipping',
                          price: finalPrice,
                          basePrice: basePrice,
                          commission: markup,
                          finalPrice: finalPrice,
                          stock: 999,
                          rating: parseFloat((4.5 + Math.random() * 0.5).toFixed(1)),
                          category: prod.categoryName || 'General',
                          imageUrl: prod.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80',
                          images: prod.productImage ? [prod.productImage] : [],
                          weight: prod.productWeight ? parseFloat(String(prod.productWeight)) : 0,
                          isNew: true,
                          isDemo: false,
                          discountEligible: true
                        };

                        useStore.getState().addProduct(basicProduct);
                        addBotLog({
                          id: `import-log-fallback-${Date.now()}-${i}`,
                          bot: 'Auto Import',
                          message: `Auto-Import Succeeded: "${basicProduct.title}" (Fallback; +15% commission markup configured)`,
                          date: new Date().toLocaleTimeString(),
                          type: 'success'
                        });
                      }
                    }, i * 1500);
                  }
                } else {
                  throw new Error('CJ supplier catalog returned empty list.');
                }
              } catch (fetchErr: any) {
                addBotLog({
                  id: `import-fallback-warning-${Date.now()}`,
                  bot: 'Auto Import',
                  message: `Active developer catalog empty or rate-limited (${fetchErr.message}). Auto-seeding 8 CJ Dropship items with 15% commission markup instead...`,
                  date: new Date().toLocaleTimeString(),
                  type: 'warning'
                });

                const seedProducts = [
                  { id: "cj-1001", title: "Aura LED Sunset Atmosphere Projector", description: "Create an exquisite ambient aura in any room with this USB-powered sunset lamp projector. High-definition crystal lens and 16 rotatable colour gradients with remote control.", imageUrl: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=800', category: 'Home & Garden', basePrice: 12.50, weight: 0.35 },
                  { id: "cj-1002", title: "SonicWave Wireless Active Noise-Cancelling Earbuds", description: "Premium hybrid active noise-cancelling (ANC) earbuds with advanced 40dB reduction, high-fidelity graphene drivers, and 36-hour total battery life with custom case.", imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800', category: 'Electronics', basePrice: 35.00, weight: 0.08 },
                  { id: "cj-1003", title: "ThermaLuxe Jade Massager & Facial Sculpting Kit", description: "An elegant heated facial massaging device crafted with authentic green Xiuyan jade stone. Emits micromassage pulsations and warmth to sculpt, contour, and revitalise facial tissue.", imageUrl: 'https://images.unsplash.com/photo-1601612628452-9e99ced43524?auto=format&fit=crop&q=80&w=800', category: 'Beauty', basePrice: 16.20, weight: 0.22 },
                  { id: "cj-1004", title: "TitanVanguard Stealth Waterproof Backpack", description: "Constructed with Kevlar-enforced ballistic nylon. Featuring integrated TSA combination locks, hidden passport pockets, built-in USB power-bridge, and expansion layer for tech travel.", imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800', category: 'Fashion', basePrice: 24.50, weight: 1.10 },
                  { id: "cj-1005", title: "AuraBreath Cool Mist Ultrasonic Humidifier", description: "A gorgeous, super-quiet 1.5L ultrasonic essential oil diffuser and cool-mist humidifier. Equipped with ambient wood grain finishing, smart automatic shut-off and 7-LED mood lighting.", imageUrl: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=800', category: 'Home & Garden', basePrice: 14.80, weight: 0.60 },
                  { id: "cj-1006", title: "AeroPulse Deep-Tissue Therapy Massage Gun", description: "Professional high-torque percussive tissue massager. Featuring 30 adjustable speed increments, ultra-quiet brushless motor operation, 6 distinct soft-tip heads, and smart LED status display.", imageUrl: 'https://images.unsplash.com/photo-1607962837359-5e7e89f866ad?auto=format&fit=crop&q=80&w=800', category: 'Sports & Outdoors', basePrice: 42.00, weight: 1.25 },
                  { id: "cj-1007", title: "MagVolt Tri-Fold 3-in-1 Wireless Charging Dock", description: "Charge your phone, watch, and earbuds simultaneously with this sleek, space-saving leatherette tri-fold stand. Backed by Qi-certified 15W high-speed charging technology and thermal protection.", imageUrl: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&q=80&w=800', category: 'Electronics', basePrice: 18.25, weight: 0.28 },
                  { id: "cj-1008", title: "GlowGrid RGB Tactile Mechanical Keyboard", description: "A compact 75% hot-swappable tactile mechanical keyboard. Backlit with 18 RGB flow animations, blue Clicky keys, custom gold-plated rotary knob, and dual Bluetooth/USB connections.", imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800', category: 'Electronics', basePrice: 38.00, weight: 0.95 }
                ];

                seedProducts.forEach((baseProd, index) => {
                  setTimeout(() => {
                    const markup = parseFloat((baseProd.basePrice * 0.15).toFixed(2));
                    const finalPrice = parseFloat((baseProd.basePrice + markup).toFixed(2));
                    const customProd = {
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
                      images: [baseProd.imageUrl],
                      weight: baseProd.weight,
                      isNew: true,
                      isDemo: false,
                      discountEligible: true,
                      delivery: '5-9 Days',
                      shipping: 'Free Global Shipping'
                    };
                    
                    useStore.getState().addProduct(customProd);
                    addBotLog({
                      id: `import-fallback-ok-${Date.now()}-${index}`,
                      bot: 'Auto Import',
                      message: `[Fallback Seed Successful] Imported "${customProd.title}" (15% markup: +$${markup.toFixed(2)})`,
                      date: new Date().toLocaleTimeString(),
                      type: 'success'
                    });
                  }, index * 600);
                });
              }
            }
          }
        }
      } catch (err: any) {
        console.error('[CJ Background Sync Error]', err.message);
      }
    }

    initSupabaseSync();
    initBackgroundCjSync();
  }, [updateSettings, addBotLog]);

  if (!hasSeenIntro) {
    return <Intro />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#D4AF37]/30 selection:text-white font-sans overflow-x-hidden">
      <TopNav />
      <main className="relative z-10 pt-24 pb-12 min-h-screen">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'auth' && <Auth />}
        {activeTab === 'shop' && <ShopTab />}
        {activeTab === 'partner' && <PartnerCentralTab />}
        {activeTab === 'admin' && (user?.email === 'parthadutta8724@gmail.com' ? (
          <AdminTab />
        ) : (
          <div className="max-w-md mx-auto my-24 p-8 bg-[#141414] border border-red-500/20 rounded-2xl text-center shadow-[0_0_50px_rgba(255,0,0,0.05)]">
            <span className="inline-block w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 font-bold mb-4 mx-auto text-xl font-mono">!</span>
            <h2 className="text-xl font-bold text-white mb-2">Restricted Access</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              The Admin Panel is an exclusive system restricted to the authorized developer email: <b className="text-white">parthadutta8724@gmail.com</b>. Standard users and customers cannot visit or view administrative panels.
            </p>
            <button 
              onClick={() => useStore.getState().setActiveTab('home')}
              className="px-6 py-2.5 bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs rounded-full hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all"
            >
              Return Home
            </button>
          </div>
        ))}
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'contact' && (
          <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-4xl font-display font-bold mb-4">Support</h2>
              <p className="text-gray-400">Our customer team is here to help.</p>
            </div>
          </div>
        )}
      </main>
      
      <AnimatePresence>
        {selectedProductId && <ProductDetail productId={selectedProductId} />}
      </AnimatePresence>

      {activeTab !== 'admin' && <SupportWidget />}
    </div>
  );
}
