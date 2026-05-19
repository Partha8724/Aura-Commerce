/**
 * TypeScript Type Definitions for CJ Dropshipping API
 * Uses British English conventions for documentation.
 */

export interface CJApiError {
  code: number;
  message: string;
  result: boolean;
  success: boolean;
  requestId?: string;
}

export interface CJAuthData {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiryDate: string;
  refreshTokenExpiryDate: string;
}

export interface CJAuthResponse {
  code: number;
  result: boolean;
  message: string;
  data: CJAuthData;
}

export interface CJProductVariant {
  vid: string;
  pid: string;
  variantName: string;
  variantNameEn: string;
  variantKey: string;
  variantPrice: number;
  inventory: number;
  weight: number;
}

export interface CJProduct {
  pid: string;
  productName: string;
  productNameEn: string;
  productSku: string;
  productImage: string;
  productWeight: number;
  productType: string;
  categoryId: string;
  categoryName: string;
  sellPrice: number;
  description: string;
  images: string[];
  variants: CJProductVariant[];
  inventory: number;
}

export interface CJProductListResponse {
  code: number;
  result: boolean;
  message: string;
  data: {
    list: CJProduct[];
    total: number;
    pageNum: number;
    pageSize: number;
  };
}

export interface CJCategory {
  categoryId: string;
  categoryName: string;
  parentCategoryId: string;
  level: number;
}

export interface CJCategoryResponse {
  code: number;
  result: boolean;
  message: string;
  data: CJCategory[];
}

export interface CJOrderProduct {
  vid: string;
  quantity: number;
}

export interface CJOrderAddress {
  countryCode: string;
  province: string;
  city: string;
  address: string;
  postcode: string;
  name: string;
  phone: string;
}

export interface CJOrderRequest {
  orderNumber: string;
  shippingAddress: CJOrderAddress;
  products: CJOrderProduct[];
  shippingMethod: string;
}

export interface CJOrderResponse {
  code: number;
  result: boolean;
  message: string;
  data: {
    orderId: string;
    status: string;
    trackingNumber?: string;
  };
}

export interface CJShippingMethod {
  logisticName: string;
  logisticPrice: number;
  estimatedDeliveryTime: string;
  trackingAvailable: boolean;
  id: string;
}

export interface CJShippingResponse {
  code: number;
  result: boolean;
  message: string;
  data: CJShippingMethod[];
}

export interface CJHealthCheck {
  status: 'healthy' | 'unhealthy';
  connection: boolean;
  tokenValid: boolean;
  message: string;
  timestamp: string;
}
