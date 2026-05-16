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

  app.all(/^\/api\/cj-proxy\/(.*)/, async (req, res) => {
    const cjPath = req.params[0] || "";
    const queryString = req.url.includes("?") ? req.url.split("?")[1] : "";
    const targetUrl = `https://developers.cjdropshipping.com/api2.0/v1/${cjPath}${queryString ? "?" + queryString : ""}`;
    
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
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("[CJ Proxy] Failed to parse JSON response:", text);
        return res.status(200).json({ 
          code: 500, 
          message: "CJ API returned non-JSON response. Check your credentials or rate limits.",
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
