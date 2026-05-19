import { cjApi } from './cj-api';

export interface ConnectionResult {
  success: boolean;
  status: 'online' | 'offline';
  message: string;
  timestamp: string;
  details?: any;
}

/**
 * Validates the CJ Dropshipping connection by attempting authentication.
 * British English implementation.
 * 
 * @param apiKey The API Authorisation Key to test
 * @param email Optional email (defaults to CJ_EMAIL env var)
 */
export async function validateCJConnection(apiKey: string, email?: string): Promise<ConnectionResult> {
  const targetEmail = email || process.env.CJ_EMAIL;
  
  if (!targetEmail) {
    return {
      success: false,
      status: 'offline',
      message: 'CJ_EMAIL environment variable is missing in production settings.',
      timestamp: new Date().toISOString()
    };
  }

  if (!apiKey) {
    return {
      success: false,
      status: 'offline',
      message: 'API Authorisation Key is required for connection.',
      timestamp: new Date().toISOString()
    };
  }

  try {
    console.log(`[CJ Validator]: Handshaking for ${targetEmail}...`);
    
    // Step 1: Attempt authentication
    const auth = await cjApi.authenticate(targetEmail, apiKey);
    
    if (!auth.result) {
      return {
        success: false,
        status: 'offline',
        message: auth.message || 'Authorisation failed: Invalid credentials provided.',
        timestamp: new Date().toISOString(),
        details: { code: auth.code }
      };
    }

    // Step 2: Verify token works with a lightweight health check
    const health = await cjApi.healthCheck();
    
    if (health.status === 'healthy') {
      return {
        success: true,
        status: 'online',
        message: 'Aura Secure Bridge established. Master Supplier is online.',
        timestamp: new Date().toISOString(),
        details: {
          tokenValid: true,
          health: health.status
        }
      };
    } else {
      return {
        success: false,
        status: 'offline',
        message: health.message || 'Handshake successful but system check failed.',
        timestamp: new Date().toISOString()
      };
    }
  } catch (error: any) {
    console.error('[CJ Validator] Exception:', error.message);
    return {
      success: false,
      status: 'offline',
      message: `Network Error: ${error.message}. This may be a proxy routing issue.`,
      timestamp: new Date().toISOString()
    };
  }
}
