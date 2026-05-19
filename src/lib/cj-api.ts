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
 */
class CJApiClient {
  private baseUrl: string;
  private email: string;
  private apiKey: string;
  private cachedAccessToken: string | null = null;
  private cachedRefreshToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.baseUrl = process.env.CJ_BASE_URL || 'https://developers.cjdropshipping.com/api2.0/v1';
    this.email = process.env.CJ_EMAIL || '';
    this.apiKey = process.env.CJ_API_KEY || '';

    if (process.env.CJ_ACCESS_TOKEN) {
      this.cachedAccessToken = process.env.CJ_ACCESS_TOKEN;
      this.tokenExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
    }

    console.log('✅ CJ API Client initialised');
    console.log('📡 Base URL:', this.baseUrl);
    console.log('📧 Email:', this.email ? 'Set' : 'MISSING');
    console.log('🔑 API Key:', this.apiKey ? 'Set' : 'MISSING');
  }

  private async fetchWithRetry(
    endpoint: string,
    options: RequestInit = {},
    retries = 3,
    delay = 1000
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
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
      console.log(`📡 [CJ API] ${options.method || 'GET'} ${url}`);

      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      const responseText = await response.text();

      // Handle HTML error pages
      if (responseText.trim().startsWith('<!') || responseText.trim().startsWith('<html')) {
        throw new Error(
          `Connection Error: Response is not valid JSON. Status: ${response.status}. Ensure the endpoint URL is correct.`
        );
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        console.error(`[CJ API] Failed to parse JSON. Raw:`, responseText.substring(0, 200));
        throw new Error(`Invalid JSON response from CJ API`);
      }

      if (data.code && data.code !== 200) {
        throw new Error(`CJ API Error ${data.code}: ${data.message || 'Unknown error'}`);
      }

      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (retries > 0 && !error.message.includes('Invalid JSON') && !error.message.includes('HTML')) {
        console.warn(`[CJ API] Retrying... (${retries} attempts left)`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.fetchWithRetry(endpoint, options, retries - 1, delay);
      }

      throw error;
    }
  }

  public async getAccessToken(): Promise<string> {
    if (this.cachedAccessToken && Date.now() < this.tokenExpiry - 300000) {
      console.log('✅ Using cached CJ access token');
      return this.cachedAccessToken;
    }

    console.log('🔑 Fetching new CJ access token...');

    const data: CJAuthResponse = await this.fetchWithRetry('/authentication/getAccessToken', {
      method: 'POST',
      body: JSON.stringify({
        email: this.email,
        password: this.apiKey,
      }),
    });

    if (data.result && data.data?.accessToken) {
      this.cachedAccessToken = data.data.accessToken;
      this.cachedRefreshToken = data.data.refreshToken;

      try {
        this.tokenExpiry = new Date(data.data.accessTokenExpiryDate).getTime();
      } catch {
        this.tokenExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
      }

      console.log('✅ CJ access token obtained');
      return this.cachedAccessToken;
    }

    throw new Error('Failed to obtain CJ access token');
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.getAccessToken();
    return { 'CJ-Access-Token': token };
  }

  public async getProducts(page = 1, pageSize = 20): Promise<CJProductListResponse> {
    const headers = await this.getAuthHeaders();
    return this.fetchWithRetry(`/product/list?pageNum=${page}&pageSize=${pageSize}`, {
      method: 'GET',
      headers,
    });
  }

  public async getProductDetail(pid: string): Promise<{ result: boolean; data: CJProduct; message: string }> {
    const headers = await this.getAuthHeaders();
    return this.fetchWithRetry(`/product/query?pid=${pid}`, {
      method: 'GET',
      headers,
    });
  }

  public async getCategories(): Promise<CJCategoryResponse> {
    const headers = await this.getAuthHeaders();
    return this.fetchWithRetry('/category/list', {
      method: 'GET',
      headers,
    });
  }

  public async createOrder(orderData: CJOrderRequest): Promise<CJOrderResponse> {
    const headers = await this.getAuthHeaders();
    return this.fetchWithRetry('/order/create', {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData),
    });
  }

  public async getOrders(page = 1, pageSize = 20): Promise<any> {
    const headers = await this.getAuthHeaders();
    return this.fetchWithRetry(`/order/list?pageNum=${page}&pageSize=${pageSize}`, {
      method: 'GET',
      headers,
    });
  }

  public async getShippingMethods(countryCode = 'GB'): Promise<CJShippingResponse> {
    const headers = await this.getAuthHeaders();
    return this.fetchWithRetry(`/shipping/list?countryCode=${countryCode}`, {
      method: 'GET',
      headers,
    });
  }

  public async healthCheck(): Promise<CJHealthCheck> {
    try {
      const token = await this.getAccessToken();
      const categories = await this.getCategories();

      return {
        status: 'healthy',
        connection: true,
        tokenValid: !!token,
        message: `Connected. Found ${categories.data?.length || 0} categories.`,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        status: 'unhealthy',
        connection: false,
        tokenValid: false,
        message: error.message || 'Connection failure',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export const cjApi = new CJApiClient();
