import { NextResponse } from 'next/server';
import { cjApi } from '@/lib/cj-api'; // Assumes alias setup, adjust to relative if not: '../../../src/lib/cj-api'

/**
 * CJ Dropshipping Connection Test Endpoint
 * Path: /api/cj/test
 * 
 * Verifies base URL correctness, token generation, and data fetching capability.
 */
export async function GET() {
  console.log('[CJ Test Route]: Initiating health check...');
  
  try {
    // Step 1: Healthcheck which inherently tests the Access Token
    const healthStatus = await cjApi.healthCheck();
    
    if (healthStatus.status === 'unhealthy') {
      return NextResponse.json(
        {
          success: false,
          stage: 'Authentication / Healthcheck',
          error: healthStatus.message,
          resolution: 'Check your CJ_BASE_URL, CJ_EMAIL, and CJ_API_KEY environment variables.'
        },
        { status: 500 }
      );
    }

    // Step 2: Test product fetching (First 5 products)
    console.log('[CJ Test Route]: Token verified. Fetching initial products...');
    const productsResponse = await cjApi.getProducts(1, 5);

    // Step 3: Compile successful response
    return NextResponse.json({
      success: true,
      message: 'CJ Dropshipping API integration is fully operational.',
      diagnostics: {
        health: healthStatus,
        productFetchTest: {
          success: productsResponse.result,
          itemsFound: productsResponse.data?.list?.length || 0,
          totalAvailable: productsResponse.data?.total || 0,
          sampleProduct: productsResponse.data?.list?.[0]?.productNameEn || 'No products returned'
        }
      }
    });

  } catch (error: any) {
    console.error('[CJ Test Route Fatal]:', error.message);
    
    // Format error gracefully for browser readability
    return NextResponse.json(
      {
        success: false,
        stage: 'Execution',
        error: error.message,
        hint: error.message.includes('JSON') || error.message.includes('404')
          ? 'URL Routing Error: You are hitting an endpoint that does not exist. Verify CJ_BASE_URL.'
          : 'Check logs for missing permissions or network timeouts.'
      },
      { status: 500 }
    );
  }
}
