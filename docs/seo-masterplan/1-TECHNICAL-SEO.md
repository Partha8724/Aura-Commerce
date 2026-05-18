# 1. TECHNICAL SEO FILES (HANDOFF TO DEVELOPER)

## 1A. ROBOTS.TXT FILE
Developer Instruction: Place this in the public root (or generate via `app/robots.ts`).
```text
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /partner-central/
Disallow: /cart/
Disallow: /checkout/
Disallow: /account/
Disallow: /*?sort=*
Disallow: /*?filter=*
Disallow: /*?tracking=*
Disallow: /search?q=*

User-agent: Googlebot
Allow: /

Sitemap: https://www.yourdomain.co.uk/sitemap.xml
```

## 1B. SITEMAP.XML STRUCTURE
Developer Instruction: Generate this dynamically from the database. Ensure `<lastmod>` updates whenever a product is modified.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Product Pages (Example of 5) -->
  <url><loc>https://www.yourdomain.co.uk/shop/custom-neon-name-sign</loc><lastmod>2023-11-20T14:30:00Z</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.yourdomain.co.uk/shop/cable-organiser-desk-tidy</loc><lastmod>2023-11-19T09:15:00Z</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.yourdomain.co.uk/shop/ribbed-ceramic-vase</loc><lastmod>2023-11-18T11:00:00Z</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.yourdomain.co.uk/shop/silicone-baby-feeding-set</loc><lastmod>2023-11-17T16:45:00Z</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.yourdomain.co.uk/shop/bamboo-kitchen-storage</loc><lastmod>2023-11-16T10:20:00Z</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>

  <!-- Category Pages (Example of 5) -->
  <url><loc>https://www.yourdomain.co.uk/home-decor</loc><lastmod>2023-11-20T00:00:00Z</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.yourdomain.co.uk/tech-gadgets</loc><lastmod>2023-11-20T00:00:00Z</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.yourdomain.co.uk/kitchen-dining</loc><lastmod>2023-11-20T00:00:00Z</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.yourdomain.co.uk/kids-toys</loc><lastmod>2023-11-20T00:00:00Z</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.yourdomain.co.uk/fashion-accessories</loc><lastmod>2023-11-20T00:00:00Z</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>

  <!-- Blog Posts (Example of 3) -->
  <url><loc>https://www.yourdomain.co.uk/blog/how-to-style-neon-signs-uk</loc><lastmod>2023-11-15T00:00:00Z</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.yourdomain.co.uk/blog/best-desk-organisers-2024</loc><lastmod>2023-11-10T00:00:00Z</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.yourdomain.co.uk/blog/minimalist-kitchen-ideas</loc><lastmod>2023-11-05T00:00:00Z</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>

  <!-- Static Pages -->
  <url><loc>https://www.yourdomain.co.uk/</loc><lastmod>2023-11-20T00:00:00Z</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://www.yourdomain.co.uk/contact</loc><lastmod>2023-01-01T00:00:00Z</lastmod><changefreq>yearly</changefreq><priority>0.5</priority></url>
  <url><loc>https://www.yourdomain.co.uk/delivery-information</loc><lastmod>2023-01-01T00:00:00Z</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.yourdomain.co.uk/returns-policy</loc><lastmod>2023-01-01T00:00:00Z</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.yourdomain.co.uk/about-us</loc><lastmod>2023-01-01T00:00:00Z</lastmod><changefreq>yearly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.yourdomain.co.uk/faq</loc><lastmod>2023-01-01T00:00:00Z</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>
</urlset>
```

## 1C. SCHEMA MARKUP (JSON-LD)

**Organization Schema**
```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Luxe Brand",
  "url": "https://www.yourdomain.co.uk",
  "logo": "https://www.yourdomain.co.uk/images/logo.png",
  "sameAs": [
    "https://www.facebook.com/yourbrand",
    "https://www.instagram.com/yourbrand",
    "https://www.tiktok.com/@yourbrand",
    "https://www.pinterest.co.uk/yourbrand"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+44-20-1234-5678",
    "contactType": "customer service",
    "contactOption": "TollFree",
    "areaServed": "GB",
    "availableLanguage": "English"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "71-75 Shelton Street",
    "addressLocality": "Covent Garden",
    "addressRegion": "London",
    "postalCode": "WC2H 9JQ",
    "addressCountry": "GB"
  }
}
</script>
```

**Product Schema (Example 1: Custom Neon Name Sign)**
```json
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Bespoke Custom Neon Name Sign",
  "image": [
    "https://www.yourdomain.co.uk/images/neon-sign-pink.jpg",
    "https://www.yourdomain.co.uk/images/neon-sign-blue.jpg"
  ],
  "description": "Personalise your space with our handmade LED custom neon name signs. Perfect for UK bedrooms, weddings, and home bars.",
  "sku": "NEON-CUST-001",
  "brand": {
    "@type": "Brand",
    "name": "Your Luxe Brand"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://www.yourdomain.co.uk/shop/custom-neon-name-sign",
    "priceCurrency": "GBP",
    "price": "89.99",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "hasMerchantReturnPolicy": {
      "@type": "MerchantReturnPolicy",
      "applicableCountry": "GB",
      "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
      "merchantReturnDays": "14",
      "returnMethod": "https://schema.org/ReturnByMail"
    },
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": "0.00",
        "currency": "GBP"
      },
      "shippingDestination": {
        "@type": "DefinedRegion",
        "addressCountry": "GB"
      },
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

**Product Schema (Example 2: Cable Organiser Desk Tidy)**
```json
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Minimalist Cable Organiser Desk Tidy",
  "image": [
    "https://www.yourdomain.co.uk/images/desk-tidy-black.jpg"
  ],
  "description": "Keep your home office completely wire-free. This sleek silicone cable management tidy firmly holds up to 5 charging wires.",
  "sku": "DESK-ORG-5WIRE",
  "brand": {
    "@type": "Brand",
    "name": "Your Luxe Brand"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://www.yourdomain.co.uk/shop/cable-organiser-desk-tidy",
    "priceCurrency": "GBP",
    "price": "14.99",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": { "@type": "MonetaryAmount", "value": "2.99", "currency": "GBP" },
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

**BreadcrumbList Schema (Product Example)**
```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": "https://www.yourdomain.co.uk/"
  },{
    "@type": "ListItem",
    "position": 2,
    "name": "Tech Gadgets",
    "item": "https://www.yourdomain.co.uk/tech-gadgets"
  },{
    "@type": "ListItem",
    "position": 3,
    "name": "Minimalist Cable Organiser"
  }]
}
</script>
```

**FAQ Schema (For Delivery Information Page)**
```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does delivery take to the UK?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We partner directly with international manufacturers to offer you premium products without retail markups. As a result, fully tracked delivery to the UK takes between 10 to 20 working days."
      }
    },
    {
      "@type": "Question",
      "name": "Do I have to pay UK customs or import duties?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, all VAT and applicable import duties are handled at checkout or covered by us. You will not face hidden fees upon delivery."
      }
    },
    {
      "@type": "Question",
      "name": "Can I return an item if I change my mind?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. We offer a 14-day hassle-free returns policy for UK customers. Simply email our customer service team and we will provide a UK return address."
      }
    },
    {
      "@type": "Question",
      "name": "How do I track my order?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Once your item is dispatched (usually within 1-3 working days), we will email you a Royal Mail or Evri tracking number which updates as soon as the package enters the UK."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if my item arrives damaged?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We ensure highly secure packaging, but if an item arrives damaged, please send us a photo within 48 hours of delivery and we will organise an immediate free replacement."
      }
    }
  ]
}
</script>
```

## 1D. .HTACCESS RULES
Developer Instruction: If hosted on Vercel/NextJS, execute these inside `next.config.js`. If hosting on an Apache server, use the `.htaccess` below.

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On

  # Force HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # Force www
  RewriteCond %{HTTP_HOST} !^www\. [NC]
  RewriteRule ^(.*)$ https://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # Remove trailing slash
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} (.+)/$
  RewriteRule ^ %1 [R=301,L]

  # Block Bad Bots
  RewriteCond %{HTTP_USER_AGENT} ^.*(AhrefsBot|SemrushBot|MJ12bot|DotBot|PetalBot).*$ [NC]
  RewriteRule .* - [F,L]
</IfModule>

<IfModule mod_expires.c>
  # Cache control for assets
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Custom 404
ErrorDocument 404 /404.html
```

## 1E. CANONICAL URL STRATEGY DOCUMENT
**To the Developer:** Implement the canonical `<link rel="canonical" href="..." />` strictly according to these rules:

1. **Self-Referencing is Mandatory:** Every indexable page MUST have a canonical tag pointing to its own exact URL. (e.g., The page `https://www.yourdomain.co.uk/shop/vase` must have the canonical `https://www.yourdomain.co.uk/shop/vase`).
2. **Handling Pagination:** 
   - `https://www.yourdomain.co.uk/home-decor?page=2` MUST canonicalise to `https://www.yourdomain.co.uk/home-decor?page=2`. Do not canonicalise page 2 back to page 1.
   - Use `<link rel="prev" href="...?page=1">` and `<link rel="next" href="...?page=3">` alongside the canonical.
3. **Handling Product Variants (Crucial for Dropshipping):**
   - If CJ Dropshipping imports standard variations as URL parameters (e.g., `/shop/neon-sign?colour=pink`), the canonical tag MUST strip the parameter and point to the master product: `/shop/neon-sign`. This stops Google penalising you for duplicate content.
4. **Handling Parameters:** Any URL with `?sort=price_asc` or `?filter=new` must canonicalise to the clean, parameter-less category URL `https://www.yourdomain.co.uk/home-decor`.
