# 6. MEASUREMENT & REPORTING

## 6A. GOOGLE SEARCH CONSOLE SETUP CHECKLIST

- [ ] **Verify Domain Ownership:** Log into Google Search Console. Choose "Domain property" (NOT URL Prefix). Google will give you a TXT record. Add this to your DNS settings (Cloudflare, GoDaddy, Namecheap etc). Wait 10 mins and click Verify.
- [ ] **Submit Sitemap:** Once inside, click 'Sitemaps' on the left menu. Type `sitemap.xml` into the box and hit submit. Check back in 24 hours to ensure it says "Success".
- [ ] **Set Geographic Target (Legacy but good practice):** Under Legacy tools/International Targeting, ensure it is set to United Kingdom. (Note: Google relies more on server location, .co.uk TLD, and GBP currency now).
- [ ] **Check Coverage:** Click 'Pages'. Look at the grey box "Not Indexed". If pages are failing to index, this is where you diagnose the problem.

## 6B. KEY SEO KPIs TO TRACK 

**KPIs for a site under 6 Months (Do not obsess over revenue yet):**

1. **Total Organic Impressions (GSC):** How many times your site appeared in search. **Benchmark Month 3:** 5,000/month.
2. **Total Organic Clicks (GSC):** How many people clicked. **Benchmark Month 3:** 100+/month.
3. **Average CTR (GSC):** Clicks divided by Impressions. **Target:** >2% overall. If Position 1-3, target >15%.
4. **Average Position (GSC):** Where you rank on average. **Target:** Shifting from 50+ towards 1-20.
5. **Pages Indexed (GSC):** **Benchmark:** 90%+ of your submitted sitemap.
6. **Core Web Vitals (GSC):** Loading speed and visual stability. **Benchmark:** "Good" rating for Mobile.
7. **Ranking Keywords:** Use a free tool like Ubersuggest to see how many keywords you rank for in the top 100. **Target:** Steady monthly growth.
8. **Backlinks Acquired:** Keep a manual tally spreadsheet. **Target:** 5 quality links per month.
9. **Organic Conversion Rate (GA4):** Ensure people arriving from Google actually buy. **Target:** 1-2%.

## 6C. WEEKLY SEO REPORT TEMPLATE

*Keep a spreadsheet with these columns, fill it out every Friday afternoon.*

**Date Range:** [Monday - Friday]
**Top 3 Performing Pages (by Clicks):** [e.g., Homepage, Neon Sign Product, Desk Tidy Blog]
**Keywords Moving UP:** [e.g., "Silicone cable organiser" moved Pos 40 -> Pos 15]
**Keywords Moving DOWN:** [e.g., "Glass vase uk" dropped off page 2]
**New Backlinks Won:** [e.g., 1 link from UK Home Decor Blog]
**Content Output:** [e.g., Rewrote 10 product descriptions, published 1 blog]
**Issues Found:** [e.g., 5 pages showed 'Crawled - Not indexed' in GSC]
**Action Plan Next Week:** [e.g., Lengthen content on those 5 failing pages, pitch 5 guest posts]

## 6D. HOW TO ACT ON GSC DATA (5 EXACT SCENARIOS)

**Scenario 1: High Impressions, Low CTR (Click-Through Rate)**
- **What it means:** Google put you on page 1 or 2, but searchers saw your snippet and ignored it.
- **Action:** Your Title Tag or Meta Description is boring. Rewrite them to be punchy, include "UK", and highlight a benefit like "Free Delivery".

**Scenario 2: High CTR, Low Position (e.g., Position 12)**
- **What it means:** You are on page 2, but when people do venture that far, they love your title and click it. 
- **Action:** This is a goldmine keyword. Google likes your page. Send 2 new internal links to this page from your blog, and try to build 1 external backlink to it. It will jump to Page 1 quickly.

**Scenario 3: Position 11-15 for a Target Keyword**
- **What it means:** You are stranded at the top of Page 2. You have almost proven yourself.
- **Action:** Open the page. Add a "Frequently Asked Questions" H2 section with 3 questions containing related sub-keywords. Increase the word count by 200 words.

**Scenario 4: Sudden Drop in Impressions across the board**
- **What it means:** You either suffered a technical failure or a Google Core Algorithm update hit you.
- **Action:** First, test your `robots.txt` and sitemap to ensure the site isn't broken. If technicals are fine, Google likely found duplicate content (e.g., you didn't rewrite your CJ Dropshipping descriptions). You must purge un-original content immediately.

**Scenario 5: Pages "Discovered - Currently Not Indexed"**
- **What it means:** Google saw the URL in your sitemap, but decided it wasn't worth the server cost to read it. It is "Thin Content".
- **Action:** This happens to dropshippers with 10,000 product pages and 1-sentence descriptions. You must pause importing new items, and spend time fleshing out the descriptions and adding unique lifestyle imagery to the pages failing to index. Then click "Request Indexing" in GSC.
