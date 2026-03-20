export interface Meal {
  name: string;
  cuisine: string;
  dietary: string;
  additional: string;
  score: number;
  description?: string;
  image?: string;
}

export interface MealPreferences {
  cuisine: string;
  dietary: string;
  additional_details: string;
  address: string;
}

export function getCuisinePlaceholder(cuisine: string): string {
  const placeholders: Record<string, string> = {
    indian: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
    italian: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    mexican: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop",
    chinese: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop",
    japanese: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400&h=300&fit=crop",
    thai: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop",
    mediterranean: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
    american: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
  };
  
  const key = cuisine.toLowerCase();
  return placeholders[key] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop";
}

export const cuisineOptions = [
  "Indian",
  "Italian", 
  "Mexican",
  "Chinese",
  "Japanese",
  "Thai",
  "Mediterranean",
  "American",
];

export const dietaryOptions = [
  "No Preference",
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Low-Carb",
  "Halal",
];
