import { 
  CJAuthResponse, 
  CJProductListResponse, 
  CJCategoryResponse, 
  CJOrderRequest,
  CJOrderResponse,
  CJShippingResponse,
  CJHealthCheck 
} from './cj-types';

/**
 * Robust CJ Dropshipping API Client
 * Features:
 * - Automatic Token Refresh (15m buffer)
 * - Retry Logic (3 attempts, 1s delay)
 * - Request Timeout (15s)
 * - Support for both Client-side Proxy and Direct Server-side calls
 */
export class CJApiClient {
  private baseURL: string;
  public accessToken: string | null = null;
  public refreshToken: string | null = null;
  public apiKey: string | null = null;
  private tokenExpiry: number = 0; // Unix timestamp in ms
  private isRefreshing: Promise<string> | null = null;
  private timeoutMs: number = 15000;
  private maxRetries: number = 3;
  private retryDelayMs: number = 1000;

  constructor(options?: { 
    baseURL?: string, 
    accessToken?: string, 
    refreshToken?: string, 
    tokenExpiry?: number,
    apiKey?: string 
  }) {
    const isBrowser = typeof window !== 'undefined';
    this.baseURL = options?.baseURL || (isBrowser ? '/api/cj-proxy' : 'https://developers.cjdropshipping.com/api2.0/v1');
    this.accessToken = options?.accessToken || null;
    this.refreshToken = options?.refreshToken || null;
    this.tokenExpiry = options?.tokenExpiry || 0;
    this.apiKey = options?.apiKey || null;
  }

  /**
   * Core request handler with timeout and retry logic
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = this.baseURL.endsWith('/') ? `${this.baseURL}${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}` : `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const token = await this.getValidToken().catch(() => this.accessToken);
        
        const headers = new Headers(options.headers);
        if (token && !headers.has('CJ-Access-Token')) {
          headers.set('CJ-Access-Token', token);
        }
        if (this.apiKey && !headers.has('CJ-Api-Key')) {
          headers.set('CJ-Api-Key', this.apiKey);
        }
        if (!headers.has('Content-Type')) {
          headers.set('Content-Type', 'application/json');
        }

        const response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`CJ API HTTP Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // CJ specific error codes
        if (data.code && data.code !== 200 && data.code !== 201) {
           // Handle token expiration specifically if CJ returns 401/expired in body
           if (data.code === 401 || (data.message && data.message.toLowerCase().includes('expired'))) {
             this.accessToken = null;
           }
           throw new Error(data.message || `CJ API Error ${data.code}`);
        }

        return data as T;
      } catch (error: any) {
        clearTimeout(timeoutId);
        lastError = error;
        
        if (error.name === 'AbortError') {
          console.warn(`[CJ API]: Request timeout on attempt ${attempt}`);
        } else {
          console.warn(`[CJ API]: Request failed on attempt ${attempt}:`, error.message);
        }

        if (attempt < this.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelayMs));
        }
      }
    }

    throw lastError || new Error('Request failed after max retries');
  }

  /**
   * Ensures a valid token is available, refreshing if necessary
   */
  public async getValidToken(): Promise<string> {
    const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
    
    // Return current token if valid with safety buffer
    if (this.accessToken && Date.now() < this.tokenExpiry - FIFTEEN_MINUTES_MS) {
      return this.accessToken;
    }

    // Handle concurrent refresh attempts
    if (this.isRefreshing) return this.isRefreshing;

    this.isRefreshing = (async () => {
      try {
        if (this.refreshToken) {
          console.log('[CJ API]: Proactively refreshing token...');
          const data: CJAuthResponse = await this.request('/authentication/refreshAccessToken', {
            method: 'POST',
            body: JSON.stringify({ refreshToken: this.refreshToken })
          });

          if (data.result && data.data?.accessToken) {
            this.updateCache(data.data);
            return this.accessToken!;
          }
        }
        
        // If no refresh token or refresh failed, we might need full re-auth
        // This usually happens on the server side where we have credentials
        if (!this.accessToken) {
          throw new Error('Authentication required. Missing access token.');
        }

        return this.accessToken;
      } finally {
        this.isRefreshing = null;
      }
    })();

    return this.isRefreshing;
  }

  private updateCache(data: any): void {
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
    try {
      this.tokenExpiry = new Date(data.accessTokenExpiryDate).getTime();
    } catch (e) {
      this.tokenExpiry = Date.now() + 86400000; // Default 24h
    }
  }

  /**
   * Authentication
   */
  async getAccessToken(email?: string, apiKey?: string): Promise<CJAuthResponse> {
    if (apiKey) this.apiKey = apiKey;
    const data: CJAuthResponse = await this.request('/authentication/getAccessToken', {
      method: 'POST',
      body: JSON.stringify({ email: email || '', password: this.apiKey })
    });
    
    if (data.result && data.data) {
      this.updateCache(data.data);
    }
    return data;
  }

  async authenticate(email?: string, apiKey?: string): Promise<CJAuthResponse> {
    return this.getAccessToken(email, apiKey);
  }

  /**
   * Search / List Products
   */
  async getProducts(pageNum = 1, pageSize = 20, params: any = {}): Promise<CJProductListResponse> {
    const query = new URLSearchParams({
      pageNum: pageNum.toString(),
      pageSize: pageSize.toString(),
      ...params
    }).toString();
    
    return this.request(`/product/list?${query}`);
  }

  /**
   * Get Categories
   */
  async getCategories(): Promise<CJCategoryResponse> {
    return this.request('/product/getCategory');
  }

  /**
   * Order Operations
   */
  async createOrder(orderRequest: CJOrderRequest): Promise<CJOrderResponse> {
    return this.request('/order/create', {
      method: 'POST',
      body: JSON.stringify(orderRequest)
    });
  }

  async getOrders(pageNum = 1, pageSize = 20, params: any = {}): Promise<any> {
    const query = new URLSearchParams({
      pageNum: pageNum.toString(),
      pageSize: pageSize.toString(),
      ...params
    }).toString();
    return this.request(`/order/list?${query}`);
  }

  /**
   * Shipping / Logistics
   */
  async getShippingMethods(countryCode: string, products: { vid: string, quantity: number }[]): Promise<CJShippingResponse> {
    return this.request('/buildIn/getFreightFee', {
      method: 'POST',
      body: JSON.stringify({
        countryCode,
        products
      })
    });
  }

  /**
   * Proactive connection check
   */
  async detectConnection() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      const data = await response.json();
      return data.hasEnvKeys === true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Direct connection verification
   */
  async checkDirectConnection(accessToken?: string, apiKey?: string): Promise<{ success: boolean; message: string }> {
    try {
      if (accessToken) this.accessToken = accessToken;
      if (apiKey) this.apiKey = apiKey;
      
      // Use product/list with small page size as a robust connection test
      const data: any = await this.getProducts(1, 1);
      if (data.code === 200 || data.result === true) {
        this.tokenExpiry = Date.now() + 86400000;
        return { success: true, message: 'Successfully connected to CJ API.' };
      }
      return { success: false, message: data.message || 'Connection failed: API returned success=false' };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }

  /**
   * Product lookup by ID or URL
   */
  async getProductByUrl(url: string) {
    const pidMatch = url.match(/-p-(\d+)\.html/);
    const pid = pidMatch ? pidMatch[1] : url;

    const endpoint = pidMatch ? '/product/query' : '/product/list';
    const queryParams = `?pid=${pid}`;
    
    const data: any = await this.request(`${endpoint}${queryParams}`);
    
    if (pidMatch) return data.data;
    if (data.data && data.data.list && data.data.list.length > 0) return data.data.list[0];
    throw new Error('No products found matching that criteria.');
  }

  /**
   * Tracking detail
   */
  async getTracking(orderId: string) {
    const data: any = await this.request(`/order/getTrackingDetail?orderId=${orderId}`);
    return data.data;
  }

  /**
   * Health Check
   */
  async healthCheck(): Promise<CJHealthCheck> {
    try {
      // Use product/list which is generally more stable than category endpoint
      const data: any = await this.getProducts(1, 1);
      const isOk = data.code === 200 || data.result === true;
      return {
        status: isOk ? 'healthy' : 'unhealthy',
        connection: true,
        tokenValid: isOk,
        message: data.message || (isOk ? 'Connection active' : 'API returned error'),
        timestamp: new Date().toISOString()
      };
    } catch (e: any) {
      return {
        status: 'unhealthy',
        connection: false,
        tokenValid: false,
        message: e.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export const cjApi = new CJApiClient();
