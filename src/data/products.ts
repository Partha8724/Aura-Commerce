import { Product } from '../types';

const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Beauty', 'Sports & Outdoors'];
const suppliers = ['CJ Dropshipping', 'AliExpress'];

const baseTitles = [
  "Wireless Noise-Cancelling Earbuds Pro", "Smart Fitness Tracker Watch", "4K Ultra Action Camera", "Portable Power Bank 20000mAh", "Bluetooth Mechanical Keyboard",
  "Minimalist Leather Wallet", "Polarised Designer Sunglasses", "Cashmere Blend Winter Scarf", "Waterproof Minimalist Backpack", "Automatic Men's Chronograph",
  "Smart LED Atmosphere Lamp", "Ergonomic Premium Office Chair", "Ceramic Non-Stick Pan Set", "Robotic Smart Vacuum Cleaner", "Ultrasonic Cool Mist Humidifier",
  "Hyaluronic Acid Hydrating Serum", "Electric Sonic Smart Toothbrush", "Professional Negative Ion Hair Dryer", "Jade Roller & Gua Sha Set", "Vitamin C Radiance Face Cream",
  "Adjustable Compact Dumbbell Set", "Non-Slip Eco Yoga Mat", "Heavy Duty Resistance Band Set", "Insulated Stainless Steel Bottle", "Smart Digital Jump Rope"
];

const descriptions = [
  "Experience premium luxury and unmatched performance in your everyday routine. Built with aerospace-grade materials for maximum durability.",
  "Meticulously crafted for both active practitioners and discerning professionals. Features dynamic calibration and premium touchpoints.",
  "Elevate your lifestyle. Sleek futuristic aesthetic paired with high-fidelity performance controls and certified logistics.",
  "The ultimate synthesis of design and purpose. Engineered to perform under precision stress, certified for high-end environments."
];

// High-fidelity Unsplash product photography IDs
const unsplashIdMap: Record<string, string> = {
  "Earbuds": "photo-1590658268037-6bf12165a8df",
  "Watch": "photo-1508685096489-7aacd43bd3b1",
  "Camera": "photo-1516035069371-29a1b244cc32",
  "Power Bank": "photo-1625852516444-a27300774a40",
  "Keyboard": "photo-1587829741301-dc798b83add3",
  "Wallet": "photo-1627123424574-724758594e93",
  "Sunglasses": "photo-1572635196237-14b3f281503f",
  "Scarf": "photo-1584917865442-de89df76afd3",
  "Backpack": "photo-1553062407-98eeb64c6a62",
  "Chronograph": "photo-1524592094714-0f0654e20314",
  "Lamp": "photo-1507473885765-e6ed057f782c",
  "Chair": "photo-1505797149-43b0069ec26b",
  "Pan": "photo-1584269600464-37b1b58a9fe7",
  "Vacuum": "photo-1581092160607-ee22621dd758",
  "Humidifier": "photo-1602928321679-560bb453f190",
  "Serum": "photo-1608248597481-496100c8c836",
  "Toothbrush": "photo-1607613009820-a29f7bb81c04",
  "Hair Dryer": "photo-1522337360788-8b13dee7a37e",
  "Jade Roller": "photo-1617897903246-719242758050",
  "Face Cream": "photo-1601612620961-a83910f300c3",
  "Dumbbell": "photo-1638536532686-d610adfc8e5c",
  "Yoga Mat": "photo-1592432678016-e910b452f9bc",
  "Resistance Band": "photo-1517838277536-f5f99be501cd",
  "Bottle": "photo-1602143407151-7111542de6e8",
  "Jump Rope": "photo-1517838277536-f5f99be501cd"
};

export const initialProducts: Product[] = Array.from({ length: 50 }, (_, i) => {
  const isCJ = i % 2 === 0;
  const categoryIndex = i % 5;
  const category = categories[categoryIndex];
  const titleBase = baseTitles[i % baseTitles.length];
  const title = i >= baseTitles.length ? `Premium ${titleBase} Royale` : titleBase;
  
  const basePrice = Math.floor(Math.random() * 80) + 12;
  const commission = Math.floor(Math.random() * 30) + 15;
  const finalPrice = basePrice + commission;

  // Match keyword for Unsplash product image
  const keyword = Object.keys(unsplashIdMap).find(k => titleBase?.includes(k)) || "Earbuds";
  const photoId = unsplashIdMap[keyword];
  const imageUrl = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=80&w=800`;

  return {
    id: `PROD-${(i + 1).toString().padStart(3, '0')}`,
    title,
    description: descriptions[i % descriptions.length],
    supplier: isCJ ? 'CJ Dropshipping' : 'AliExpress',
    supplierLogo: isCJ ? '📦' : '🛍️',
    category,
    basePrice,
    commission,
    finalPrice,
    stock: Math.floor(Math.random() * 1200) + 100,
    sold: Math.floor(Math.random() * 800) + 15,
    rating: parseFloat((Math.random() * 0.8 + 4.2).toFixed(1)),
    reviews: Math.floor(Math.random() * 400) + 10,
    shipping: 'Free Global Shipping',
    delivery: isCJ ? '5-9 Days' : '7-14 Days',
    discount: Math.random() > 0.8 ? Math.floor(Math.random() * 15) + 10 : 0,
    isHot: Math.random() > 0.7,
    isNew: Math.random() > 0.8,
    isDemo: true,
    tags: [i % 4 === 0 ? 'explosive' : i % 4 === 1 ? 'essentials' : 'general'],
    images: [imageUrl],
    imageUrl: imageUrl
  };
});
