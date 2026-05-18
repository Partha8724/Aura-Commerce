import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());

  // Proxy for CJ Dropshipping API to avoid CORS issues
  app.use("/api/cj-proxy", async (req, res, next) => {
    // Handle health check
    if (req.path === "/health" || req.url === "/health") {
      console.log("[CJ Proxy] Health check Success");
      return res.json({ 
        status: "ok", 
        message: "CJ Proxy is active",
        hasEnvKeys: !!(process.env.CJ_API_KEY && process.env.CJ_ACCESS_TOKEN)
      });
    }

    // Extract the portion of the path after /api/cj-proxy
    // req.path in app.use("/api/cj-proxy") will be the subpath (e.g., "/product/getCategory")
    const cjPath = (req.path || "").replace(/^\//, "");
    
    if (!cjPath) {
       console.log("[CJ Proxy] Error: Missing path");
       return res.status(400).json({ code: 400, message: "Missing CJ endpoint path after /api/cj-proxy/" });
    }

    const queryString = req.url.includes("?") ? req.url.split("?")[1] : "";
    
    // Using .com as it's the standard global endpoint
    const targetUrl = `https://developers.cjdropshipping.com/api2.0/v1/${cjPath}${queryString ? "?" + queryString : ""}`;
    
    console.log(`[CJ Proxy] Requesting: ${req.method} -> ${targetUrl}`);
    
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Forward ALL cj-related headers (case-insensitive check)
      Object.keys(req.headers).forEach(key => {
        const lowerKey = key.toLowerCase();
        if (lowerKey === "cj-access-token" || lowerKey === "cj-api-key" || lowerKey.startsWith("cj-")) {
          // Normalize header name for CJ API
          const parts = key.split('-');
          const normalizedKey = parts.map((part) => {
            if (part.toLowerCase() === 'cj') return 'CJ';
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
          }).join('-');
          headers[normalizedKey] = req.headers[key] as string;
        }
      });

      // SECURE INJECTION: If keys are in environment, use them as defaults/overrides
      if (process.env.CJ_ACCESS_TOKEN && !headers["CJ-Access-Token"]) {
        headers["CJ-Access-Token"] = process.env.CJ_ACCESS_TOKEN;
      }
      if (process.env.CJ_API_KEY && !headers["CJ-Api-Key"]) {
        headers["CJ-Api-Key"] = process.env.CJ_API_KEY;
      }

      console.log(`[CJ Proxy] Active headers:`, Object.keys(headers).filter(h => h.startsWith('CJ-')));

      const fetchOptions: any = {
        method: req.method,
        headers: headers,
        // Ensure we don't hang too long
        signal: AbortSignal.timeout(15000)
      };

      if (["POST", "PUT", "PATCH"].includes(req.method)) {
        fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      }

      const response = await fetch(targetUrl, fetchOptions);
      const text = await response.text();
      
      console.log(`[CJ Proxy] CJ Backend Response Status: ${response.status}`);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("[CJ Proxy] Non-JSON response from CJ. Status:", response.status);
        console.error("[CJ Proxy] Response Snippet:", text.substring(0, 200));
        
        // Return a JSON error to the client even if the backend didn't
        return res.status(response.status).json({ 
          code: response.status, 
          message: `CJ API returned a non-JSON response with status ${response.status}.`,
          raw: text.substring(0, 500)
        });
      }

      res.status(response.status).json(data);
    } catch (error: any) {
      const isTimeout = error.name === 'AbortError' || error.message.includes('timeout');
      console.error("[CJ Proxy Error]:", error.message);
      res.status(isTimeout ? 504 : 500).json({ 
        code: isTimeout ? 504 : 500, 
        message: isTimeout ? "CJ API request timed out." : "Proxy networking error: " + error.message 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
