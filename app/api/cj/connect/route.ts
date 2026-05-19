import { NextRequest, NextResponse } from 'next/server';
import { cjApi } from '../../../../src/lib/cj-api';

/**
 * AURA COMMERCE - CJ Connection Protocol
 * This route bypasses the legacy Aura Gateway and performs a direct handshake.
 * Path: /api/cj/connect
 */
export async function POST(req: NextRequest) {
  const timestamp = new Date().toISOString();
  console.log(`[CJ Connect] Handshake initiated at ${timestamp}`);

  try {
    const body = await req.json();
    const { apiKey, email } = body;

    // Use environment variables if not provided in body (security fallback)
    const targetEmail = email || process.env.CJ_EMAIL;
    const targetApiKey = apiKey || process.env.CJ_API_KEY;

    if (!targetEmail || !targetApiKey) {
      console.warn('[CJ Connect] Missing credentials for handshake');
      return NextResponse.json({
        success: false,
        status: 'offline',
        message: 'Handshake failed: Missing credentials in environment or request.',
        timestamp
      });
    }

    // Step 1: Attempt Authentication Handshake
    console.log(`[CJ Connect] Attempting authorisation for ${targetEmail}...`);
    const auth = await cjApi.authenticate(targetEmail, targetApiKey);

    if (!auth.result) {
      console.error(`[CJ Connect] Authorisation denied: ${auth.message}`);
      return NextResponse.json({
        success: false,
        status: 'offline',
        message: auth.message || 'Authorisation failed: Access keys rejected by Master Supplier.',
        timestamp
      });
    }

    // Step 2: System Health Verification
    console.log('[CJ Connect] Handshake successful. Verifying system health...');
    const health = await cjApi.healthCheck();

    if (health.status === 'healthy') {
      console.log('[CJ Connect] Secure Bridge Established');
      return NextResponse.json({
        success: true,
        status: 'online',
        message: 'Aura Secure Bridge established. Master Supplier is online.',
        timestamp,
        details: { version: '2.0', protocol: 'direct' }
      });
    } else {
      console.warn('[CJ Connect] System health check failed after handshake');
      return NextResponse.json({
        success: false,
        status: 'offline',
        message: health.message || 'Handshake succeeded but health check protocol timed out.',
        timestamp
      });
    }
  } catch (error: any) {
    console.error(`[CJ Connect] Critical Protocol Error: ${error.message}`);
    return NextResponse.json({
      success: false,
      status: 'offline',
      message: `Gateway unreachable: ${error.message}. Network link unstable.`,
      timestamp
    });
  }
}
