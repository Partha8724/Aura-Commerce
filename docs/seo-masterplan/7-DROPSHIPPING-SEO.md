# 7. DROPSHIPPING-SPECIFIC SEO SOLUTIONS

## 7A. HANDLING DUPLICATE CONTENT (The Dropshipper's Curse)

When you sync CJ Dropshipping or AliExpress, you inherit the exact HTML, text, and titles that 500 other Shopify/WooCommerce/Custom stores just imported. Google's algorithm filters out duplicate content to preserve search quality. 

**5 Strategies to Fix This:**
1. **Never use the imported Title:** Use the `[Primary Keyword] | [Secondary Keyword] | [Brand]` formula instead.
2. **The 5-Paragraph Rule:** Delete the bullet-point spec list AliExpress provides. Write the emotional hook, the benefits, and the UK-delivery trust signal *(See File 4B for formula)*.
3. **Custom Image Architecture:** Change image filenames and inject deep-descriptive Alt Text.
4. **Product-Specific FAQ:** Add an accordion/FAQ at the bottom of the long description. No other dropshipper will have identical FAQs for that specific product.
5. **UK-Specific Boilerplate:** Put a specific section on every product page about "Delivery from our global partners to your UK address in 10-20 days".

**Real Example:**
*AliExpress Original:* "Mini Portable Fan USB Rechargeable Handheld Mute Pocket Fan Cooler For Outdoor Travel Cute Small Cooling Fan"
*Your Rewritten Version:* "Ultra-Quiet Portable Handheld USB Fan" (Followed by a rich, 300-word UK-focused description about surviving London tube commutes in summer).

## 7B. PRODUCT IMAGE SEO

Supplier images are a major SEO liability if not processed.
- **File Naming Convention:** NEVER upload `IMG_9099.jpg` or `HTB1v345.jpeg`. Before uploading to your server/Supabase, rename it: `pink-portable-rechargeable-handheld-fan-uk.jpg`.
- **Alt Text at Scale:** If you have 100s of products, ensure your database schema requires an `alt_text` string field for every image array element.
- **Compression:** Use a tool like TinyPNG (or your Next.js `next/image` component) to serve WebP formats. WebP is 30% smaller than JPEG.
- **Watermarks:** Crop out Chinese text/vendor watermarks using Canva. Google's Vision AI reads text in images and associates it with cheap drop shipping if non-native text is present.

## 7C. OUT-OF-STOCK AND DISCONTINUED PRODUCTS

Because you don't control inventory, items will vanish from CJ/AliExpress daily.

- **Temporarily Out of Stock (Supplier has zero inventory but page exists):**
  - Do NOT delete the page. You will lose the SEO rankings it earned.
  - Action: Update Schema `availability: OutOfStock`. 
  - Action: Replace the "Add to Cart" button with an email capture form: "Join Waitlist. We will email you when our global partners restock."
- **Permanently Discontinued (Supplier deleted the item):**
  - Action: Use a **301 Permanent Redirect**. Point the dead URL back to the parent Category folder (e.g., `/shop/dead-lamp` redirects to `/tech-gadgets`). 
  - Why: This passes any backlink authority the dead product earned back up to your category page.
- **The Custom 404 Page:** If a user slips through to a broken page, ensure your `404.tsx` page has a search bar and a grid of "Our Best Selling Alternative Products" to catch the traffic.

## 7D. UK COUNTRY SEO SIGNALS

Google requires strong confidence that you serve the UK to rank you on `google.co.uk`. Check these off:
- [ ] **Currency Display:** Prices must default to British Pounds (£). JSON-LD `priceCurrency` must equal `GBP`.
- [ ] **British English Spelling:** Ensure all AI tools/writers use: colour, centre, organise, personalise, catalogue, travelling.
- [ ] **Contact Page:** List a physical UK address (even a £15/month virtual registered office in London). Provide a UK phone number if possible.
- [ ] **Domain:** Using a `.co.uk` is optimal. If using a `.com`, ensure your GSC settings and physical signals point heavily to the UK.
- [ ] **Legal Pages:** Ensure standard UK GDPR-compliant Privacy, Cookie, and Terms of Service pages exist.
- [ ] **Social Proof:** Use a tool like Trustpilot (highly trusted in the UK).

## 7E. SHIPPING PAGE SEO STRATEGY

"10-20 working day delivery" is normally a conversion killer. From an SEO standpoint, honesty builds trust with Google and users. Own it.

- **Target Keywords:** Create a page at `/delivery-information-uk`. Optimise it for "Luxe Doow Delivery UK", "Shipping Terms Luxe Doow", "Global Curation Delivery Times".
- **The Narrative Shift:** 
  *"Why 10-20 Days? We don't believe in holding massive, environmentally wasteful local warehouse inventory. Instead, we curate directly from independent artisan manufacturers and global tech hubs. When you place an order, your item is dispatched directly from the source to your door in the UK. This completely eliminates retail markups, middlemen costs, and domestic warehouse fees—passing the savings directly to you. Your patience is rewarded with premium quality at unbeatable prices."*
- **SEO Implementation:** By having a massive, well-explained 500-word delivery page, you reduce bounce rates. Add FAQ Schema to this page answering "Where does my item come from?" and "How is it tracked in the UK?"
