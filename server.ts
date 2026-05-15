import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());

  // Proxy for CJ Dropshipping API to avoid CORS issues
  app.all("/api/cj-proxy/*", async (req, res) => {
    const path = req.params[0] || "";
    const queryString = req.url.includes("?") ? req.url.split("?")[1] : "";
    const targetUrl = `https://developers.cjdropshipping.com/api2.0/v1/${path}${queryString ? "?" + queryString : ""}`;
    
    console.log(`[CJ Proxy] ${req.method} -> ${targetUrl}`);
    
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Forward ALL cj-related headers (case-insensitive check)
      Object.keys(req.headers).forEach(key => {
        if (key.toLowerCase() === "cj-access-token") {
          headers["CJ-Access-Token"] = req.headers[key] as string;
        }
      });

      const fetchOptions: any = {
        method: req.method,
        headers: headers,
      };

      if (["POST", "PUT", "PATCH"].includes(req.method)) {
        fetchOptions.body = JSON.stringify(req.body);
      }

      const response = await fetch(targetUrl, fetchOptions);
      const text = await response.text();
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("[CJ Proxy] Failed to parse JSON response:", text);
        return res.status(500).json({ code: 500, message: "Invalid JSON from CJ API" });
      }

      res.status(response.status).json(data);
    } catch (error: any) {
      console.error("[CJ Proxy Error]:", error.message);
      res.status(500).json({ code: 500, message: "Proxy error: " + error.message });
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
