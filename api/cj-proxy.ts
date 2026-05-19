/**
 * AURA COMMERCE - Serverless API Proxy for CJ Dropshipping
 * Avoids CORS violations in client browsers on Vercel deployment.
 * Path: /api/cj-proxy
 */
export default async function handler(req: any, res: any) {
  // Extract path and other query parameters
  const { path: cjPath, ...otherQueryParams } = req.query || {};

  if (!cjPath) {
    return res.status(400).json({ 
      code: 400, 
      message: "Missing CJ endpoint path after /api/cj-proxy/" 
    });
  }

  // Handle local proxy health check
  const subPathClean = Array.isArray(cjPath) ? cjPath.join('/') : cjPath;
  if (subPathClean === "health") {
    return res.status(200).json({ 
      status: "ok", 
      message: "CJ Proxy Serverless is successfully responding.",
      hasEnvKeys: !!(process.env.CJ_API_KEY || process.env.CJ_ACCESS_TOKEN)
    });
  }

  // Construct final query string for CJ API
  const searchParams = new URLSearchParams();
  Object.entries(otherQueryParams).forEach(([key, val]) => {
    if (Array.isArray(val)) {
      val.forEach(v => searchParams.append(key, v));
    } else if (val !== undefined && val !== null) {
      searchParams.append(key, val as string);
    }
  });

  const querySuffix = searchParams.toString();
  const queryString = querySuffix ? `?${querySuffix}` : '';

  const baseUrl = process.env.CJ_BASE_URL || "https://developers.cjdropshipping.com/api2.0/v1";
  
  // Clean baseURL
  let finalBase = baseUrl;
  if (finalBase.endsWith('/')) finalBase = finalBase.slice(0, -1);
  
  // Format adjusted path (ensure v1 is present but not duplicated)
  let adjustedPath = subPathClean;
  if (!adjustedPath.startsWith('v1/') && !finalBase.includes('/v1')) {
    adjustedPath = 'v1/' + adjustedPath;
  }
  
  const targetUrl = `${finalBase}/${adjustedPath}${queryString}`;

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Forward ALL incoming headers starting with cj- to propagate credentials
    Object.keys(req.headers).forEach(key => {
      const lowerKey = key.toLowerCase();
      if (lowerKey === "cj-access-token" || lowerKey === "cj-api-key" || lowerKey.startsWith("cj-")) {
        const parts = key.split('-');
        const normalizedKey = parts.map((part) => {
          if (part.toLowerCase() === 'cj') return 'CJ';
          return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        }).join('-');
        
        headers[normalizedKey] = req.headers[key] as string;
      }
    });

    // Fall back to server environment variables if matching headers are absent
    if (process.env.CJ_ACCESS_TOKEN && !headers["CJ-Access-Token"]) {
      headers["CJ-Access-Token"] = process.env.CJ_ACCESS_TOKEN;
    }
    if (process.env.CJ_API_KEY && !headers["CJ-Api-Key"]) {
      headers["CJ-Api-Key"] = process.env.CJ_API_KEY;
    }

    const fetchOptions: any = {
      method: req.method,
      headers: headers,
      signal: AbortSignal.timeout(15000)
    };

    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      let body = req.body;
      
      // Auto-inject default CJ email for credentials handshake
      if (adjustedPath.includes('authentication/getAccessToken')) {
        const bodyObj = typeof body === 'string' ? JSON.parse(body) : body;
        if (bodyObj && !bodyObj.email && process.env.CJ_EMAIL) {
          bodyObj.email = process.env.CJ_EMAIL;
          body = bodyObj;
        }
      }
      
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(response.status).json({ 
        code: response.status, 
        message: `CJ API returned a non-JSON response.`,
        raw: text.substring(0, 500)
      });
    }

    return res.status(response.status).json(data);
  } catch (error: any) {
    const isTimeout = error.name === 'AbortError' || error.message.includes('timeout');
    return res.status(isTimeout ? 504 : 500).json({ 
      code: isTimeout ? 504 : 500, 
      message: isTimeout ? "CJ API request timed out." : "Serverless Proxy networking error: " + error.message 
    });
  }
}
