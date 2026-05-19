import { 
  CJAuthResponse, 
  CJProductListResponse, 
  CJCategoryResponse, 
  CJHealthCheck 
} from './cj-types';

/**
 * CJ Dropshipping API Client
 * Optimized for Frontend via Proxy
 */
export class CJDropshippingAPI {
  // Use local proxy to avoid CORS issues
  private baseURL = '/api/cj-proxy';
  
  // In-memory token storage (shared across application life)
  public accessToken: string | null = null;
  private refreshToken: string | null = null;
  public apiKey: string | null = null;
  private tokenExpiry: number = 0; // Unix timestamp in ms
  private isRefreshing: Promise<string> | null = null;

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
   * Refreshes the token using the refresh token
   */
  private async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) throw new Error('No refresh token');

    console.log('[CJ API]: Proactive token refresh starting...');
    const response = await fetch(`${this.baseURL}/authentication/refreshAccessToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: this.refreshToken })
    });

    const data: CJAuthResponse = await response.json();
    if (data.result && data.data?.accessToken) {
      this.updateCache(data.data);
      return this.accessToken!;
    }
    throw new Error('Refresh failed');
  }

  private updateCache(data: any): void {
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
    try {
      this.tokenExpiry = new Date(data.accessTokenExpiryDate).getTime();
    } catch (e) {
      this.tokenExpiry = Date.now() + 86400000;
    }
  }

  /**
   * Logic to ensure we always have a valid token
   */
  public async getValidToken(): Promise<string> {
    const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
    
    if (this.accessToken && Date.now() < this.tokenExpiry - FIFTEEN_MINUTES_MS) {
      return this.accessToken;
    }

    if (this.isRefreshing) return this.isRefreshing;

    this.isRefreshing = (async () => {
      try {
        if (this.refreshToken) {
          try {
            return await this.refreshAccessToken();
          } catch (e) {
            console.warn('[CJ API]: Refresh failed, re-authenticating...');
          }
        }
        
        // If we have an API key but no token, we can't really re-auth without email
        // For standard frontend use, we assume the user provides the token via manual connection
        // or it's seeded from the backend proxy.
        if (!this.accessToken) {
           throw new Error('Authentication required. Please connect your CJ account.');
        }
        
        return this.accessToken;
      } finally {
        this.isRefreshing = null;
      }
    })();

    return this.isRefreshing;
  }

  async checkDirectConnection(accessToken?: string, apiKey?: string) {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (accessToken) headers['CJ-Access-Token'] = accessToken;
      if (apiKey) headers['CJ-Api-Key'] = apiKey;

      // Use /category/list for connection test (reliable endpoint)
      const response = await fetch(`${this.baseURL}/category/list`, {
        method: 'GET',
        headers
      });
      
      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        return { success: false, error: `Response is not valid JSON. Status: ${response.status}. Proxy is reachable but CJ returned HTML.` };
      }
      
      if (data.code === 200 || data.result === true) {
        this.accessToken = accessToken || null;
        this.apiKey = apiKey || null;
        // If we don't have expiration from this call, assume 24h
        this.tokenExpiry = Date.now() + 86400000; 
        return { success: true };
      }
      
      return { success: false, error: data.message || `CJ Error (${data.code}): Connection test failed.` };
    } catch (error: any) {
      return { success: false, error: `Network error: ${error.message}` };
    }
  }

  async getProductByUrl(url: string) {
    const pidMatch = url.match(/-p-(\d+)\.html/);
    const pid = pidMatch ? pidMatch[1] : url;

    // CJ API 2.0 endpoints
    const endpoint = pidMatch ? '/product/query' : '/product/list';
    const method = pidMatch ? 'GET' : 'GET'; // list can be GET too
    const queryParams = `?pid=${pid}`;
    
    const token = await this.getValidToken().catch(() => this.accessToken);
    
    const response = await fetch(`${this.baseURL}${endpoint}${queryParams}`, {
      method,
      headers: {
        ...(token ? { 'CJ-Access-Token': token } : {}),
        ...(this.apiKey ? { 'CJ-Api-Key': this.apiKey } : {}),
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (data.code === 200) {
      if (pidMatch) return data.data;
      if (data.data && data.data.list && data.data.list.length > 0) return data.data.list[0];
      throw new Error('No products found matching that criteria.');
    }
    
    throw new Error(data.message || `CJ Error (${data.code})`);
  }

  async getProducts(pageNum: number = 1, pageSize: number = 20) {
    const token = await this.getValidToken().catch(() => this.accessToken);
    const response = await fetch(`${this.baseURL}/product/list?pageNum=${pageNum}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: {
        ...(token ? { 'CJ-Access-Token': token } : {}),
        ...(this.apiKey ? { 'CJ-Api-Key': this.apiKey } : {}),
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (data.code === 200) return data.data?.list || [];
    throw new Error(data.message || 'Failed to fetch products list.');
  }

  async getTracking(orderId: string) {
    const token = await this.getValidToken().catch(() => this.accessToken);
    const response = await fetch(`${this.baseURL}/order/getTrackingDetail?orderId=${orderId}`, {
      method: 'GET',
      headers: {
        ...(token ? { 'CJ-Access-Token': token } : {}),
        ...(this.apiKey ? { 'CJ-Api-Key': this.apiKey } : {}),
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (data.code === 200) return data.data;
    throw new Error(data.message || 'Failed to get tracking');
  }

  /**
   * Health check utility to verify API status seamlessly
   */
  public async healthCheck(): Promise<CJHealthCheck> {
    try {
      const token = await this.getValidToken().catch(() => this.accessToken);
      if (!token) throw new Error('No authentication token available.');

      const response = await fetch(`${this.baseURL}/category/list`, {
        method: 'GET',
        headers: {
          'CJ-Access-Token': token,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      return {
        status: data.code === 200 ? 'healthy' : 'unhealthy',
        connection: true,
        tokenValid: !!token,
        message: data.message || `Connected. Code: ${data.code}`,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        status: 'unhealthy',
        connection: false,
        tokenValid: false,
        message: error.message || 'Complete connection failure.',
        timestamp: new Date().toISOString()
      };
    }
  }
}

export const cjApi = new CJDropshippingAPI();
