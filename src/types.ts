export interface Product {
  id: string;
  title: string;
  description?: string;
  supplier: string;
  supplierLogo?: string;
  category?: string;
  price?: number;
  basePrice?: number;
  commission: number;
  profit?: number;
  finalPrice?: number;
  stock?: number;
  sold?: number;
  rating?: number;
  reviews?: number;
  reviewsCount?: number;
  brand?: string;
  weight?: number;
  shipping_method?: string;
  shipping?: string;
  delivery?: string;
  estimatedDelivery?: string;
  discountEligible?: boolean;
  discount?: number;
  is_on_offer?: boolean;
  discount_price?: number;
  isHot?: boolean;
  isNew?: boolean;
  isDemo?: boolean;
  tags?: string[];
  images?: string[];
  imageUrl?: string;
  videoUrl?: string;
  variants?: any[];
  specifications?: { label: string; value: string }[];
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  total: number;
  commissionEarned: number;
  status: 'pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Completed' | 'Cancelled';
  date: string;
  items: CartItem[];
  trackingNumber?: string;
  trackingUpdates?: { date: string; status: string; location: string }[];
  supplier: string;
  paymentMethod?: string;
  estimatedDelivery?: string;
  cancelReason?: string;
  
  // Database fields for dual-schema compatibility
  order_number?: string;
  customer_phone?: string;
  shipping_address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  subtotal?: number;
  shipping_total?: number;
  total_commission?: number;
  payment_status?: string;
}

export interface SupportMessage {
  id: string;
  sender: 'customer' | 'admin';
  text: string;
  timestamp: string;
  customerName?: string;
  customerEmail?: string;
  orderId?: string;
}

export interface Stats {
  revenue: number;
  orders: number;
  commissions: number;
}

