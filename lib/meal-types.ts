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

export function getCuisinePlaceholder(cuisine: string, mealName?: string): string {
  const query = mealName
    ? encodeURIComponent(mealName.split(" ").slice(0, 3).join(" "))
    : encodeURIComponent(cuisine + " food");

  // Uses a deterministic seed based on the meal name so the image
  // stays consistent on re-renders instead of changing every load
  const seed = (mealName || cuisine)
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);

  return `https://images.unsplash.com/photo-${getPhotoId(seed)}?w=400&h=300&fit=crop`;
}

// Pool of food photos from Unsplash — deterministically picked by seed
function getPhotoId(seed: number): string {
  const photos = [
    "1565299624946-b28f40a0ae38", // pizza
    "1585937421612-70a008356fbe", // indian
    "1525755662778-989d0524087e", // chinese
    "1559314809-0d155014e29e",   // thai
    "1580822184713-fc5400e7fe10", // sushi
    "1544025162-d76694265947",   // mediterranean
    "1568901346375-23c9450c58cd", // burger
    "1546069901-ba9599a7e63c",   // salad
    "1565299585323-38d6b0865b47", // tacos
    "1504674900247-0877df9cc836", // food spread
    "1482049016688-2d3e1b311543", // eggs
    "1467003909585-2f8a72700288", // noodles
    "1540189549336-e6e99e2a3e46", // pasta
    "1512621776951-a57141f2eefd", // vegetables
    "1455619452474-d2be8b1e70cd", // curry
    "1476224203421-9ac39bcb3327", // steak
  ];
  return photos[seed % photos.length];
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