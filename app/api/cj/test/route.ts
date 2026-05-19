import { NextResponse } from 'next/server';
import { cjApi } from '../../../src/lib/cj-api';

export async function GET() {
  console.log('🧪 Testing CJ Dropshipping connection...');

  const result = await cjApi.healthCheck();

  console.log('📋 CJ Health Check Result:', result);

  return NextResponse.json(result, {
    status: result.status === 'healthy' ? 200 : 500,
  });
}
