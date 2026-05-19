import { validateCJConnection } from '../../src/lib/cj-connection-validator';

/**
 * AURA COMMERCE - Serverless Connection Protocol
 * For Vercel hosting.
 * Path: /api/cj/connect
 */
export default async function handler(req: any, res: any) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ 
      success: false, 
      message: `Method ${req.method} Not Allowed` 
    });
  }

  try {
    const { apiKey, email } = req.body || {};
    
    console.log('[Serverless Handshake] Initiated connection check');
    const result = await validateCJConnection(apiKey, email);
    
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('[Serverless Handshake Fatal]', error.message);
    return res.status(200).json({
      success: false,
      status: 'offline',
      message: 'Aura Vercel Serverless Bridge Error: ' + error.message,
      timestamp: new Date().toISOString()
    });
  }
}
