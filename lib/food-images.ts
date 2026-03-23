// All URLs verified working on Unsplash
const CUISINE_IMAGES: Record<string, string[]> = {
  indian: [
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=200&fit=crop",
  ],
  italian: [
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1540189549336-e6e99e2a3e46?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop",
  ],
  mexican: [
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=200&fit=crop",
  ],
  thai: [
    "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop",
  ],
  chinese: [
    "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=200&fit=crop",
  ],
};

const FALLBACK = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop";

function getSeed(str: string): number {
  return str.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

export function getMealImage(mealName: string, cuisine: string): string {
  const images = CUISINE_IMAGES[cuisine?.toLowerCase()] ?? CUISINE_IMAGES.indian;
  return images[getSeed(mealName) % images.length];
}

export function getCookImage(cuisine: string, name: string): string {
  const images = CUISINE_IMAGES[cuisine?.toLowerCase()] ?? CUISINE_IMAGES.indian;
  return images[getSeed(name) % images.length];
}