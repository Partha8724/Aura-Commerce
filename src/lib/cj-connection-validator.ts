import { cjApi } from './cj-api';

/**
 * Connection result interface
 */
export interface ConnectionResult {
  success: boolean;
  status: 'online' | 'offline';
  message: string;
  timestamp: string;
  details?: {
    handshake?: boolean;
    health?: string;
    code?: number;
    accessToken?: string;
    refreshToken?: string;
  };
}

/**
 * Validates the CJ Dropshipping connection by testing credentials.
 * This utility works both in the UI and in API routes.
 */
export async function validateCJConnection(apiKey: string, email?: string): Promise<ConnectionResult> {
  const targetEmail = email || process.env.CJ_EMAIL;
  const timestamp = new Date().toISOString();

  if (!targetEmail) {
    return {
      success: false,
      status: 'offline',
      message: 'CJ_EMAIL environment variable is missing. Please configure it in Vercel.',
      timestamp
    };
  }

  if (!apiKey) {
    return {
      success: false,
      status: 'offline',
      message: 'API Authorisation Key is missing.',
      timestamp
    };
  }

  console.log(`[CJ Validator]: Initialising Handshake for ${targetEmail}...`);

  try {
    // 1. Perform authentication handshake
    const auth = await cjApi.authenticate(targetEmail, apiKey);
    
    if (!auth.result) {
      return {
        success: false,
        status: 'offline',
        message: auth.message || 'Handshake failed: Invalid credentials provided.',
        timestamp,
        details: { code: auth.code, handshake: false }
      };
    }

    // 2. Perform health check to verify endpoint reachability
    const health = await cjApi.healthCheck();
    
    if (health.status === 'healthy') {
      return {
        success: true,
        status: 'online',
        message: 'Aura-CJ Secure Bridge established successfully.',
        timestamp,
        details: { 
          handshake: true, 
          health: 'healthy',
          accessToken: cjApi.accessToken || undefined,
          refreshToken: cjApi.refreshToken || undefined
        }
      };
    } else {
      return {
        success: false,
        status: 'offline',
        message: health.message || 'System online but health check protocol failed.',
        timestamp,
        details: { handshake: true, health: health.status }
      };
    }
  } catch (error: any) {
    console.error('[CJ Validator] Protocol Error:', error.message);
    return {
      success: false,
      status: 'offline',
      message: `Network Error: ${error.message}. Ensure CJ_BASE_URL is correct.`,
      timestamp
    };
  }
}
