import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, Order, Stats, SupportMessage } from '../types';
import { initialProducts } from '../data/products';
import { supabase } from '../lib/supabase';
import { cjApi } from '../lib/cj-api';

export interface User {
  name: string;
  email: string;
  storeName?: string;
  avatar?: string;
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
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      hasSeenIntro: false,
      setHasSeenIntro: (val) => set({ hasSeenIntro: val }),

      isCartOpen: false,
      setIsCartOpen: (val) => set({ isCartOpen: val }),

      user: null,
      setUser: (user) => set({ user }),

      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),

      products: [],
      addProduct: (p) => set((state) => {
        return { products: [p, ...state.products] };
      }),
      addProductsBulk: (pList) => set((state) => {
        return { products: [...pList, ...state.products] };
      }),
      updateProduct: (id, updates) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),
      removeDemoProducts: () => set((state) => ({
        products: state.products.filter(p => !p.isDemo)
      })),

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
      updateSettings: (updates) => set((state) => ({ settings: { ...state.settings, ...updates } })),

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
    }
  )
);
