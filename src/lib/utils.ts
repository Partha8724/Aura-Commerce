import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUUID(): string {
  if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  // Safe RFC4122 v4 compliant fallback generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateDeterministicUUID(str: string): string {
  if (!str) return generateUUID();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Format hash as high-dispersion 32-character hexadecimal representation
  const absoluteHash = Math.abs(hash);
  const salt = "aurasaltpremium";
  let saltHash = 0;
  for (let i = 0; i < salt.length; i++) {
    saltHash = (saltHash << 5) - saltHash + salt.charCodeAt(i);
    saltHash = saltHash & saltHash;
  }
  
  const part1 = absoluteHash.toString(16).padEnd(8, '0');
  const part2 = Math.abs(saltHash).toString(16).padEnd(8, '4').slice(0, 4);
  const part3 = Math.abs(hash * 31).toString(16).padEnd(8, 'a').slice(0, 3);
  const part4 = Math.abs(saltHash * 13).toString(16).padEnd(8, 'b').slice(0, 3);
  const part5 = Math.abs(hash * saltHash).toString(16).padEnd(12, 'f').slice(0, 12);
  
  return `${part1}-${part2}-4${part3}-a${part4}-${part5}`;
}
