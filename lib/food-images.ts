const CUISINE_IMAGES: Record<string, string[]> = {
  indian: [
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1631452180519-0b8ffd4f1e28?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1627662168223-7df99068099a?w=400&h=200&fit=crop",
  ],
  italian: [
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1540189549336-e6e99e2a3e46?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=200&fit=crop",
  ],
  mexican: [
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400&h=200&fit=crop",
  ],
  thai: [
    "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400&h=200&fit=crop",
  ],
  chinese: [
    "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=200&fit=crop",
  ],
};

const FALLBACK = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=200&fit=crop";

function getSeed(str: string): number {
  return str.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

export function getMealImage(mealName: string, cuisine: string): string {
  const images = CUISINE_IMAGES[cuisine?.toLowerCase()] || CUISINE_IMAGES.indian;
  const seed = getSeed(mealName);
  return images[seed % images.length] ?? FALLBACK;
}

export function getCookImage(cuisine: string, name: string): string {
  const images = CUISINE_IMAGES[cuisine?.toLowerCase()] || CUISINE_IMAGES.indian;
  const seed = getSeed(name);
  return images[seed % images.length] ?? FALLBACK;
}