export class CJDropshippingAPI {
  // Use local proxy to avoid CORS issues
  baseURL = '/api/cj-proxy';
  accessToken: string | null = null;
  tokenExpiry: Date | null = null;
  apiKey: string | null = null;

  async checkDirectConnection(accessToken: string, apiKey?: string) {
    try {
      // First check if proxy is reachable
      const proxyCheck = await fetch(`${this.baseURL}/health`, { method: 'GET' }).catch(() => null);
      if (proxyCheck && proxyCheck.status === 404) {
        // Proxy exists but health endpoint might not, continue
      } else if (!proxyCheck) {
        return { success: false, error: 'Proxy server unreachable. Please check backend.' };
      }

      const response = await fetch(`${this.baseURL}/product/getCategory`, {
        method: 'GET',
        headers: {
          'CJ-Access-Token': accessToken,
          ...(apiKey ? { 'CJ-Api-Key': apiKey } : {}),
          'Content-Type': 'application/json'
        }
      });
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        return { success: false, error: 'Response is not valid JSON. Possible proxy or API issue.' };
      }
      
      if (data.code === 200) {
        this.accessToken = accessToken;
        this.tokenExpiry = new Date(Date.now() + 86400000); // 24h
        return { success: true };
      } else if (data.code === 1600001) {
        return { success: false, error: 'Invalid or expired Access Token (Error 1600001)' };
      } else if (data.code === 1600005) {
        return { success: false, error: 'Invalid API Key (Error 1600005)' };
      } else if (data.code === 1600200) {
        return { success: false, error: 'CJ API Rate Limit exceeded. Try again in 1 minute.' };
      } else {
        return { success: false, error: data.message || `CJ Error (${data.code}): Connection test failed.` };
      }
    } catch (error: any) {
      return { success: false, error: `Network error: ${error.message}` };
    }
  }

  async getAccessToken(email: string, password: string) {
    try {
      const response = await fetch(`${this.baseURL}/authentication/getAccessToken`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.code === 200 && data.data && data.data.accessToken) {
        this.accessToken = data.data.accessToken;
        this.tokenExpiry = new Date(data.data.accessTokenExpiry || Date.now() + 86400000);
        return { success: true, token: this.accessToken };
      }
      throw new Error(data.message || 'Failed to get access token');
    } catch (error: any) {
      console.error('CJ Auth Error:', error);
      return { success: false, error: error.message };
    }
  }

  async getProductByUrl(url: string) {
    if (!this.accessToken) throw new Error('Not authenticated with CJ');
    
    // Extract PID from URL if possible
    // Example: https://cjdropshipping.com/product/...-p-1582260655964893184.html
    const pidMatch = url.match(/-p-(\d+)\.html/);
    const pid = pidMatch ? pidMatch[1] : url; // If not a URL, assume it might be a PID

    const endpoint = pidMatch ? '/product/details' : '/product/list';
    const method = pidMatch ? 'GET' : 'POST';
    const queryParams = pidMatch ? `?pid=${pid}` : '';
    
    const response = await fetch(`${this.baseURL}${endpoint}${queryParams}`, {
      method,
      headers: {
        'CJ-Access-Token': this.accessToken,
        ...(this.apiKey ? { 'CJ-Api-Key': this.apiKey } : {}),
        'Content-Type': 'application/json'
      },
      ...(method === 'POST' ? { body: JSON.stringify({ productName: url }) } : {})
    });

    const data = await response.json();
    if (data.code === 200) {
      if (pidMatch) return data.data;
      if (data.data.list && data.data.list.length > 0) return data.data.list[0];
      throw new Error('No products found matching that criteria.');
    }
    
    // Better error mapping
    if (data.code === 1600101) throw new Error('API Interface not found. The endpoint path might be updated or incorrect.');
    throw new Error(data.message || `CJ Error (${data.code}): Failed to fetch product`);
  }

  async getTracking(orderId: string) {
    if (!this.accessToken) throw new Error('Not authenticated with CJ');
    const response = await fetch(`${this.baseURL}/order/getTrackingDetail?orderId=${orderId}`, {
      method: 'GET',
      headers: {
        'CJ-Access-Token': this.accessToken,
        ...(this.apiKey ? { 'CJ-Api-Key': this.apiKey } : {}),
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (data.code === 200) return data.data;
    throw new Error(data.message || 'Failed to get tracking');
  }
}

export const cjApi = new CJDropshippingAPI();
