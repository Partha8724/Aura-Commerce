import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, Order, Stats } from '../types';
import { initialProducts } from '../data/products';

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
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  cart: CartItem[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, qty: number) => void;
  clearCart: () => void;

  orders: Order[];
  addOrder: (o: Order) => void;
  updateOrderStatus: (id: string, status: Order['status'], tracking?: string) => void;

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
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      hasSeenIntro: false,
      setHasSeenIntro: (val) => set({ hasSeenIntro: val }),

      user: null,
      setUser: (user) => set({ user }),

      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),

      products: initialProducts,
      addProduct: (p) => set((state) => ({ products: [p, ...state.products] })),
      updateProduct: (id, updates) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
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

      orders: [
        { id: '#ORD-9021', customerName: 'Alice Johnson', email: 'alice@example.com', total: 145.00, commissionEarned: 29.00, status: 'Processing', items: [], date: 'Today at 2:34 PM', supplier: 'CJ Dropshipping' },
        { id: '#ORD-9020', customerName: 'Robert Smith', email: 'robert@example.com', total: 89.50, commissionEarned: 15.50, status: 'Completed', items: [], date: 'Today at 11:15 AM', supplier: 'AliExpress' },
        { id: '#ORD-9019', customerName: 'Emma Davis', email: 'emma@example.com', total: 210.00, commissionEarned: 45.00, status: 'Completed', items: [], date: 'Yesterday', supplier: 'Custom Supplier' }
      ],
      addOrder: (o) => set((state) => ({ orders: [o, ...state.orders] })),
      updateOrderStatus: (id, status, tracking) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, status, trackingNumber: tracking || o.trackingNumber } : o)
      })),

      stats: { revenue: 124567, orders: 3891, commissions: 38942 },
      addStats: (rev, comm) => set((state) => ({
        stats: {
          revenue: state.stats.revenue + rev,
          orders: state.stats.orders + 1,
          commissions: state.stats.commissions + comm
        }
      })),

      settings: {
        storeName: 'Aura Commerce',
        currency: 'USD ($)',
        globalFreeShipping: true,
        heroTitle: 'BUILD YOUR AUTOMATED RETAIL EMPIRE',
        heroSubtitle: 'The future of dropshipping is here',
        cjEmail: '',
        cjApiKey: '',
        cjAccessToken: '',
        cjConnected: false,
        adminName: 'Store Admin',
        adminEmail: 'admin@auracommerce.com',
        themeColor: '#D4AF37'
      },
      updateSettings: (updates) => set((state) => ({ settings: { ...state.settings, ...updates } })),

      payouts: [
        { id: 'PAY-1001', date: '2023-10-12', amount: 1250, method: 'PayPal', status: 'Completed' },
        { id: 'PAY-1002', date: '2023-11-20', amount: 3400, method: 'PayPal', status: 'Completed' }
      ],
      addPayout: (p) => set((state) => ({ payouts: [p, ...state.payouts] })),

      botLogs: [
        { id: '1', bot: 'Price Scanner', message: 'Scanned 145 items. 2 price changes detected.', date: '10 mins ago', type: 'info' }
      ],
      addBotLog: (log) => set((state) => ({ botLogs: [log, ...state.botLogs] })),
      
      selectedProductId: null,
      setSelectedProductId: (id) => set({ selectedProductId: id })
    }),
    {
      name: 'aura-commerce-storage',
    }
  )
);
