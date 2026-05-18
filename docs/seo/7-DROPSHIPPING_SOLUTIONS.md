# 7. DROPSHIPPING-SPECIFIC SEO SOLUTIONS

## Handling Thin/Duplicate Product Content
When you import 500 items from CJ Dropshipping, 10,000 other stores are importing the exact same descriptions and titles. Google suppresses duplicates.

- **The Solution:** Use the Gemini AI service (`SeoGenerationAgent.ts` implemented in your backend) to automatically rewrite EVERY imported title, meta description, and product body text into premium British English.
- **Rule of Thumb:** Never publish an AliExpress product live without altering its title and at least the first 2 sentences of the description.

## Product Image SEO Strategy
Supplier images are often bloated, named `HTB123123.jpg`, and loaded with Chinese text overlays.

- **Action 1:** Download the images and use a bulk editor (like Canva or Photoroom) to remove bad text/watermarks.
- **Action 2:** Rename the file BEFORE uploading to your database: `white-ceramic-vase-uk.jpg`.
- **Action 3:** Implement the `<Image alt="Product Name UK" />` component strict typing in your frontend.

## Handling Out-of-Stock and Discontinued Products
Dropshipping catalogs change rapidly.
- **Temporarily Out of Stock:** Leave the page LIVE. Mark Schema availability to `OutOfStock`. Add an email capture form: "Notify me when back in stock." DO NOT DELETE the page; you will lose the SEO juice it built.
- **Permanently Discontinued:** If the supplier drops the product forever, set up a **301 Redirect** in `next.config.js` pointing the dead URL to the closest related product or the parent Category page. Never let it 404.

## Country-Specific SEO Signals for UK Targeting
Since you are dropshipping from global suppliers to the UK, Google needs to know you are local.
- **Currency:** Must default to GBP (£). Schema `priceCurrency` must be `"GBP"`.
- **Language:** Schema and HTML tag must be `<html lang="en-GB">`.
- **Address Formatting:** Create a Contact/About page. Even if dropshipping, try to have a UK registered business address, a `co.uk` domain, and a UK phone number (e.g., via Skype/Twilio).
- **Spelling:** Ensure your AI rewrite tools are explicitly set to British English (colour, centre, standardise).

## Shipping Page SEO: Turning 10-20 Days into an Asset
Long shipping times can hurt conversions, but from an SEO perspective, clarity builds trust.
- **Create a dedicated `/shipping-policy` page.**
- **Optimize for:** "Luxe Doow Shipping Times", "Luxe Doow Delivery UK".
- **The Messaging:** Frame it as *Global Curation*. "To bring you the finest unique items without inflated retail markups, we ship directly from our global artisans and manufacturing partners to your door in the UK. Please allow 10-20 working days for your curated items to arrive."
- **Schema:** Use `OfferShippingDetails` in your Product JSON-LD to explicitly declare handling and transit times. Google will display this accurately in search results, reducing bounce rates from angry customers.
