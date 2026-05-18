# 6. MEASUREMENT & TRACKING

## Google Search Console Setup Checklist
- [ ] Go to Google Search Console.
- [ ] Select "Domain Property" (requires DNS verification, usually adding a TXT record to your domain provider like GoDaddy or Cloudflare). This is superior to URL Prefix.
- [ ] Once verified, navigate to **Sitemaps** on the left menu.
- [ ] Enter `sitemap.xml` and click Submit.
- [ ] Ensure your `robots.txt` is not blocking Googlebot. (Test via the live URL inspection tool).

## Key SEO KPIs to Track
For a site under 6 months old, do NOT panic if sales are zero from organic. Focus on leading indicators:

**Weekly:**
1. **Pages Indexed:** Are Google actually putting your products in their database? (Check GSC "Pages" report). Target: 100% of sitemap submitted pages indexed.
2. **Impressions:** Are you showing up when people search? Target: Growth week over week.

**Monthly:**
1. **Clicks:** Are people actually clicking your links in search? Target: 50+ organic clicks/month by month 3.
2. **Average Position:** Are your keyword rankings moving from page 5 to page 2?
3. **Core Web Vitals:** Are your pages loading fast? (Check GSC "Experience" tab). Target: "Good" URLs > 90%.

## Custom SEO Dashboard Metrics Structure 
If you use Google Analytics 4 (GA4) or a Looker Studio dashboard, set it up to show:
- Top Landing Pages (Organic Traffic only)
- Conversions by Landing Page
- Bounce Rate for Blog Posts vs Product Pages
- Traffic by Device (Mobile vs Desktop)

## How to Read and Act on GSC Data

**Scenario 1: High Impressions, Zero Clicks**
- *Diagnosis:* Google likes your page, but users hate how it looks in search results.
- *Action:* Rewrite your Title Tag to be more clickable. Add a better Meta Description. 

**Scenario 2: Page is "Discovered - currently not indexed"**
- *Diagnosis:* Google knows the page exists but didn't think it was worth the server resources to crawl it. Almost always indicates "Thin Content".
- *Action:* Go to that product page. Add 150 words of unique description. Add internal links pointing to it.

**Scenario 3: "Crawled - currently not indexed"**
- *Diagnosis:* Google read the page, but decided not to list it. Often means it's a duplicate of another page on your site or heavily duplicated from AliExpress.
- *Action:* Change the H1, rewrite the product description completely, and ensure the URL canonical flag is correct.
