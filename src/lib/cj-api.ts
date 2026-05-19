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
 * - Automatic Token Handshaking
 * - Retry Logic (3 attempts)
 * - Request Timeout (15s)
 * - Support for both Client-side Proxy and Direct Server-side calls
 * - Singleton Export
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
    // Fallback to proxy in browser, direct URL on server
    this.baseURL = options?.baseURL || (isBrowser ? '/api/cj-proxy' : (process.env.CJ_BASE_URL || 'https://developers.cjdropshipping.com/api2.0/v1'));
    this.accessToken = options?.accessToken || null;
    this.refreshToken = options?.refreshToken || null;
    this.tokenExpiry = options?.tokenExpiry || 0;
    this.apiKey = options?.apiKey || null;
  }

  /**
   * Core request handler with timeout and retry logic
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = this.baseURL.endsWith('/') 
      ? `${this.baseURL}${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}` 
      : `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
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

        console.log(`[CJ API] ${options.method || 'GET'} Request to ${endpoint} (Attempt ${attempt})`);
        
        const response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // Check for 404 specifically as it's a common routing error
          if (response.status === 404) {
            throw new Error(`CJ API Routing Error (404 Not Found) at ${url}. Check your CJ_BASE_URL.`);
          }
          throw new Error(`CJ API HTTP Error: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('[CJ API] Parsing error. Raw response:', text.substring(0, 500));
          throw new Error('CJ API returned a non-JSON response. Check your proxy settings.');
        }
        
        // CJ specific error codes mapping
        if (data.code && data.code !== 200 && data.code !== 201) {
           if (data.code === 401 || (data.message && data.message.toLowerCase().includes('expired'))) {
             this.accessToken = null;
           }
           throw new Error(data.message || `CJ API System Error ${data.code}`);
        }

        return data as T;
      } catch (error: any) {
        clearTimeout(timeoutId);
        lastError = error;
        
        if (error.name === 'AbortError') {
          console.warn(`[CJ API] Request timed out on attempt ${attempt}`);
        } else {
          console.warn(`[CJ API] Error on attempt ${attempt}:`, error.message);
        }

        if (attempt < this.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelayMs));
        }
      }
    }

    throw lastError || new Error('Request failed after maximum retry attempts');
  }

  /**
   * Ensures a valid token is available, refreshing if necessary
   */
  public async getValidToken(): Promise<string> {
    const BUFFER_MS = 5 * 60 * 1000;
    
    if (this.accessToken && Date.now() < this.tokenExpiry - BUFFER_MS) {
      return this.accessToken;
    }

    if (this.isRefreshing) return this.isRefreshing;

    this.isRefreshing = (async () => {
      try {
        if (this.refreshToken) {
          console.log('[CJ API] Token refreshing...');
          const data: CJAuthResponse = await this.request('/authentication/refreshAccessToken', {
            method: 'POST',
            body: JSON.stringify({ refreshToken: this.refreshToken })
          });

          if (data.result && data.data?.accessToken) {
            this.updateCache(data.data);
            return this.accessToken!;
          }
        }
        
        if (!this.accessToken) {
          // If we are server-side and have credentials, we could auto-authenticate
          if (typeof window === 'undefined' && process.env.CJ_EMAIL && this.apiKey) {
            console.log('[CJ API] No token found. Attempting auto-handshake on server...');
            const auth = await this.authenticate(process.env.CJ_EMAIL, this.apiKey);
            if (auth.result && auth.data?.accessToken) return auth.data.accessToken;
          }
        }

        return this.accessToken || '';
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
      this.tokenExpiry = Date.now() + 86400000; // Default 24h safety
    }
  }

  /**
   * Authentication shake
   */
  async getAccessToken(email?: string, apiKey?: string): Promise<CJAuthResponse> {
    if (apiKey) this.apiKey = apiKey;
    const body = { 
      email: email || process.env.CJ_EMAIL || '', 
      password: this.apiKey 
    };

    const data: CJAuthResponse = await this.request('/authentication/getAccessToken', {
      method: 'POST',
      body: JSON.stringify(body)
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
   * Inventory & Products
   */
  async getProducts(pageNum = 1, pageSize = 20, params: any = {}): Promise<CJProductListResponse> {
    const query = new URLSearchParams({
      pageNum: pageNum.toString(),
      pageSize: pageSize.toString(),
      ...params
    }).toString();
    
    return this.request(`/product/list?${query}`);
  }

  async getCategories(): Promise<CJCategoryResponse> {
    return this.request('/product/getCategory');
  }

  /**
   * Health Check Protocol
   */
  async healthCheck(): Promise<CJHealthCheck> {
    try {
      // Robust check using product list
      const data: any = await this.getProducts(1, 1);
      const isOk = data.code === 200 || data.result === true;
      return {
        status: isOk ? 'healthy' : 'unhealthy',
        connection: true,
        tokenValid: isOk,
        message: data.message || (isOk ? 'Protocol active' : 'API handshake failed'),
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

  /**
   * Order Operations
   */
  async createOrder(orderRequest: any): Promise<any> {
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
  async getShippingMethods(countryCode: string, products: { vid: string, quantity: number }[]): Promise<any> {
    return this.request('/buildIn/getFreightFee', {
      method: 'POST',
      body: JSON.stringify({
        countryCode,
        products
      })
    });
  }

  /**
   * Product lookup by URL
   */
  async getProductByUrl(url: string) {
    const pidMatch = url.match(/-p-(\d+)\.html/) || url.match(/productId=([^&]+)/);
    const pid = pidMatch ? pidMatch[1] : url.split('/').pop()?.split('?')[0];

    // Use product list with specific PID if match found
    const endpoint = pidMatch ? `/product/list?pid=${pid}` : `/product/list?productName=${encodeURIComponent(url)}`;
    const data: any = await this.request(endpoint);
    
    if (data.data && data.data.list && data.data.list.length > 0) return data.data.list[0];
    throw new Error('Product not found or invalid URL provided.');
  }

  /**
   * Tracking detail
   */
  async getTracking(orderId: string) {
    const data: any = await this.request(`/order/getTrackingDetail?orderId=${orderId}`);
    return data.data;
  }

  /**
   * Detection for Server-side credentials
   */
  async detectConnection(): Promise<boolean> {
    try {
      const response = await fetch('/api/cj-proxy/health');
      const data = await response.json();
      return data.hasEnvKeys === true;
    } catch (e) {
      return false;
    }
  }
}

export const cjApi = new CJApiClient();



