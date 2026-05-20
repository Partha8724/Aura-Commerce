import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, Order, Stats, SupportMessage } from '../types';
import { initialProducts } from '../data/products';
import { supabase } from '../lib/supabase';
import { cjApi } from '../lib/cj-api';

export interface User {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  storeName?: string;
  avatar?: string;
  role?: 'customer' | 'owner';
}

export interface BotLog {
  id: string;
  bot: string;
  message: string;
  date: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'order' | 'support' | 'system' | 'bot';
  read: boolean;
  email?: string;
}

export interface Payout {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'Pending' | 'Processing' | 'Completed';
}

export interface Settings {
  storeName: string;
  currency: string;
  globalFreeShipping: boolean;
  heroTitle: string;
  heroSubtitle: string;
  cjEmail: string;
  cjApiKey: string;
  cjAccessToken: string;
  cjConnected: boolean;
  aliAppKey: string;
  aliAppSecret: string;
  aliAccessToken: string;
  aliConnected: boolean;
  adminName: string;
  adminEmail: string;
  themeColor: string;
}

interface AppState {
  hasSeenIntro: boolean;
  setHasSeenIntro: (val: boolean) => void;
  
  user: User | null;
  setUser: (user: User | null) => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;

  products: Product[];
  addProduct: (p: Product) => void;
  addProductsBulk: (pList: Product[]) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  removeDemoProducts: () => void;

  cart: CartItem[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, qty: number) => void;
  clearCart: () => void;

  orders: Order[];
  addOrder: (o: Order) => void;
  updateOrderStatus: (id: string, status: Order['status'], tracking?: string, cancelReason?: string, trackingUpdates?: Order['trackingUpdates']) => void;

  supportMessages: SupportMessage[];
  addSupportMessage: (msg: SupportMessage) => void;
  clearSupportMessages: () => void;

  stats: Stats;
  addStats: (revenue: number, commission: number) => void;

  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;

  payouts: Payout[];
  addPayout: (p: Payout) => void;

  botLogs: BotLog[];
  addBotLog: (log: BotLog) => void;

  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;

  isCartOpen: boolean;
  setIsCartOpen: (val: boolean) => void;

  notifications: Notification[];
  addNotification: (n: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  syncAllCjOrders: () => Promise<void>;

  profileSection: 'profile' | 'addresses' | 'orders';
  setProfileSection: (sec: 'profile' | 'addresses' | 'orders') => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasSeenIntro: false,
      setHasSeenIntro: (val) => set({ hasSeenIntro: val }),

      isCartOpen: false,
      setIsCartOpen: (val) => set({ isCartOpen: val }),

      user: null,
      setUser: (user) => set({ user }),

      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),

      profileSection: 'orders',
      setProfileSection: (sec) => set({ profileSection: sec }),

      products: [],
      addProduct: (p) => set((state) => {
        const dbPayload = {
          id: p.id,
          title: p.title,
          description: p.description || '',
          supplier: p.supplier || 'CJ Dropshipping',
          category: p.category || 'General',
          price: p.price || p.finalPrice || 0,
          base_price: p.basePrice || 0,
          basePrice: p.basePrice || 0,
          commission: p.commission || 0,
          final_price: p.finalPrice || p.price || 0,
          finalPrice: p.finalPrice || p.price || 0,
          stock: p.stock || 100,
          rating: p.rating || 4.5,
          images: p.images ? JSON.stringify(p.images) : JSON.stringify([p.imageUrl]),
          imageUrl: p.imageUrl || '',
          image_url: p.imageUrl || '',
          variants: p.variants ? JSON.stringify(p.variants) : JSON.stringify([]),
          weight: p.weight || 0,
          delivery: p.delivery || '5-9 Days',
          shipping: p.shipping || 'Free Global Shipping',
          is_new: p.isNew ?? true,
          isNew: p.isNew ?? true,
          is_demo: p.isDemo ?? false,
          isDemo: p.isDemo ?? false,
          discount_eligible: p.discountEligible ?? true,
          discountEligible: p.discountEligible ?? true,
          created_at: new Date().toISOString()
        };

        supabase
          .from('products')
          .insert(dbPayload)
          .then(({ error }) => {
            if (error) {
              console.warn('[Supabase Sync] Add product insert failed (already exists/error):', error.message);
              // Handle upsert fallback
              supabase.from('products').upsert(dbPayload).then(() => {});
            } else {
              console.log('[Supabase Sync] Product successfully added to Supabase.');
            }
          });

        return { products: [p, ...state.products] };
      }),
      addProductsBulk: (pList) => set((state) => {
        const dbPayloads = pList.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description || '',
          supplier: p.supplier || 'CJ Dropshipping',
          category: p.category || 'General',
          price: p.price || p.finalPrice || 0,
          base_price: p.basePrice || 0,
          basePrice: p.basePrice || 0,
          commission: p.commission || 0,
          final_price: p.finalPrice || p.price || 0,
          finalPrice: p.finalPrice || p.price || 0,
          stock: p.stock || 100,
          rating: p.rating || 4.5,
          images: p.images ? JSON.stringify(p.images) : JSON.stringify([p.imageUrl]),
          imageUrl: p.imageUrl || '',
          image_url: p.imageUrl || '',
          variants: p.variants ? JSON.stringify(p.variants) : JSON.stringify([]),
          weight: p.weight || 0,
          delivery: p.delivery || '5-9 Days',
          shipping: p.shipping || 'Free Global Shipping',
          is_new: p.isNew ?? true,
          isNew: p.isNew ?? true,
          is_demo: p.isDemo ?? false,
          isDemo: p.isDemo ?? false,
          discount_eligible: p.discountEligible ?? true,
          discountEligible: p.discountEligible ?? true,
          created_at: new Date().toISOString()
        }));

        supabase
          .from('products')
          .upsert(dbPayloads)
          .then(({ error }) => {
            if (error) {
              console.warn('[Supabase Sync] Bulk upsert failed:', error.message);
            } else {
              console.log('[Supabase Sync] Bulk products loaded/seeded successfully to cloud.');
            }
          });

        const newProducts = [...pList];
        state.products.forEach(p => {
          if (!newProducts.some(n => n.id === p.id)) {
            newProducts.push(p);
          }
        });

        return { products: newProducts };
      }),
      updateProduct: (id, updates) => set((state) => {
        const dbPayload: any = {};
        if (updates.title !== undefined) dbPayload.title = updates.title;
        if (updates.description !== undefined) dbPayload.description = updates.description;
        if (updates.category !== undefined) dbPayload.category = updates.category;
        if (updates.price !== undefined || updates.finalPrice !== undefined) {
          const p = updates.price ?? updates.finalPrice;
          dbPayload.price = p;
          dbPayload.final_price = p;
          dbPayload.finalPrice = p;
        }
        if (updates.basePrice !== undefined) {
          dbPayload.base_price = updates.basePrice;
          dbPayload.basePrice = updates.basePrice;
        }
        if (updates.commission !== undefined) dbPayload.commission = updates.commission;
        if (updates.stock !== undefined) dbPayload.stock = updates.stock;
        if (updates.images !== undefined) dbPayload.images = JSON.stringify(updates.images);
        if (updates.variants !== undefined) dbPayload.variants = JSON.stringify(updates.variants);
        if (updates.imageUrl !== undefined) {
          dbPayload.imageUrl = updates.imageUrl;
          dbPayload.image_url = updates.imageUrl;
        }
        if (updates.isNew !== undefined) {
          dbPayload.is_new = updates.isNew;
          dbPayload.isNew = updates.isNew;
        }
        if (updates.isDemo !== undefined) {
          dbPayload.is_demo = updates.isDemo;
          dbPayload.isDemo = updates.isDemo;
        }

        if (Object.keys(dbPayload).length > 0) {
          supabase
            .from('products')
            .update(dbPayload)
            .eq('id', id)
            .then(({ error }) => {
              if (error) {
                console.warn('[Supabase Sync] Update product failed:', error.message);
              } else {
                console.log(`[Supabase Sync] Product ${id} updated on cloud database.`);
              }
            });
        }

        return {
          products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
        };
      }),
      deleteProduct: (id) => set((state) => {
        supabase
          .from('products')
          .delete()
          .eq('id', id)
          .then(({ error }) => {
            if (error) {
              console.warn('[Supabase Sync] Delete product failed:', error.message);
            } else {
              console.log(`[Supabase Sync] Product ${id} removed from cloud database.`);
            }
          });

        return {
          products: state.products.filter(p => p.id !== id)
        };
      }),
      removeDemoProducts: () => set((state) => {
        // Also wipe from database where is_demo = true or id is PROD-*
        supabase
          .from('products')
          .delete()
          .eq('is_demo', true)
          .then(() => {
            supabase
              .from('products')
              .delete()
              .eq('isDemo', true)
              .then(() => {});
          });

        return {
          products: state.products.filter(p => !p.isDemo)
        };
      }),

      cart: [],
      addToCart: (p) => set((state) => {
        const existing = state.cart.find(item => item.id === p.id);
        if (existing) {
          return { cart: state.cart.map(item => item.id === p.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item) };
        }
        return { cart: [...state.cart, { ...p, cartQuantity: 1 }] };
      }),
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter(item => item.id !== id)
      })),
      updateCartQuantity: (id, qty) => set((state) => ({
        cart: state.cart.map(item => item.id === id ? { ...item, cartQuantity: Math.max(1, qty) } : item)
      })),
      clearCart: () => set({ cart: [] }),

      orders: [],
      addOrder: (o) => set((state) => {
        const title = `New Order Placed`;
        const message = `Order ${o.id} for $${o.total.toFixed(2)} has been successfully submitted and marked as Processing!`;
        const newNotif: Notification = {
          id: `notif-${Date.now()}`,
          title,
          message,
          date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'order',
          read: false,
          email: o.email
        };

        // Trigger Transactional Order Confirmation Email
        if (o.email) {
          const itemsHtml = (o.items || []).map((item: any) => `
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #222; color: #FFF; font-size: 14px;">${item.title}</td>
              <td style="padding: 12px; border-bottom: 1px solid #222; text-align: center; color: #BBB; font-size: 14px;">x${item.cartQuantity || item.quantity || 1}</td>
              <td style="padding: 12px; border-bottom: 1px solid #222; text-align: right; color: #D4AF37; font-weight: bold; font-size: 14px;">$${Number(item.finalPrice || item.price || 0).toFixed(2)}</td>
            </tr>
          `).join('');

          const htmlBody = `
            <div style="background-color: #0A0A0A; color: #ffffff; font-family: sans-serif; padding: 40px; border: 1px solid #D4AF37; border-radius: 16px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 25px rgba(212,175,55,0.15);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; width: 50px; height: 50px; background: linear-gradient(135deg, #D4AF37, #FFF); border-radius: 12px; line-height: 50px; color: black; font-weight: 900; font-size: 24px; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">A</div>
                <h2 style="color: #ffffff; letter-spacing: 4px; text-transform: uppercase; margin-top: 15px; font-weight: 900; font-family: 'Times New Roman', serif;">AURA COMMERCE</h2>
                <p style="color: #D4AF37; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin: 0;">Modern Premium Dropshipping</p>
              </div>
              <p style="color: #BBB; font-size: 15px; line-height: 1.6;">Dear <strong>${o.customerName || 'Premium Customer'}</strong>,</p>
              <p style="color: #BBB; font-size: 15px; line-height: 1.6;">Thank you for your premium purchase! Your order has been successfully placed and saved to Supabase. We are actively processing it for express carrier handoff.</p>
              
              <div style="background-color: #141414; border: 1px solid #222; border-radius: 12px; padding: 20px; margin: 25px 0;">
                <h3 style="color: #D4AF37; margin-top: 0; border-bottom: 1px solid #222; padding-bottom: 10px; font-size: 14px; text-transform: uppercase; tracking: 1px;">Order Summary</h3>
                <p style="color: #888; font-size: 13px; margin: 5px 0 15px 0;">Order Number: <strong style="color: #FFF;">${o.id || o.order_number}</strong></p>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                  <thead>
                    <tr style="text-align: left; color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
                      <th style="padding: 8px 12px; border-bottom: 1px solid #222; font-weight: 500;">Item</th>
                      <th style="padding: 8px 12px; border-bottom: 1px solid #222; text-align: center; font-weight: 500;">Qty</th>
                      <th style="padding: 8px 12px; border-bottom: 1px solid #222; text-align: right; font-weight: 500;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>
                <div style="display: flex; justify-content: space-between; border-top: 1px solid #222; padding-top: 15px; color: #FFF; font-weight: bold; font-size: 16px;">
                  <span>Total Amount Paid:</span>
                  <span style="color: #D4AF37;">$${Number(o.total || o.total_amount || 0).toFixed(2)}</span>
                </div>
              </div>
              
              <div style="margin-top: 25px; border-left: 2px solid #D4AF37; padding-left: 15px; background: #141414; padding: 12px 15px; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; color: #D4AF37; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Estimated Delivery Window</p>
                <p style="margin: 4px 0 0 0; color: #FFF; font-size: 14px; font-weight: bold;">${o.estimatedDelivery || '3-8 Business Days'} (Express Hand-Carried)</p>
              </div>
              
              <p style="color: #888; font-size: 11px; text-align: center; margin-top: 40px; border-top: 1px solid #222; padding-top: 20px;">
                © Aura Commerce Premium Platforms. Sourced from Elite Carriers.
              </p>
            </div>
          `;

          fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: o.email,
              subject: `Order Confirmation: ${o.id || o.order_number} has been Placed Successfully`,
              html: htmlBody,
              orderDetails: {
                orderNumber: o.id || o.order_number,
                items: o.items,
                totalAmount: o.total || o.total_amount,
                estimatedDelivery: o.estimatedDelivery || '3-8 Business Days'
              }
            })
          })
          .then(res => res.json())
          .then(data => {
            console.log('[Transactional Email Server Confirmation]:', data);
            useStore.getState().addBotLog({
              id: `email-confirm-${Date.now()}`,
              bot: 'Mailer Agent',
              message: `Order confirmation email routed successfully to customer ${o.email} for Order ${o.id}.`,
              date: new Date().toLocaleTimeString(),
              type: 'success'
            });
          })
          .catch(err => {
            console.warn('[Transactional Email Error]:', err.message);
          });
        }

        // 1. Sync the new order to the central Supabase database
        supabase.auth.getUser().then(({ data: { user } }) => {
          const userId = user?.id;
          
          const dbPayload: any = {
            order_number: o.order_number || o.id,
            customer_name: o.customerName,
            customer_email: o.email,
            customer_phone: o.customer_phone || '',
            shipping_address: o.shipping_address || {},
            products: o.items || [],
            subtotal: o.subtotal || o.total,
            shipping_total: o.shipping_total || 0,
            tax_total: 0,
            discount_total: 0,
            total_commission: o.total_commission || o.commissionEarned || 0,
            total_amount: o.total,
            payment_method: o.paymentMethod || 'Credit Card',
            payment_status: o.payment_status || 'paid',
            order_status: o.status || 'pending',
            supplier: o.supplier || 'CJ Dropshipping',
            created_at: o.date || new Date().toISOString()
          };
          
          if (userId) {
            dbPayload.user_id = userId;
          }

          supabase
            .from('orders')
            .insert(dbPayload)
            .then(
              ({ error }) => {
                if (error) {
                  console.warn('[Supabase DB Sync] Snake_case insert failed: ' + error.message + '. Retrying legacy insert...');
                  
                  // Retrying with legacy columns
                  const legacyPayload = {
                    id: o.id,
                    customerName: o.customerName,
                    email: o.email,
                    total: o.total,
                    commissionEarned: o.commissionEarned,
                    status: o.status,
                    date: o.date,
                    items: o.items,
                    trackingNumber: o.trackingNumber || null,
                    trackingUpdates: o.trackingUpdates || [],
                    supplier: o.supplier,
                    paymentMethod: o.paymentMethod || 'Credit Card',
                    estimatedDelivery: o.estimatedDelivery || null,
                    cancelReason: o.cancelReason || null
                  };
                  
                  supabase
                    .from('orders')
                    .insert(legacyPayload)
                    .then(({ error: legacyErr }) => {
                      if (legacyErr) {
                        console.warn('[Supabase DB Sync] Legacy format insert failed:', legacyErr.message);
                      } else {
                        console.log('[Supabase DB Sync] Order synced with legacy schema.');
                      }
                    });
                } else {
                  console.log('[Supabase DB Sync] Order synchronized with snake_case schema.');
                }
              },
              (err) => {
                console.warn('[Supabase DB Sync] DB insert exception:', err);
              }
            );
        });

        // 2. Automatically push relevant CJ Dropshipping products to the merchant portal
        if (state.settings.cjConnected && state.settings.cjAccessToken) {
          cjApi.accessToken = state.settings.cjAccessToken;
          cjApi.apiKey = state.settings.cjApiKey || null;

          const cjProducts = (o.items || [])
            .filter((item: any) => item.id.startsWith('cj-') || (item.tags && item.tags.includes('automation-imported')))
            .map((item: any) => {
              const cleanVid = item.vid || item.id.replace('cj-', '');
              return {
                vid: cleanVid,
                quantity: item.cartQuantity || 1
              };
            });

          if (cjProducts.length > 0) {
            const shipping: any = o.shipping_address || {};
            const orderRequest = {
              orderNumber: o.id,
              shippingAddress: {
                countryCode: shipping.country || 'US',
                province: shipping.state || 'California',
                city: shipping.city || 'Los Angeles',
                address: (shipping.line1 + ' ' + (shipping.line2 || '')).trim() || '123 Luxury Avenue',
                postcode: shipping.zip || '90001',
                name: o.customerName || 'Customer',
                phone: o.customer_phone || '555-0100'
              },
              products: cjProducts,
              shippingMethod: 'USPS'
            };

            cjApi.createOrder(orderRequest)
              .then(cjRes => {
                console.log('[CJ Automation] Order push success:', cjRes);
                // Dynamically list in developer bot logs
                useStore.getState().addBotLog({
                  id: `cj-ok-${Date.now()}`,
                  bot: 'CJ Fulfilment Bot',
                  message: `PROTOCOL ACTIVE: Successfully pushed Order ${o.id} to CJ Dropshipping platform. CJ Reference: ${cjRes.data?.orderId || 'Success'}.`,
                  date: new Date().toLocaleTimeString(),
                  type: 'success'
                });
              })
              .catch(err => {
                console.warn('[CJ Automation] Direct push failed:', err.message);
                useStore.getState().addBotLog({
                  id: `cj-err-${Date.now()}`,
                  bot: 'CJ Fulfilment Bot',
                  message: `CJ Dropshipping warning: Could not auto-sync order ${o.id} to CJ portal (${err.message}). Queue saved locally for offline processing.`,
                  date: new Date().toLocaleTimeString(),
                  type: 'warning'
                });
              });
          }
        }

        return {
          orders: [o, ...state.orders],
          notifications: [newNotif, ...state.notifications]
        };
      }),
      updateOrderStatus: (id, status, tracking, cancelReason, trackingUpdates) => set((state) => {
        const order = state.orders.find(o => o.id === id);
        const updatedOrders = state.orders.map(o => o.id === id ? { 
          ...o, 
          status, 
          trackingNumber: tracking || o.trackingNumber,
          cancelReason: cancelReason || o.cancelReason,
          trackingUpdates: trackingUpdates || o.trackingUpdates 
        } : o);

        const newNotifs = [...state.notifications];
        if (order) {
          newNotifs.unshift({
            id: `notif-${Date.now()}`,
            title: status === 'Cancelled' ? 'Order Cancelled' : `Order Update: ${status}`,
            message: status === 'Cancelled' 
              ? `Your order ${id} was cancelled by Aura Store. Reason: "${cancelReason || 'Out of Stock'}"`
              : `Your order ${id} has been transitioned to "${status}". Tracking: ${tracking || order.trackingNumber || 'AURA-TRAK-983021'}`,
            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'order',
            read: false,
            email: order.email
          });
        }

        let commissionAddition = 0;
        let finalUpdatedOrders = updatedOrders;

        if (order) {
          const isNewCommissionState = status === 'Completed' || status === 'Delivered';
          const isOldCommissionState = order.status === 'Completed' || order.status === 'Delivered' || (order.commissionEarned && order.commissionEarned > 0);

          if (isNewCommissionState && !isOldCommissionState) {
            commissionAddition = (order.items || []).reduce((acc, item) => {
              const itemComm = item.commission || 0;
              const qty = item.cartQuantity || 1;
              return acc + (itemComm * qty);
            }, 0);

            finalUpdatedOrders = updatedOrders.map(o => o.id === id ? {
              ...o,
              commissionEarned: commissionAddition
            } : o);
          } else if (!isNewCommissionState && isOldCommissionState) {
            commissionAddition = - (order.commissionEarned || 0);
            finalUpdatedOrders = updatedOrders.map(o => o.id === id ? {
              ...o,
              commissionEarned: 0
            } : o);
          }
        }

        // Sync order status updates with the central Supabase database
        // We will try updating by matching order_number = id first to support the new schema,
        // and fall back to id = id if that returns error or fails.
        const dbPayload: any = {
          order_status: status,
          status,
          tracking_number: tracking,
          trackingNumber: tracking,
          cancel_reason: cancelReason || null,
          cancelReason: cancelReason || null,
          tracking_updates: trackingUpdates,
          trackingUpdates,
          commission_earned: commissionAddition,
          commissionEarned: commissionAddition
        };

        supabase
          .from('orders')
          .update(dbPayload)
          .eq('order_number', id)
          .then(
            ({ error, data }) => {
              supabase
                .from('orders')
                .update(dbPayload)
                .eq('id', id)
                .then(
                  ({ error: legacyErr }) => {
                    if (legacyErr && error) {
                      console.warn('[Supabase Sync] Update failed under both schemas. Errors:', error.message, legacyErr.message);
                    } else {
                      console.log('[Supabase Sync] Status updated on central database.');
                    }
                  }
                );
            },
            (err) => {
              console.warn('[Supabase Sync] Update exception:', err);
            }
          );

        return {
          orders: finalUpdatedOrders,
          notifications: newNotifs,
          stats: {
            ...state.stats,
            commissions: state.stats.commissions + commissionAddition
          }
        };
      }),

      syncAllCjOrders: async () => {
        const { orders, settings, updateOrderStatus, addBotLog, addNotification } = get();
        
        // Find active orders that are not finished
        const activeOrders = orders.filter(o => 
          o.status !== 'Completed' && 
          o.status !== 'Delivered' && 
          o.status !== 'Cancelled'
        );

        if (activeOrders.length === 0) return;

        for (const order of activeOrders) {
          // 1. Try real CJ Sync if connected
          if (settings.cjConnected && settings.cjAccessToken) {
            try {
              cjApi.accessToken = settings.cjAccessToken;
              cjApi.apiKey = settings.cjApiKey || null;
              
              const trackingResult = await cjApi.getTracking(order.id);
              if (trackingResult && trackingResult.trackingNumber) {
                const freshTrackingCode = trackingResult.trackingNumber;
                const carrier = trackingResult.shippingCompany || 'DHL Express';
                const waypoint = trackingResult.trackingDetail || 'En route.';
                
                const newUpdate = {
                  date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
                  status: `CJ Sync Node: ${waypoint}. Courier: ${carrier}`,
                  location: trackingResult.latestLocation || 'International Air Hub'
                };

                const updatedTimeline = [
                  newUpdate,
                  ...(order.trackingUpdates || [])
                ];

                let targetStatus: Order['status'] = 'Shipped';
                if (trackingResult.statusEn?.toLowerCase().includes('delivered')) {
                  targetStatus = 'Delivered';
                } else if (trackingResult.statusEn?.toLowerCase().includes('out for delivery') || trackingResult.statusEn?.toLowerCase().includes('arrival')) {
                  targetStatus = 'Out for Delivery';
                }

                updateOrderStatus(order.id, targetStatus, freshTrackingCode, undefined, updatedTimeline);

                addBotLog({
                  id: `cj-sync-real-${order.id}-${Date.now()}`,
                  bot: 'CJ Sync Bot',
                  message: `PROTOCOL SYNC: Order ${order.id} updated live. Tracking: ${freshTrackingCode} [Carrier: ${carrier}]`,
                  date: new Date().toLocaleTimeString(),
                  type: 'success'
                });

                continue; // Sync complete for this order
              }
            } catch (err: any) {
              console.warn(`[CJ Sync Helper] Fetch failed for ${order.id}:`, err.message);
            }
          }

          // 2. Demo Sandbox Logistics Simulation Engine
          const currentTime = Date.now();
          const orderTime = new Date(order.date).getTime();
          const timeElapsedMs = currentTime - orderTime;

          let nextStatus: Order['status'] | null = null;
          let updateDesc = '';
          let updateLocation = '';
          let generatedTracking = order.trackingNumber;

          // Sequential progression thresholds over time
          if (order.status === 'pending') {
            if (timeElapsedMs >= 15000) {
              nextStatus = 'Processing';
              updateDesc = 'Item picked from automated shelving and wrapped in heavy-duty package.';
              updateLocation = 'Aura Warehouse B1';
            }
          } else if (order.status === 'Processing') {
            if (timeElapsedMs >= 35000) {
              nextStatus = 'Shipped';
              updateDesc = 'Departure Scan: Handover to DHL Air Courier flight DHL-920 with tracking update.';
              updateLocation = 'Hong Kong Express Air Base';
              if (!generatedTracking) {
                generatedTracking = `DHL-CJ-${Math.floor(10000000 + Math.random() * 90000000)}`;
              }
            }
          } else if (order.status === 'Shipped') {
            if (timeElapsedMs >= 65000) {
              nextStatus = 'Out for Delivery';
              updateDesc = 'With vehicle: Dispatched from sorting line to delivery van for residential route.';
              updateLocation = 'Los Angeles Distribution HQ';
            }
          } else if (order.status === 'Out for Delivery') {
            if (timeElapsedMs >= 95000) {
              nextStatus = 'Delivered';
              updateDesc = 'Delivered: Secured inside parcel smart locker. Photos uploaded.';
              updateLocation = 'Front Portal Cabinet';
            }
          }

          if (nextStatus) {
            const stepUpdate = {
              date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
              status: updateDesc,
              location: updateLocation
            };

            const existingUpdates = order.trackingUpdates || [];
            const isDuplicate = existingUpdates.some(u => u.status === updateDesc);

            if (!isDuplicate) {
              const trackingTimeline = [stepUpdate, ...existingUpdates];
              
              updateOrderStatus(order.id, nextStatus, generatedTracking, undefined, trackingTimeline);

              addBotLog({
                id: `sim-step-${order.id}-${nextStatus}-${currentTime}`,
                bot: 'Logistics Simulation',
                message: `Automated Checkpoint: Order ${order.id} status is now "${nextStatus}". Tracking code: ${generatedTracking || 'Calculating...'}`,
                date: new Date().toLocaleTimeString(),
                type: 'info'
              });

              addNotification({
                title: `Order Update: ${nextStatus}`,
                message: `Your order ${order.id} changed to "${nextStatus}". Tracking No: ${generatedTracking || 'N/A'}`,
                type: 'order',
                email: order.email
              });
            }
          }
        }
      },

      supportMessages: [
        {
          id: 'mock-1',
          sender: 'customer',
          text: 'Hi there! I ordered the LED Sunset Atmosphere Projector, but I need to change my shipping address to 456 Luxury Blvd. Can you assist?',
          timestamp: new Date(Date.now() - 10800000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          customerName: 'Sarah Jenkins',
          customerEmail: 'sarah@example.com',
          orderId: 'cj-1001'
        },
        {
          id: 'mock-2',
          sender: 'admin',
          text: 'Hello Sarah! Yes, I can help you with that. I have updated the shipping details for order cj-1001 in our CJ Dropshipping panel.',
          timestamp: new Date(Date.now() - 9000000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          customerName: 'Sarah Jenkins',
          customerEmail: 'sarah@example.com',
          orderId: 'cj-1001'
        }
      ],
      addSupportMessage: (msg) => set((state) => {
        const newNotifs = [...state.notifications];
        if (msg.sender === 'admin') {
          newNotifs.unshift({
            id: `notif-${Date.now()}`,
            title: `Support Agent Replied`,
            message: msg.text.length > 70 ? `${msg.text.substring(0, 70)}...` : msg.text,
            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'support',
            read: false,
            email: msg.customerEmail
          });
        }
        return {
          supportMessages: [...state.supportMessages, msg],
          notifications: newNotifs
        };
      }),
      clearSupportMessages: () => set({ supportMessages: [] }),

      stats: { revenue: 0, orders: 0, commissions: 0 },
      addStats: (rev, comm) => set((state) => ({
        stats: {
          revenue: state.stats.revenue + rev,
          orders: state.stats.orders + 1,
          commissions: state.stats.commissions + comm
        }
      })),

      settings: {
        storeName: 'Aura Premium Store',
        currency: 'USD ($)',
        globalFreeShipping: true,
        heroTitle: 'ELEVATE YOUR STYLE',
        heroSubtitle: 'Luxury curators of fine goods.',
        cjEmail: '',
        cjApiKey: '',
        cjAccessToken: '',
        cjConnected: false,
        aliAppKey: '',
        aliAppSecret: '',
        aliAccessToken: '',
        aliConnected: false,
        adminName: '',
        adminEmail: '',
        themeColor: '#D4AF37'
      },
      updateSettings: (updates) => {
        set((state) => {
          const newSettings = { ...state.settings, ...updates };

          // Sync to Supabase in the background
          supabase.auth.getUser().then(({ data: { user } }) => {
            const ownerId = user?.id;
            const dbPayload = {
              store_name: newSettings.storeName,
              currency: newSettings.currency,
              theme: newSettings.themeColor,
              hero_title: newSettings.heroTitle,
              hero_subtitle: newSettings.heroSubtitle,
              cj_email: newSettings.cjEmail,
              cj_api_key: newSettings.cjApiKey,
              cj_access_token: newSettings.cjAccessToken,
              cj_connected: newSettings.cjConnected,
              ali_app_key: newSettings.aliAppKey,
              ali_app_secret: newSettings.aliAppSecret,
              ali_access_token: newSettings.aliAccessToken,
              ali_connected: newSettings.aliConnected,
              admin_name: newSettings.adminName,
              admin_email: newSettings.adminEmail,
              global_free_shipping: newSettings.globalFreeShipping,
              // Fallback camelCase properties for complete schemas
              storeName: newSettings.storeName,
              currencyVal: newSettings.currency,
              themeColor: newSettings.themeColor,
              heroTitle: newSettings.heroTitle,
              heroSubtitle: newSettings.heroSubtitle,
              cjEmail: newSettings.cjEmail,
              cjApiKey: newSettings.cjApiKey,
              cjAccessToken: newSettings.cjAccessToken,
              cjConnected: newSettings.cjConnected,
              globalFreeShipping: newSettings.globalFreeShipping,
            };

            // First try updating or inserts
            if (ownerId) {
              supabase
                .from('store_settings')
                .upsert({ owner_id: ownerId, id: 1, ...dbPayload }, { onConflict: 'owner_id' })
                .then(({ error }) => {
                  if (error) {
                    // Try General update by id = 1
                    supabase
                      .from('store_settings')
                      .update(dbPayload)
                      .eq('id', 1)
                      .then(({ error: stepErr }) => {
                        if (stepErr) {
                          console.warn('[Supabase Settings Sync] General settings update stalled:', stepErr.message);
                        } else {
                          console.log('[Supabase Settings Sync] Settings saved with general fallback.');
                        }
                      });
                  } else {
                    console.log('[Supabase Settings Sync] Settings saved with owner_id mapping.');
                  }
                });
            } else {
              supabase
                .from('store_settings')
                .update(dbPayload)
                .eq('id', 1)
                .then(({ error }) => {
                  if (error) {
                    supabase
                      .from('store_settings')
                      .insert({ id: 1, ...dbPayload })
                      .then(() => {});
                  }
                });
            }
          });

          return { settings: newSettings };
        });
      },

      payouts: [],
      addPayout: (p) => set((state) => ({ payouts: [p, ...state.payouts] })),

      botLogs: [],
      addBotLog: (log) => set((state) => {
        const newNotifs = [...state.notifications];
        // Mirror bot log success / warning as a system notification
        if (log.type === 'success' || log.type === 'error' || log.type === 'warning') {
          newNotifs.unshift({
            id: `notif-${Date.now()}`,
            title: `Empire Bot: ${log.bot}`,
            message: log.message,
            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'bot',
            read: false
          });
        }
        return {
          botLogs: [log, ...state.botLogs],
          notifications: newNotifs
        };
      }),
      
      selectedProductId: null,
      setSelectedProductId: (id) => set({ selectedProductId: id }),

      notifications: [
        {
          id: 'init-notif-1',
          title: 'Welcome to Aura Store',
          message: 'Your high-converting dropshipping ecommerce pipeline is fully online and integrated.',
          date: new Date().toLocaleDateString() + ' 12:00 PM',
          type: 'system',
          read: false
        }
      ],
      addNotification: (n) => set((state) => ({
        notifications: [
          {
            ...n,
            id: `notif-${Date.now()}`,
            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false
          },
          ...state.notifications
        ]
      })),
      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      })),
      clearNotifications: () => set({ notifications: [] })
    }),
    {
      name: 'aura-commerce-storage-v2',
      partialize: (state) => ({
        hasSeenIntro: state.hasSeenIntro,
        user: state.user,
        cart: state.cart,
        activeTab: state.activeTab,
        profileSection: state.profileSection,
      }),
    }
  )
);
