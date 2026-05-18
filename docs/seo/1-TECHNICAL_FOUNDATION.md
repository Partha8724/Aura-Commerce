# 1. TECHNICAL SEO FOUNDATION

## Complete robots.txt
Standard configuration for a dropshipping site protecting admin routes and exposing the sitemap.

```text
User-agent: *
Allow: /
Disallow: /partner-central/
Disallow: /admin/
Disallow: /api/
Disallow: /checkout/
Disallow: /cart/
Disallow: /account/
Disallow: /*?sort=*
Disallow: /*?filter=*

User-agent: Googlebot
Allow: /

Sitemap: https://www.yourdomain.co.uk/sitemap.xml
```

## Complete sitemap.xml Structure
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url><loc>https://www.yourdomain.co.uk/</loc><lastmod>2023-10-01T00:00:00Z</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://www.yourdomain.co.uk/about-us</loc><lastmod>2023-10-01T00:00:00Z</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>https://www.yourdomain.co.uk/shipping-policy</loc><lastmod>2023-10-01T00:00:00Z</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
  
  <!-- Categories -->
  <url><loc>https://www.yourdomain.co.uk/home-decor</loc><lastmod>2023-10-01T00:00:00Z</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.yourdomain.co.uk/gadgets</loc><lastmod>2023-10-01T00:00:00Z</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  
  <!-- Products -->
  <url><loc>https://www.yourdomain.co.uk/shop/minimalist-ceramic-vase</loc><lastmod>2023-10-01T00:00:00Z</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.yourdomain.co.uk/shop/led-desk-lamp-wireless-charging</loc><lastmod>2023-10-01T12:30:00Z</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.yourdomain.co.uk/shop/bamboo-kitchen-organiser</loc><lastmod>2023-10-02T08:15:00Z</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.yourdomain.co.uk/shop/waterproof-travel-backpack</loc><lastmod>2023-10-02T09:00:00Z</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.yourdomain.co.uk/shop/smart-fitness-watch-tracker</loc><lastmod>2023-10-03T14:20:00Z</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
  
  <!-- Blog Posts -->
  <url><loc>https://www.yourdomain.co.uk/blog/top-10-home-decor-trends-2024</loc><lastmod>2023-09-28T10:00:00Z</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.yourdomain.co.uk/blog/how-to-organise-your-kitchen</loc><lastmod>2023-09-25T11:00:00Z</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.yourdomain.co.uk/blog/gadgets-for-working-from-home</loc><lastmod>2023-09-20T09:30:00Z</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.yourdomain.co.uk/blog/sustainable-travel-accessories</loc><lastmod>2023-09-15T15:45:00Z</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.yourdomain.co.uk/blog/best-gifts-for-tech-lovers</loc><lastmod>2023-09-10T08:00:00Z</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
</urlset>
```

## Schema.org Structured Data
**Organization (Homepage):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Luxe Doow UK",
  "url": "https://www.yourdomain.co.uk",
  "logo": "https://www.yourdomain.co.uk/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+44-0000-000000",
    "contactType": "customer service",
    "areaServed": "GB",
    "availableLanguage": "en"
  }
}
</script>
```

**Product 1 (In Stock):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Minimalist Ceramic Ribbed Vase",
  "image": ["https://www.yourdomain.co.uk/images/vase-1.jpg"],
  "description": "Premium ribbed ceramic vase in matte white. Perfect for modern British homes. 20cm tall.",
  "sku": "12345678",
  "mpn": "925872",
  "brand": { "@type": "Brand", "name": "Luxe Doow" },
  "offers": {
    "@type": "Offer",
    "url": "https://www.yourdomain.co.uk/shop/minimalist-ceramic-ribbed-vase",
    "priceCurrency": "GBP",
    "price": "29.99",
    "priceValidUntil": "2024-12-31",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock",
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": { "@type": "MonetaryAmount", "value": "0.00", "currency": "GBP" },
      "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "GB" },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "handlingTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 3, "unitCode": "d" },
        "transitTime": { "@type": "QuantitativeValue", "minValue": 10, "maxValue": 20, "unitCode": "d" }
      }
    }
  }
}
</script>
```

**Product 2 (Out of Stock Example):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "LED Desk Lamp with Wireless Charging",
  "image": ["https://www.yourdomain.co.uk/images/lamp.jpg"],
  "description": "Smart LED desk lamp with adjustable brightness and Qi wireless phone charger.",
  "sku": "98765432",
  "offers": {
    "@type": "Offer",
    "url": "https://www.yourdomain.co.uk/shop/led-desk-lamp",
    "priceCurrency": "GBP",
    "price": "45.00",
    "availability": "https://schema.org/OutOfStock"
  }
}
</script>
```

**BreadcrumbList:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": "https://www.yourdomain.co.uk"
  },{
    "@type": "ListItem",
    "position": 2,
    "name": "Home Decor",
    "item": "https://www.yourdomain.co.uk/home-decor"
  },{
    "@type": "ListItem",
    "position": 3,
    "name": "Minimalist Ceramic Ribbed Vase"
  }]
}
</script>
```

**FAQ (For Category or Delivery Pages):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "How long does delivery to the UK take?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Delivery typically takes between 10 to 20 working days as we source directly from our international partners to give you the best prices."
    }
  }]
}
</script>
```

## Next.js Redirects & .htaccess equivalents
In Next.js, use `next.config.js` for strict canonical pathing.

```javascript
// next.config.js
module.exports = {
  trailingSlash: false, 
  async redirects() {
    return [
      {
        source: '/:path*/', // Force remove trailing slash
        destination: '/:path*',
        permanent: true,
      }
    ];
  },
}
```
*Note: WWW/Non-WWW and HTTP to HTTPS enforcement should be set at the DNS/Hosting level (e.g., Vercel Domain settings).*

## Canonical URL Strategy
**The Rule:** EVERY page must have a self-referencing canonical tag.
- **Product Page:** `<link rel="canonical" href="https://www.yourdomain.co.uk/shop/minimalist-ceramic-vase" />`
- **Category Filtered Page (e.g., ?colour=red):** Must point to the master category: `<link rel="canonical" href="https://www.yourdomain.co.uk/home-decor" />`
- **Paginated Pages (e.g., ?page=2):** Each paginated page should self-canonicalize. `href="https://www.yourdomain.co.uk/home-decor?page=2"`

## Page Speed Optimization Checklist (Image Heavy Sites)
- [ ] **Next.js `<Image>` usage:** Always use `next/image` to force WebP/AVIF output.
- [ ] **Lazy Loading:** Set `loading="lazy"` on all images except the first LCP hero image (`priority={true}`).
- [ ] **Localisation & CDN:** Host product images on a fast UK-edge CDN (Supabase Storage). DO NOT hotlink CJ/AliExpress images directly in the DOM as their latency to the UK is poor.
- [ ] **Limit DOM size:** Max 24 product cards per page. Use pagination.
- [ ] **Preconnect:** Add `<link rel="preconnect" href="https://your-supabase-url.supabase.co">` in `app/layout.tsx`.
