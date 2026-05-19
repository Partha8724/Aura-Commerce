# CJ DROPSHIPPING INTEGRATION VERIFICATION CHECKLIST

## 1. FILE SYSTEM AUDIT
- [x] **src/lib/cj-api.ts**: Singleton exported. Base URL configured for both browser (proxy) and server (direct).
- [x] **server.ts**: Express proxy simplified. No more complex v1 logic that causes 404s.
- [x] **src/lib/cj-connection-validator.ts**: Server-side logic for rigorous handshaking.
- [x] **app/api/cj/connect/route.ts**: Dedicated connection endpoint for the UI.
- [x] **src/components/Tabs/AdminTab.tsx**: UI updated to use /api/cj/connect and provide detailed logs.

## 2. CONFIGURATION (VERCEL/ENV)
- Ensure the following variables are set in Vercel:
  - `CJ_BASE_URL`: `https://developers.cjdropshipping.com/api2.0/v1`
  - `CJ_EMAIL`: Your CJ registered email
  - `CJ_API_KEY`: Your CJ API Key (from CJ Dashboard)

## 3. FUNCTIONAL TESTING
1. **Health Check**: Visit `https://your-app.vercel.app/api/cj/test`. It should return `success: true`.
2. **UI Connection**: 
   - Open the Admin Panel -> Connections.
   - Enter your API Key.
   - Click "Establish Connection".
   - System Operational Logs should show "Handshaking via Aura Gateway..." followed by "SECURE LINK ACTIVE".
3. **Product Lookup**:
   - Go to the Dropshipping tab.
   - Paste a CJ Product URL.
   - Click "Push to Shop".
   - Product details should be fetched correctly via the proxy.

## 4. TROUBLESHOOTING 404 ERRORS
- If you still see 404:
  - Check if `CJ_BASE_URL` in Vercel includes `/v1`. If it DOES NOT, our new logic will append it.
  - If CJ Dashboard says your API version is different, update `CJ_BASE_URL` accordingly.
  - Check the `targetUrl` logs in the Vercel console during the failed request.

## 5. RECENT FIXES APPLIED
- Removed redundant `v1/` prefixing logic that was doubling up if the base URL already had it.
- Switched from raw `cjApi.authenticate` in browser (which relied on complex proxy body rewriting) to a dedicated server-side route `/api/cj/connect`.
- Improved error messaging to distinguish between connection timeout, routing (404), and authorisation (401/403).
