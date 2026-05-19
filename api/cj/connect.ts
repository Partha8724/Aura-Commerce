/**
 * AURA COMMERCE - Serverless Connection Protocol
 * For Vercel hosting.
 * Completely self-contained to avoid Vercel TS compilation and relative path bundling issues.
 * Path: /api/cj/connect
 */

export default async function handler(req: any, res: any) {
  const timestamp = new Date().toISOString();

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
    const targetEmail = email || process.env.CJ_EMAIL;
    const targetApiKey = apiKey || process.env.CJ_API_KEY;

    if (!targetEmail) {
      return res.status(200).json({
        success: false,
        status: 'offline',
        message: 'CJ_EMAIL environment variable is missing. Please configure it in Vercel.',
        timestamp
      });
    }

    if (!targetApiKey) {
      return res.status(200).json({
        success: false,
        status: 'offline',
        message: 'API Authorisation Key is missing.',
        timestamp
      });
    }

    console.log(`[Serverless Handshake] Initiated verification for ${targetEmail}`);

    const baseRaw = process.env.CJ_BASE_URL || 'https://developers.cjdropshipping.com/api2.0/v1';
    const baseUrl = baseRaw.endsWith('/') ? baseRaw.slice(0, -1) : baseRaw;

    // STEP 1: Perform authentication handshake
    const authUrl = `${baseUrl}/authentication/getAccessToken`;
    console.log(`[Serverless Handshake] Handshaking via direct link to ${authUrl}`);
    
    let authData: any;
    try {
      const authResponse = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: targetEmail, password: targetApiKey }),
        signal: AbortSignal.timeout(15000)
      });

      if (!authResponse.ok) {
        return res.status(200).json({
          success: false,
          status: 'offline',
          message: `Authentication endpoint returned status ${authResponse.status}: ${authResponse.statusText}`,
          timestamp
        });
      }

      const text = await authResponse.text();
      try {
        authData = JSON.parse(text);
      } catch (e) {
        return res.status(200).json({
          success: false,
          status: 'offline',
          message: 'Received non-JSON response from authentication endpoint.',
          timestamp
        });
      }
    } catch (e: any) {
      return res.status(200).json({
        success: false,
        status: 'offline',
        message: `Authentication endpoint handshake timed out/failed: ${e.message}`,
        timestamp
      });
    }

    if (!authData || !authData.result || !authData.data?.accessToken) {
      return res.status(200).json({
        success: false,
        status: 'offline',
        message: authData?.message || 'Handshake failed: Invalid credentials provided.',
        timestamp,
        details: { code: authData?.code, handshake: false }
      });
    }

    const { accessToken } = authData.data;

    // STEP 2: Verify system health by performing a lightweight query
    const productListUrl = `${baseUrl}/product/list?pageNum=1&pageSize=1`;
    console.log(`[Serverless Handshake] Succeeded. Testing health via query to ${productListUrl}`);

    let healthData: any;
    try {
      const healthResponse = await fetch(productListUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'CJ-Access-Token': accessToken,
          'CJ-Api-Key': targetApiKey
        },
        signal: AbortSignal.timeout(15000)
      });

      if (!healthResponse.ok) {
        return res.status(200).json({
          success: false,
          status: 'offline',
          message: `Health check endpoint returned status ${healthResponse.status}: ${healthResponse.statusText}`,
          timestamp,
          details: { handshake: true, health: 'failed_http' }
        });
      }

      const text = await healthResponse.text();
      try {
        healthData = JSON.parse(text);
      } catch (e) {
        return res.status(200).json({
          success: false,
          status: 'offline',
          message: 'Received non-JSON response from health check endpoint.',
          timestamp,
          details: { handshake: true, health: 'failed_parse' }
        });
      }
    } catch (e: any) {
      return res.status(200).json({
        success: false,
        status: 'offline',
        message: `Health check endpoint query timed out/failed: ${e.message}`,
        timestamp,
        details: { handshake: true, health: 'failed_network' }
      });
    }

    const isOk = healthData?.code === 200 || healthData?.result === true;
    if (isOk) {
      return res.status(200).json({
        success: true,
        status: 'online',
        message: 'Aura-CJ Secure Bridge established successfully.',
        timestamp,
        details: { handshake: true, health: 'healthy' }
      });
    } else {
      return res.status(200).json({
        success: false,
        status: 'offline',
        message: healthData?.message || 'System online but health check protocol failed.',
        timestamp,
        details: { handshake: true, health: healthData?.status || 'unhealthy' }
      });
    }

  } catch (error: any) {
    console.error('[Serverless Handshake Fatal]', error.message);
    return res.status(200).json({
      success: false,
      status: 'offline',
      message: 'Aura Vercel Serverless Bridge Error: ' + error.message,
      timestamp
    });
  }
}
