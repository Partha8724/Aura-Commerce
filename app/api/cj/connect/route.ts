import { NextRequest, NextResponse } from 'next/server';
import { cjApi } from '../../../../src/lib/cj-api';

/**
 * Universal CJ Connection Route
 * This route verifies the CJ API connection and allows the UI to check status
 * without making direct brittle fetch calls.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiKey, accessToken, email } = body;

    console.log('[CJ Connect API]: Verification request received');

    // If providing new credentials for temporary test
    let currentApiKey = apiKey || process.env.CJ_API_KEY;
    const currentEmail = email || process.env.CJ_EMAIL;

    if (!currentApiKey || !currentEmail) {
      return NextResponse.json({
        success: false,
        message: 'Missing CJ credentials (Email or API Key) in environment or request.'
      }, { status: 400 });
    }

    // Step 1: Authenticate to get a fresh Access Token
    console.log('[CJ Connect API]: Attempting authentication for', currentEmail);
    const auth = await cjApi.getAccessToken(currentEmail, currentApiKey);

    if (!auth.result) {
      return NextResponse.json({
        success: false,
        message: 'CJ Authentication Failed: ' + (auth.message || 'Invalid credentials'),
        code: auth.code
      }, { status: 401 });
    }

    // Step 2: Use healthCheck to verify the new token works
    const health = await cjApi.healthCheck();

    if (health.status === 'healthy') {
      return NextResponse.json({
        success: true,
        message: 'Successfully connected to CJ Dropshipping API.',
        data: {
          timestamp: health.timestamp,
          tokenValid: health.tokenValid
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: health.message || 'Connection failed. Please verify your credentials.',
        diagnostics: health
      }, { status: 401 });
    }

  } catch (error: any) {
    console.error('[CJ Connect API] Error:', error.message);
    return NextResponse.json({
      success: false,
      message: 'Server Error: ' + error.message
    }, { status: 500 });
  }
}

/**
 * Optional GET to check current server-side status
 */
export async function GET() {
  try {
    const health = await cjApi.healthCheck();
    return NextResponse.json(health);
  } catch (error: any) {
    return NextResponse.json({ status: 'unhealthy', message: error.message }, { status: 500 });
  }
}
