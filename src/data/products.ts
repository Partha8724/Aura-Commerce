import { Product } from '../types';

const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Beauty', 'Sports & Outdoors'];
const suppliers = ['CJ Dropshipping', 'AliExpress'];

const baseTitles = [
  "Wireless Noise-Cancelling Earbuds Pro", "Smart Fitness Tracker Watch", "4K Ultra Action Camera", "Portable Power Bank 20000mAh", "Bluetooth Mechanical Keyboard",
  "Minimalist Leather Wallet", " polarized Sunglasses", "Cashmere Blend Scarf", "Waterproof Minimalist Backpack", "Automatic Men's Chronograph",
  "Smart LED Atmosphere Lamp", "Ergonomic Office Chair", "Ceramic Non-Stick Pan Set", "Robotic Vacuum Cleaner", "Ultrasonic Cool Mist Humidifier",
  "Hyaluronic Acid Serum", "Electric Sonic Toothbrush", "Professional Hair Dryer", "Jade Roller & Gua Sha Set", "Vitamin C Face Cream",
  "Adjustable Dumbbell Set", "Non-Slip Yoga Mat", "Resistance Band Set", "Insulated Stainless Steel Bottle", "Smart Jump Rope"
];

const descriptions = [
  "Experience premium quality with our latest release. Built with advanced materials for maximum durability and performance.",
  "Upgrade your daily routine. Designed for both beginners and professionals.",
  "The ultimate solution for your needs. Sleek design meets powerful functionality.",
  "Don't compromise on quality. Get the best value with our top-rated product."
];

export const initialProducts: Product[] = Array.from({ length: 50 }, (_, i) => {
  const isCJ = i % 2 === 0;
  const categoryIndex = i % 5;
  const category = categories[categoryIndex];
  const titleBase = baseTitles[i % baseTitles.length];
  const title = i >= baseTitles.length ? `Premium ${titleBase} V2` : titleBase;
  
  const basePrice = Math.floor(Math.random() * 80) + 10;
  const commission = Math.floor(Math.random() * 30) + 10;
  const finalPrice = basePrice + commission;

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
    stock: Math.floor(Math.random() * 2000) + 50,
    sold: Math.floor(Math.random() * 1000) + 10,
    rating: (Math.random() * 1.5 + 3.5).toFixed(1) as any as number,
    reviews: Math.floor(Math.random() * 500) + 5,
    shipping: 'Free Global Shipping',
    delivery: isCJ ? '5-9 Days' : '7-14 Days',
    discount: Math.random() > 0.8 ? Math.floor(Math.random() * 20) + 10 : 0,
    isHot: Math.random() > 0.7,
    isNew: Math.random() > 0.8,
    isDemo: true,
    tags: ['bestseller', 'premium'],
    images: [
      `https://picsum.photos/seed/${i + 100}/800/800`,
      `https://picsum.photos/seed/${i + 200}/800/800`
    ]
  };
});
