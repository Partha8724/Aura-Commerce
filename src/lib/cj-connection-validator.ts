import { cjApi } from './cj-api';

export interface ConnectionResult {
  success: boolean;
  status: 'online' | 'offline';
  message: string;
  timestamp: string;
  details?: any;
}

/**
 * Standalone validation utility for CJ Dropshipping connection.
 * Tests the API key by attempting to authenticate with the CJ API.
 */
export async function validateCJConnection(apiKey: string, email?: string): Promise<ConnectionResult> {
  const targetEmail = email || process.env.CJ_EMAIL;
  
  if (!targetEmail) {
    return {
      success: false,
      status: 'offline',
      message: 'CJ_EMAIL environment variable is missing.',
      timestamp: new Date().toISOString()
    };
  }

  if (!apiKey) {
    return {
      success: false,
      status: 'offline',
      message: 'API Key is required for connection.',
      timestamp: new Date().toISOString()
    };
  }

  try {
    console.log(`[CJ Validator]: Verifying connection for ${targetEmail}...`);
    
    // Step 1: Attempt to get a fresh access token
    const auth = await cjApi.getAccessToken(targetEmail, apiKey);
    
    if (!auth.result) {
      return {
        success: false,
        status: 'offline',
        message: auth.message || 'Authentication failed: Invalid credentials.',
        timestamp: new Date().toISOString(),
        details: { code: auth.code }
      };
    }

    // Step 2: Running health check to verify token usability
    const health = await cjApi.healthCheck();
    
    if (health.status === 'healthy') {
      return {
        success: true,
        status: 'online',
        message: 'Aura-CJ Secure Bridge established successfully.',
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
        message: health.message || 'Health check failed after authentication.',
        timestamp: new Date().toISOString()
      };
    }
  } catch (error: any) {
    console.error('[CJ Validator] Error:', error.message);
    return {
      success: false,
      status: 'offline',
      message: `Network Error: ${error.message}`,
      timestamp: new Date().toISOString()
    };
  }
}
