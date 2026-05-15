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
  stock: number;
  sold?: number;
  rating: number;
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
  tags?: string[];
  images?: string[];
  imageUrl?: string;
  variants?: any[];
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
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Completed' | 'Cancelled';
  date: string;
  items: CartItem[];
  trackingNumber?: string;
  trackingUpdates?: { date: string; status: string; location: string }[];
  supplier: string;
  paymentMethod?: string;
  estimatedDelivery?: string;
}

export interface Stats {
  revenue: number;
  orders: number;
  commissions: number;
}

