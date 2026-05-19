import {
  CJAuthResponse,
  CJProductListResponse,
  CJProduct,
  CJCategoryResponse,
  CJOrderRequest,
  CJOrderResponse,
  CJShippingResponse,
  CJHealthCheck
} from './cj-types';

/**
 * CJ Dropshipping API Client
 * Built for AURA COMMERCE - UK Market
 * Handles authentication caching, retries, and error normalisation.
 */
class CJApiClient {
  private baseUrl: string;
  private email: string;
  private apiKey: string;
  
  // In-memory token storage (cached across requests during server lifetime)
  private cachedAccessToken: string | null = null;
  private cachedRefreshToken: string | null = null;
  private tokenExpiry: number = 0; // Unix timestamp in milliseconds

  constructor() {
    // Fallback deliberately implemented to prevent Cause 5 (Missing Env Variable 404s)
    this.baseUrl = process.env.CJ_BASE_URL || 'https://developers.cjdropshipping.com/api2.0/v1';
    this.email = process.env.CJ_EMAIL || '';
    this.apiKey = process.env.CJ_API_KEY || '';
    
    // Seed with explicitly provided token if available
    if (process.env.CJ_ACCESS_TOKEN) {
      this.cachedAccessToken = process.env.CJ_ACCESS_TOKEN;
      // Optimistically assume it's valid for 30 days if seeded via ENV
      this.tokenExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000; 
    }
  }

  /**
   * Internal fetch wrapper handling Retries, Timeouts, and Error Parsing
   */
  private async fetchWithRetry(
    endpoint: string,
    options: RequestInit = {},
    retries = 3,
    delay = 1000
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Create AbortController for 15-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    const fetchOptions: RequestInit = {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      console.log(`[CJ API Debug]: Calling ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      const responseText = await response.text();

      // Detect if response is HTML/404 instead of JSON (Common CJ error)
      if (!response.ok && responseText.trim().startsWith('<')) {
        throw new Error(
          `Connection Error: Response is not valid JSON. Status: ${response.status}. Raw HTML parsed.`
        );
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error(`[CJ API Parse Error]: Failed to parse JSON from ${url}. Raw Response:`, responseText.substring(0, 200));
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
      }

      // If CJ returns a specific failure code but the HTTP status is 200 
      // (CJ often returns 200 OK but code !== 200 in the body)
      if (data.code && data.code !== 200) {
        throw new Error(`CJ API Error ${data.code}: ${data.message || 'Unknown error'}`);
      }

      return data;

    } catch (error: any) {
      clearTimeout(timeoutId);
      
      const isAbortError = error.name === 'AbortError' || error.message.includes('timeout');
      
      if (retries > 0) {
        console.warn(`[CJ API Retry]: Request failed (${error.message}). Retrying in ${delay}ms... (${retries} attempts left)`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.fetchWithRetry(endpoint, options, retries - 1, delay);
      }

      console.error(`[CJ API Fatal]: Request failed completely after retries. ${error.message}`);
      throw error;
    }
  }

  /**
   * Retrieves an Access Token, generating a new one if expired.
   */
  public async getAccessToken(): Promise<string> {
    // Return cached token if valid (with 5-minute safety buffer)
    if (this.cachedAccessToken && Date.now() < this.tokenExpiry - 300000) {
      return this.cachedAccessToken;
    }

    console.log('[CJ API Auth]: Fetching new access token...');
    
    const body = JSON.stringify({
      email: this.email,
      password: this.apiKey, // Assuming apiKey functions as the password/secret in standard API integration
    });

    const data: CJAuthResponse = await this.fetchWithRetry('/authentication/getAccessToken', {
      method: 'POST',
      body,
    });

    if (data.result && data.data?.accessToken) {
      this.cachedAccessToken = data.data.accessToken;
      this.cachedRefreshToken = data.data.refreshToken;
      
      // Parse dates safely. If failed, default to 30 days
      try {
        this.tokenExpiry = new Date(data.data.accessTokenExpiryDate).getTime();
      } catch (e) {
        this.tokenExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
      }
      
      console.log('[CJ API Auth]: Successfully obtained new access token.');
      return this.cachedAccessToken;
    }

    throw new Error('Failed to obtain access token from CJ API.');
  }

  /**
   * Helper to append auth token to headers
   */
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await this.getAccessToken();
    return {
      'CJ-Access-Token': token,
    };
  }

  /**
   * Get product list
   */
  public async getProducts(page: number = 1, pageSize: number = 20): Promise<CJProductListResponse> {
    const headers = await this.getAuthHeaders();
    // CJ uses a POST request for fetching list based on query parameters usually, OR a GET with query string
    // Assuming standard GET with query parameters per requirements, though CJ often uses POST for complex filters
    return this.fetchWithRetry(`/product/list?pageNum=${page}&pageSize=${pageSize}`, {
      method: 'GET',
      headers,
    });
  }

  /**
   * Get detailed information for a specific product
   */
  public async getProductDetail(pid: string): Promise<{ result: boolean; data: CJProduct; message: string }> {
    const headers = await this.getAuthHeaders();
    return this.fetchWithRetry(`/product/query?pid=${pid}`, {
      method: 'GET',
      headers,
    });
  }

  /**
   * Get all product categories
   */
  public async getCategories(): Promise<CJCategoryResponse> {
    const headers = await this.getAuthHeaders();
    return this.fetchWithRetry('/category/list', {
      method: 'GET',
      headers,
    });
  }

  /**
   * Create an order for dropshipping fulfilment
   */
  public async createOrder(orderData: CJOrderRequest): Promise<CJOrderResponse> {
    const headers = await this.getAuthHeaders();
    return this.fetchWithRetry('/order/create', {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData),
    });
  }

  /**
   * Get a list of active orders
   */
  public async getOrders(page: number = 1, pageSize: number = 20): Promise<any> {
    const headers = await this.getAuthHeaders();
    return this.fetchWithRetry(`/order/list?pageNum=${page}&pageSize=${pageSize}`, {
      method: 'GET',
      headers,
    });
  }

  /**
   * Get available shipping methods for a given country (e.g., 'GB' for United Kingdom)
   */
  public async getShippingMethods(countryCode: string = 'GB', startAddress: string = 'China'): Promise<CJShippingResponse> {
    const headers = await this.getAuthHeaders();
    // Path might vary based on CJ docs, commonly it requires start country and destination country
    return this.fetchWithRetry(`/shipping/list?startCountryCode=${startAddress}&countryCode=${countryCode}`, {
      method: 'GET',
      headers,
    });
  }

  /**
   * Health check utility to verify API status seamlessly
   */
  public async healthCheck(): Promise<CJHealthCheck> {
    try {
      const token = await this.getAccessToken();
      const categories = await this.getCategories();
      
      return {
        status: 'healthy',
        connection: true,
        tokenValid: !!token,
        message: `Successfully connected. Fetched ${categories.data?.length || 0} categories.`,
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

// Export a singleton instance for global use throughout Next.js
export const cjApi = new CJApiClient();
