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
  app.get("/api/cj-proxy/health", (req, res) => {
    res.json({ 
      status: "ok", 
      message: "CJ Proxy is active",
      hasEnvKeys: !!(process.env.CJ_API_KEY && process.env.CJ_ACCESS_TOKEN)
    });
  });

  // Use a more robust route pattern for the proxy
  app.all("/api/cj-proxy/*", async (req, res) => {
    // Skip if it's health (already handled above, but just in case)
    if (req.path === "/api/cj-proxy/health") return;

    // Extract the portion of the path after /api/cj-proxy/
    const cjPath = req.path.replace(/^\/api\/cj-proxy\//, "");
    
    if (!cjPath) {
       return res.status(400).json({ code: 400, message: "Missing CJ endpoint path after /api/cj-proxy/" });
    }

    const queryString = req.url.includes("?") ? req.url.split("?")[1] : "";
    
    // Using .cn which is often more stable for their API documentation links
    const targetUrl = `https://developers.cjdropshipping.cn/api2.0/v1/${cjPath}${queryString ? "?" + queryString : ""}`;
    
    console.log(`[CJ Proxy] ${req.method} -> ${targetUrl}`);
    
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Forward ALL cj-related headers (case-insensitive check)
      Object.keys(req.headers).forEach(key => {
        if (key.toLowerCase().startsWith("cj-")) {
          const parts = key.split('-');
          const normalizedKey = parts.map((part, index) => {
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

      const fetchOptions: any = {
        method: req.method,
        headers: headers,
      };

      if (["POST", "PUT", "PATCH"].includes(req.method)) {
        fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      }

      const response = await fetch(targetUrl, fetchOptions);
      const text = await response.text();
      
      console.log(`[CJ Proxy] Output Status: ${response.status}`);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("[CJ Proxy] Failed to parse JSON response:", text);
        // If it's a 404 HTML from CJ, we should still return the status code properly
        if (response.status === 404) {
          return res.status(404).json({
            code: 404,
            message: "CJ Endpoint not found on their server. (Non-JSON 404 response)",
            targetUrl
          });
        }
        return res.status(response.status).json({ 
          code: 500, 
          message: "CJ API returned non-JSON response. status: " + response.status,
          raw: text.substring(0, 500)
        });
      }

      res.status(response.status).json(data);
    } catch (error: any) {
      console.error("[CJ Proxy Error]:", error.message);
      res.status(500).json({ code: 500, message: "Proxy networking error: " + error.message });
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
