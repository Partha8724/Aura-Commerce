import { 
  CJAuthResponse, 
  CJProductListResponse, 
  CJCategoryResponse, 
  CJOrderRequest,
  CJOrderResponse,
  CJShippingResponse,
  CJHealthCheck 
} from './cj-types';
import { useStore } from '../store/useStore';

/**
 * AURA COMMERCE - Robust CJ Dropshipping API Client
 * Features:
 * - Automatic Token Handshaking & Proactive Refreshing
 * - Retry Logic (3 attempts, 1s exponential backoff)
 * - Request Timeout (15s) with AbortController
 * - Unified Proxy/Direct Logic for Vercel Serverless
 * - British English Documentation
 */
export class CJApiClient {
  private baseURL: string;
  public accessToken: string | null = null;
  public refreshToken: string | null = null;
  public apiKey: string | null = null;
  private tokenExpiry: number = 0; // Epoch in ms
  private isRefreshing: Promise<string> | null = null;
  private timeoutMs: number = 15000;
  private maxRetries: number = 3;

  constructor(options?: { 
    baseURL?: string, 
    accessToken?: string, 
    refreshToken?: string, 
    tokenExpiry?: number,
    apiKey?: string 
  }) {
    const isBrowser = typeof window !== 'undefined';
    
    // On server, prioritize environment variable
    // In browser, use the local proxy to bypass CORS
    this.baseURL = options?.baseURL || (
      isBrowser 
        ? '/api/cj-proxy' 
        : (process.env.CJ_BASE_URL || 'https://developers.cjdropshipping.com/api2.0/v1')
    );
    
    this.accessToken = options?.accessToken || null;
    this.refreshToken = options?.refreshToken || null;
    this.tokenExpiry = options?.tokenExpiry || 0;
    this.apiKey = options?.apiKey || (typeof process !== 'undefined' ? process.env.CJ_API_KEY : null) || null;
  }

  /**
   * Internal request handler with circuit-breaker-lite logic
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // Precise URL construction to avoid double slashes or missing ones
    let finalBase = this.baseURL;
    if (finalBase.endsWith('/')) finalBase = finalBase.slice(0, -1);
    
    const url = `${finalBase}${path}`;
    
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        // Skip token check for authentication routes to prevent infinite loops
        let token = null;
        if (!endpoint.includes('/authentication/')) {
          token = await this.getValidToken().catch(() => this.accessToken);
        }
        
        const headers = new Headers(options.headers);
        if (token && !headers.has('CJ-Access-Token')) {
          headers.set('CJ-Access-Token', token);
        }
        
        const currentApiKey = this.apiKey || (typeof process !== 'undefined' ? process.env.CJ_API_KEY : null);
        if (currentApiKey && !headers.has('CJ-Api-Key')) {
          headers.set('CJ-Api-Key', currentApiKey);
        }
        
        if (!headers.has('Content-Type')) {
          headers.set('Content-Type', 'application/json');
        }

        console.log(`[CJ API] ${options.method || 'GET'} ${endpoint} (Attempt ${attempt}/3)`);
        
        const response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 401) {
            console.warn('[CJ API] HTTP 401 Unauthorized detected. Clearing cached token.');
            this.accessToken = null;
            this.tokenExpiry = 0;
            if (attempt < this.maxRetries) {
              headers.delete('CJ-Access-Token');
              continue;
            }
          }
          if (response.status === 404) {
            throw new Error(`Routing Error: Resource not found at ${url}. Verify CJ_BASE_URL.`);
          }
          throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('[CJ API] Payload parse error. Response was non-JSON:', text.substring(0, 100));
          throw new Error('Communication Error: Received HTML instead of JSON. Gateway failure.');
        }
        
        // Handle CJ-specific business logic errors
        if (data.code && data.code !== 200 && data.code !== 201) {
           if (data.code === 401 || data.message?.toLowerCase().includes('expired')) {
             this.accessToken = null; // Clear stale token
           }
           throw new Error(data.message || `Protocol Error ${data.code}`);
        }

        return data as T;
      } catch (error: any) {
        clearTimeout(timeoutId);
        lastError = error;
        
        if (error.name === 'AbortError') {
          console.warn(`[CJ API] Request timed out on attempt ${attempt}`);
        }

        if (attempt < this.maxRetries) {
          // Linear backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    throw lastError || new Error('Connection failed after maximum retry attempts');
  }

  /**
   * Proactively handshakes or refreshes the access token
   */
  public async getValidToken(): Promise<string> {
    const BUFFER_MS = 5 * 60 * 1000; // 5 minute buffer
    
    if (this.accessToken && (this.tokenExpiry === 0 || Date.now() < this.tokenExpiry - BUFFER_MS)) {
      return this.accessToken;
    }

    if (this.isRefreshing) return this.isRefreshing;

    this.isRefreshing = (async () => {
      try {
        // Attempt refresh first if possible
        if (this.refreshToken) {
          console.log('[CJ API] Attempting token refresh...');
          try {
            const data: CJAuthResponse = await this.request('/authentication/refreshAccessToken', {
              method: 'POST',
              body: JSON.stringify({ refreshToken: this.refreshToken })
            });

            if (data.result && data.data?.accessToken) {
              this.updateCache(data.data);
              return this.accessToken!;
            }
          } catch (e) {
            console.warn('[CJ API] Refresh failed, resorting to full handshake.');
          }
        }
        
        // Fallback for browser client: perform handshake via /api/cj/connect
        if (typeof window !== 'undefined' && this.apiKey) {
          console.log('[CJ API] Browser detected. Requesting token refresh via /api/cj/connect...');
          try {
            const res = await fetch('/api/cj/connect', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ apiKey: this.apiKey })
            });
            const result = await res.json();
            if (result.success && result.accessToken) {
              this.accessToken = result.accessToken;
              this.refreshToken = result.refreshToken || null;
              this.tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
              
              try {
                const { updateSettings } = useStore.getState();
                updateSettings({
                  cjAccessToken: result.accessToken,
                  cjConnected: true
                });
              } catch (storeErr) {
                console.warn('[CJ API] Store sync failed: ', storeErr);
              }
              
              return this.accessToken!;
            }
          } catch (err: any) {
            console.error('[CJ API] Browser credentials refresh link errored: ', err.message);
          }
        }

        // Default to full handshake if refresh fails or no token exists
        const email = typeof process !== 'undefined' ? process.env.CJ_EMAIL : null;
        const key = this.apiKey || (typeof process !== 'undefined' ? process.env.CJ_API_KEY : null);
        
        if (email && key) {
          console.log('[CJ API] Performing server-side handshake...');
          const auth = await this.authenticate(email, key);
          if (auth.result && auth.data?.accessToken) return auth.data.accessToken;
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
      this.tokenExpiry = Date.now() + 86400000; // 24h fallback
    }
    
    try {
      if (typeof window !== 'undefined') {
        const { updateSettings } = useStore.getState();
        updateSettings({
          cjAccessToken: data.accessToken,
          cjConnected: true
        });
      }
    } catch (storeErr) {
      console.warn('[CJ API] Store sync failed in updateCache: ', storeErr);
    }
  }

  /**
   * Primary authentication handshake
   */
  async getAccessToken(email?: string, apiKey?: string): Promise<CJAuthResponse> {
    if (apiKey) this.apiKey = apiKey;
    const authEmail = email || (typeof process !== 'undefined' ? process.env.CJ_EMAIL : '') || '';
    const authKey = apiKey || this.apiKey || (typeof process !== 'undefined' ? process.env.CJ_API_KEY : '') || '';

    const data: CJAuthResponse = await this.request('/authentication/getAccessToken', {
      method: 'POST',
      body: JSON.stringify({ email: authEmail, password: authKey })
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
   * Inventory Queries
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
   * Order Fulfilment
   */
  async createOrder(orderRequest: CJOrderRequest): Promise<CJOrderResponse> {
    return this.request('/order/createOrder', {
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
   * Logistics & Shipping
   */
  async getShippingMethods(countryCode: string, products: { vid: string, quantity: number }[]): Promise<CJShippingResponse> {
    return this.request('/buildIn/getFreightFee', {
      method: 'POST',
      body: JSON.stringify({ countryCode, products })
    });
  }

  async getTracking(orderId: string) {
    const data: any = await this.request(`/order/getTrackingDetail?orderId=${orderId}`);
    return data.data;
  }

  /**
   * System Health Verification
   */
  async healthCheck(): Promise<CJHealthCheck> {
    try {
      const data: any = await this.getProducts(1, 1);
      const isOk = data.code === 200 || data.result === true;
      return {
        status: isOk ? 'healthy' : 'unhealthy',
        connection: true,
        tokenValid: isOk,
        message: data.message || (isOk ? 'Protocol active' : 'Handshake succeeded but query failed'),
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
   * URL-based Product Discovery
   */
  async getProductByUrl(url: string) {
    const pidMatch = url.match(/-p-(\d+)\.html/) || url.match(/productId=([^&]+)/);
    const pid = pidMatch ? pidMatch[1] : url.split('/').pop()?.split('?')[0];

    const endpoint = pidMatch ? `/product/list?pid=${pid}` : `/product/list?productName=${encodeURIComponent(url)}`;
    const data: any = await this.request(endpoint);
    
    if (data.data && data.data.list && data.data.list.length > 0) return data.data.list[0];
    throw new Error('Product identification failed for the provided URI.');
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
