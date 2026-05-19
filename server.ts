import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";

import { syncSitemapToGoogle, startSearchConsoleSync } from "./src/services/searchConsoleSync";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());

  // Proxy for CJ Dropshipping API to avoid CORS issues
  app.use("/api/cj-proxy", async (req, res, next) => {
    // Determine the actual sub-path by removing the mount point
    // req.path is relative to /api/cj-proxy for this middleware
    const cjRelativePathWithLeadingSlash = req.path || "/";
    
    // Handle health check
    if (cjRelativePathWithLeadingSlash === "/health" || cjRelativePathWithLeadingSlash === "/health/") {
      console.log(`[CJ Proxy] Health check Success from ${req.ip}`);
      return res.json({ 
        status: "ok", 
        message: "CJ Proxy is successfully responding.",
        hasEnvKeys: !!(process.env.CJ_API_KEY && process.env.CJ_ACCESS_TOKEN)
      });
    }

    // Extract the portion of the path for CJ API (ensure no leading slash for construction)
    let cjPath = cjRelativePathWithLeadingSlash.replace(/^\//, "");
    
    if (!cjPath) {
       console.log("[CJ Proxy] Error: Missing path in " + req.originalUrl);
       return res.status(400).json({ code: 400, message: "Missing CJ endpoint path after /api/cj-proxy/" });
    }

    // Ensure cjPath includes 'v1/' prefix if not already present
    // Most CJ 2.0 endpoints are under /v1/
    if (!cjPath.startsWith('v1/')) {
      cjPath = 'v1/' + cjPath;
    }

    // Reconstruct the full target URL
    const queryString = req.url.includes("?") ? req.url.substring(req.url.indexOf("?")) : "";
    const targetUrl = `https://developers.cjdropshipping.com/api2.0/${cjPath}${queryString}`;
    
    console.log(`[CJ Proxy] ${req.method} ${req.originalUrl} -> ${targetUrl}`);
    
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Forward ALL cj-related headers
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
        fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
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

      res.status(response.status).json(data);
    } catch (error: any) {
      const isTimeout = error.name === 'AbortError' || error.message.includes('timeout');
      res.status(isTimeout ? 504 : 500).json({ 
        code: isTimeout ? 504 : 500, 
        message: isTimeout ? "CJ API request timed out." : "Proxy networking error: " + error.message 
      });
    }
  });

  // AliExpress Dropshipping Integration
  app.post("/api/supplier/connect-aliexpress", async (req, res) => {
    const { ali_app_key, ali_app_secret, ali_access_token } = req.body;

    if (!ali_app_key || !ali_app_secret || !ali_access_token) {
      return res.status(400).json({ 
        status: "error", 
        message: "Missing required fields: App Key, App Secret, and Access Token are all required." 
      });
    }

    try {
      // Import the service dynamically or at the top
      const { testAliExpressConnection } = await import("./src/services/aliexpress");
      const result = await testAliExpressConnection({ ali_app_key, ali_app_secret, ali_access_token });
      
      // In a real application, here you would persist these to your Supabase settings table
      // e.g., await supabase.from('settings').update({ value: { key, secret, token } }).eq('name', 'aliexpress_config')

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

  app.get("/api/supplier/aliexpress-item/:id", async (req, res) => {
    // This assumes keys are globally available or passed in (for simplicity we use env or req query in real scenarios)
    // For this blueprint, we'll use placeholder keys if not provided to demonstrate the flow
    const config = {
      ali_app_key: (req.query.key as string) || process.env.ALI_APP_KEY || "",
      ali_app_secret: (req.query.secret as string) || process.env.ALI_APP_SECRET || "",
      ali_access_token: (req.query.token as string) || process.env.ALI_ACCESS_TOKEN || ""
    };

    try {
       const { fetchAliExpressItem } = await import("./src/services/aliexpress");
       const item = await fetchAliExpressItem(req.params.id, config);
       res.json(item);
    } catch (error: any) {
       res.status(500).json({ status: "error", message: error.message });
    }
  });

  // SEO Generation Agent Endpoint
  app.post("/api/seo/generate", async (req, res) => {
    // ... logic
  });

  // Dynamic SEO Metadata Routes
  app.get("/robots.txt", async (req, res) => {
    try {
      const { default: robots } = await import("./app/robots");
      const rules = robots();
      let robotsTxt = "";
      
      const rulesArray = Array.isArray(rules.rules) ? rules.rules : rules.rules ? [rules.rules] : [];
      
      rulesArray.forEach(rule => {
        robotsTxt += `User-agent: ${Array.isArray(rule.userAgent) ? rule.userAgent.join(', ') : rule.userAgent}\n`;
        if (rule.allow) {
          const allows = Array.isArray(rule.allow) ? rule.allow : [rule.allow];
          allows.forEach(a => robotsTxt += `Allow: ${a}\n`);
        }
        if (rule.disallow) {
          const disallows = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow];
          disallows.forEach(d => robotsTxt += `Disallow: ${d}\n`);
        }
        robotsTxt += "\n";
      });

      if (rules.sitemap) {
        robotsTxt += `Sitemap: ${rules.sitemap}\n`;
      }

      res.type('text/plain').send(robotsTxt);
    } catch (error) {
      res.type('text/plain').send("User-agent: *\nAllow: /");
    }
  });

  app.get("/sitemap.xml", async (req, res) => {
    try {
      const { default: sitemap } = await import("./app/sitemap");
      const entries = await sitemap();
      
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      
      entries.forEach(entry => {
        xml += `  <url>\n`;
        xml += `    <loc>${entry.url}</loc>\n`;
        if (entry.lastModified) xml += `    <lastmod>${new Date(entry.lastModified).toISOString()}</lastmod>\n`;
        if (entry.changeFrequency) xml += `    <changefreq>${entry.changeFrequency}</changefreq>\n`;
        if (entry.priority) xml += `    <priority>${entry.priority}</priority>\n`;
        xml += `  </url>\n`;
      });
      
      xml += `</urlset>`;
      res.type('application/xml').send(xml);
    } catch (error) {
      res.status(500).send("Error generating sitemap");
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
    
    // Start SEO Background Agents
    startSearchConsoleSync();
  });
}

startServer();
