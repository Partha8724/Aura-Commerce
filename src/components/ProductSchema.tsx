import React from 'react';

interface ProductSchemaProps {
  product: {
    title: string;
    images?: string[];
    imageUrl?: string;
    description?: string;
    sku?: string;
    price: number;
    currency?: 'GBP' | 'USD';
  };
}

/**
 * File 3: Structural JSON-LD Product Schema
 * Injects clean, machine-readable metadata for rich search snippets.
 */
export function ProductSchema({ product }: ProductSchemaProps) {
  const siteUrl = 'https://luxedoow.com'; // Should ideally come from config
  const mainImage = product.images?.[0] || product.imageUrl || '';
  const currency = product.currency || 'USD';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": mainImage ? (mainImage.startsWith('http') ? mainImage : `${siteUrl}${mainImage}`) : '',
    "description": product.description || `Luxury item curated by Luxe Doow: ${product.title}`,
    "sku": product.sku || `LD-${product.title.substring(0, 3).toUpperCase()}`,
    "brand": {
      "@type": "Brand",
      "name": "Luxe Doow"
    },
    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/shop`,
      "priceCurrency": currency,
      "price": product.price.toFixed(2),
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
