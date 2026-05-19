# AURA COMMERCE - Deployment & Verification Checklist

Follow these steps immediately after pushing your changes to GitHub.

### Step 1: GitHub Push
- [ ] Commit all updated files: `src/lib/cj-api.ts`, `app/api/cj/connect/route.ts`, `src/components/CJConnectionPanel.tsx`.
- [ ] Push to `main` branch.

### Step 2: Vercel Deployment
- [ ] Open your **Vercel Dashboard**.
- [ ] Confirm the deployment for `aura-commerce-833j` has completed successfully.
- [ ] Check the **Function Logs** for any booting errors.

### Step 3: Platform Initialisation
- [ ] Open `https://aura-commerce-833j.vercel.app` in your browser.
- [ ] Navigate to the **Platform Connections** section in the Admin Panel.
- [ ] You should now see the new **CJ Dropshipping Connection Panel**.

### Step 4: Live Connection Test
- [ ] Look at the Status Indicator (should be **Red / System Offline** initially).
- [ ] Enter your **API Authorisation Key** from the CJ Dropshipping Dashboard.
- [ ] Click **Establish Connection**.
- [ ] **Expectation**: 
    - Log: `⚡ Handshake initiated with Aura Gateway...`
    - Log: `✅ Aura Secure Bridge established. Master Supplier is online.`
    - Status turns **Green / System Online**.

### Step 5: Data Fetching Test
- [ ] Go to the **Dropshipping** tab.
- [ ] Paste a product URL (e.g., `https://cjdropshipping.com/product/example-p-123.html`).
- [ ] Click **Push to Shop**.
- [ ] Verify that the product details (Name, SKU, Price) are fetched correctly via the new `cjApi` direct link.

### Step 6: Troubleshooting
- [ ] If status is **Offline**: Check Vercel logs for `[CJ API] HTTP Error: 401`. This means your API Key is incorrect.
- [ ] If status is **Offline**: Check Vercel logs for `404 Not Found`. This means `CJ_BASE_URL` is wrong.
- [ ] If you see `Unexpected token T`: This means the browser is still calling an old, non-existent route. Clear browser cache and verify the URL in the Network tab.
