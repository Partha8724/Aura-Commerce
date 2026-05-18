import { GoogleGenAI, Type } from "@google/genai";

/**
 * STRICT SEO Output Schema as requested
 */
export interface SeoData {
  metaTitle: string;
  metaDescription: string;
  openGraph: {
    title: string;
    description: string;
    images: string[];
  };
  slug: string;
  schemaMarkup: {
    "@context": "https://schema.org";
    "@type": "Product";
    name: string;
    description: string;
    offers: {
      "@type": "Offer";
      priceCurrency: string;
      price: string;
      availability: "https://schema.org/InStock";
    };
  };
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

/**
 * SEO Generation Agent
 * Processes unstructured product data into localized, structured SEO metadata.
 */
export async function generateSeoData(
  productData: any, 
  targetRegion: 'UK' | 'USA'
): Promise<SeoData> {
  const currency = targetRegion === 'UK' ? 'GBP' : 'USD';
  const languageStyle = targetRegion === 'UK' ? 'Premium British English (e.g., bespoke, curated, elegant)' : 'High-End American English';

  const systemInstruction = `
    You are an Elite Technical SEO Architect & Next.js 15 Backend Engineer.
    Task: Generate structured SEO metadata for a luxury dropshipping platform.
    
    Constraint: 
    - Localization: Use ${languageStyle}.
    - Currency: ${currency}.
    - Description Length: Strictly 150-160 characters.
    - Slug: Lowercase, hyphenated URL path slug.
    - Style: Luxury, technical, and authoritative.
  `;

  const prompt = `
    Generate SEO data for the following product data:
    ${JSON.stringify(productData, null, 2)}
    
    Target Region: ${targetRegion}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            metaTitle: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            openGraph: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                images: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["title", "description", "images"]
            },
            slug: { type: Type.STRING },
            schemaMarkup: {
              type: Type.OBJECT,
              properties: {
                "@context": { type: Type.STRING },
                "@type": { type: Type.STRING },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                offers: {
                  type: Type.OBJECT,
                  properties: {
                    "@type": { type: Type.STRING },
                    priceCurrency: { type: Type.STRING },
                    price: { type: Type.STRING },
                    availability: { type: Type.STRING }
                  },
                  required: ["@type", "priceCurrency", "price", "availability"]
                }
              },
              required: ["@context", "@type", "name", "description", "offers"]
            }
          },
          required: ["metaTitle", "metaDescription", "openGraph", "slug", "schemaMarkup"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return result as SeoData;
  } catch (error) {
    console.error("[SeoGenerationAgent Error]:", error);
    throw new Error("Failed to generate SEO data via Gemini API");
  }
}
