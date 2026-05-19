// CJ Dropshipping API Type Definitions
// AURA COMMERCE - UK Market

export interface CJAuthResponse {
  code: number;
  result: boolean;
  message: string;
  success: boolean;
  requestId: string;
  data: {
    openId: number;
    accessToken: string;
    accessTokenExpiryDate: string;
    refreshToken: string;
    refreshTokenExpiryDate: string;
    createDate: string;
  };
}

export interface CJProduct {
  pid: string;
  name: string;
  description: string;
  price: number;
  shippingPrice: number;
  images: string[];
  variants: CJVariant[];
  inventory: number;
  categoryId: string;
  categoryName: string;
}

export interface CJVariant {
  vid: string;
  name: string;
  price: number;
  inventory: number;
  sku: string;
}

export interface CJProductListResponse {
  code: number;
  result: boolean;
  message: string;
  success: boolean;
  data: {
    list: CJProduct[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface CJCategoryResponse {
  code: number;
  result: boolean;
  message: string;
  success: boolean;
  data: CJCategory[];
}

export interface CJCategory {
  id: string;
  name: string;
  parentId: string;
  children?: CJCategory[];
}

export interface CJOrderRequest {
  products: {
    pid: string;
    vid: string;
    quantity: number;
  }[];
  shippingAddress: {
    name: string;
    phone: string;
    country: string;
    state: string;
    city: string;
    address: string;
    postcode: string;
  };
}

export interface CJOrderResponse {
  code: number;
  result: boolean;
  message: string;
  success: boolean;
  data: {
    orderId: string;
    status: string;
    trackingNumber: string;
  };
}

export interface CJShippingResponse {
  code: number;
  result: boolean;
  message: string;
  success: boolean;
  data: CJShippingMethod[];
}

export interface CJShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
}

export interface CJApiError {
  code: number;
  result: boolean;
  message: string;
  success: boolean;
  requestId: string;
  data: null;
}

export interface CJHealthCheck {
  status: 'healthy' | 'unhealthy';
  connection: boolean;
  tokenValid: boolean;
  message: string;
  timestamp: string;
}
