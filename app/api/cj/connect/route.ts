import { NextRequest, NextResponse } from 'next/server';
import { validateCJConnection } from '../../../../src/lib/cj-connection-validator';

/**
 * Next.js API Route for connecting to CJ Dropshipping
 * POST /api/cj/connect
 */
export async function POST(req: NextRequest) {
  console.log('[CJ Connect API]: Connection request received');
  
  try {
    const body = await req.json();
    const { apiKey, email } = body;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        status: 'offline',
        message: 'No API Authorisation Key provided.'
      }, { status: 200 }); // Returning 200 as requested, body tells the result
    }

    // Use our validator utility
    const result = await validateCJConnection(apiKey, email);

    console.log(`[CJ Connect API]: Result - ${result.status} (${result.message})`);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[CJ Connect API Fatal]:', error.message);
    return NextResponse.json({
      success: false,
      status: 'offline',
      message: 'Internal Application Error: ' + error.message,
      timestamp: new Date().toISOString()
    }, { status: 200 });
  }
}
