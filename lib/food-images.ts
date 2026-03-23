// Curated Unsplash photo IDs by cuisine and meal keyword
const MEAL_IMAGES: Record<string, string> = {
  // Indian
  "butter chicken": "1585937421612-70a008356fbe",
  "chicken biryani": "1563379091-9a03eb8b4b5e",
  "palak paneer": "1631452180775-7c8987c1c175",
  "vegan dal tadka": "1546833998-877b37c2e5c6",
  "dal makhani": "1546833998-877b37c2e5c6",
  "chana masala": "1546833998-877b37c2e5c6",
  "aloo gobi": "1512621776951-a57141f2eefd",
  "vegetable biryani": "1563379091-9a03eb8b4b5e",
  "saag paneer": "1631452180775-7c8987c1c175",
  "rajma chawal": "1546833998-877b37c2e5c6",
  "tandoori roti": "1555243896-b8c1a5e0b6e3",
  "mango lassi": "1553361371-9b14fc93b5f5",
  "pav bhaji": "1585937421612-70a008356fbe",
  "masala dosa": "1630383249896-483b095b5ef1",
  "chole bhature": "1585937421612-70a008356fbe",
  "kheer": "1553361371-9b14fc93b5f5",
  "lamb rogan josh": "1585937421612-70a008356fbe",
  "garlic naan": "1555243896-b8c1a5e0b6e3",
  "paneer tikka": "1631452180775-7c8987c1c175",
  "chicken tikka": "1585937421612-70a008356fbe",

  // Italian
  "spaghetti arrabbiata": "1565299624946-b28f40a0ae38",
  "margherita pizza": "1565299624946-b28f40a0ae38",
  "chicken parmigiana": "1476224203421-9ac39bcb3327",
  "vegan pesto pasta": "1540189549336-e6e99e2a3e46",
  "fettuccine alfredo": "1540189549336-e6e99e2a3e46",
  "eggplant parmesan": "1476224203421-9ac39bcb3327",
  "osso buco": "1476224203421-9ac39bcb3327",
  "vegan risotto": "1476224203421-9ac39bcb3327",
  "spaghetti carbonara": "1540189549336-e6e99e2a3e46",
  "penne arrabbiata": "1540189549336-e6e99e2a3e46",
  "tiramisu": "1553361371-9b14fc93b5f5",
  "bruschetta": "1546069901-ba9599a7e63c",
  "lasagna": "1476224203421-9ac39bcb3327",
  "caprese salad": "1546069901-ba9599a7e63c",
  "gnocchi al pesto": "1540189549336-e6e99e2a3e46",
  "panna cotta": "1553361371-9b14fc93b5f5",
  "risotto ai funghi": "1476224203421-9ac39bcb3327",
  "minestrone soup": "1546069901-ba9599a7e63c",
  "pizza margherita": "1565299624946-b28f40a0ae38",
  "cannoli": "1553361371-9b14fc93b5f5",

  // Thai
  "pad thai": "1559314809-0d155014e29e",
  "green curry": "1455619452474-d2be8b1e70cd",
  "tom yum soup": "1455619452474-d2be8b1e70cd",
  "mango sticky rice": "1553361371-9b14fc93b5f5",
  "pad see ew": "1559314809-0d155014e29e",
  "thai spring rolls": "1546069901-ba9599a7e63c",
  "massaman curry": "1455619452474-d2be8b1e70cd",
  "coconut rice": "1553361371-9b14fc93b5f5",
  "som tam salad": "1512621776951-a57141f2eefd",
  "khao pad": "1559314809-0d155014e29e",
  "thai basil tofu": "1559314809-0d155014e29e",
  "taro pudding": "1553361371-9b14fc93b5f5",
  "pad krapow": "1559314809-0d155014e29e",
  "tom kha soup": "1455619452474-d2be8b1e70cd",
  "vegan pad thai": "1559314809-0d155014e29e",
  "sticky rice mango": "1553361371-9b14fc93b5f5",
  "larb tofu": "1512621776951-a57141f2eefd",
  "thai red curry": "1455619452474-d2be8b1e70cd",
  "tofu satay": "1546069901-ba9599a7e63c",
  "banana roti": "1553361371-9b14fc93b5f5",

  // Mexican
  "chicken tacos": "1565299585323-38d6b0865b47",
  "veggie burrito": "1565299585323-38d6b0865b47",
  "beef enchiladas": "1565299585323-38d6b0865b47",
  "black bean quesadilla": "1565299585323-38d6b0865b47",
  "vegan tacos": "1565299585323-38d6b0865b47",
  "tamales": "1565299585323-38d6b0865b47",
  "pozole": "1546069901-ba9599a7e63c",
  "mole chicken": "1476224203421-9ac39bcb3327",
  "cheese quesadilla": "1565299585323-38d6b0865b47",
  "guacamole & chips": "1546069901-ba9599a7e63c",
  "chicken burrito": "1565299585323-38d6b0865b47",
  "churros": "1553361371-9b14fc93b5f5",
  "carne asada tacos": "1565299585323-38d6b0865b47",
  "vegan nachos": "1565299585323-38d6b0865b47",
  "refried bean tacos": "1565299585323-38d6b0865b47",
  "tres leches": "1553361371-9b14fc93b5f5",
  "vegetarian enchiladas": "1565299585323-38d6b0865b47",
  "black bean soup": "1546069901-ba9599a7e63c",
  "shrimp tacos": "1565299585323-38d6b0865b47",
  "flan": "1553361371-9b14fc93b5f5",
};

const CUISINE_FALLBACK: Record<string, string> = {
  indian: "1585937421612-70a008356fbe",
  italian: "1565299624946-b28f40a0ae38",
  mexican: "1565299585323-38d6b0865b47",
  thai: "1559314809-0d155014e29e",
  chinese: "1525755662778-989d0524087e",
  mediterranean: "1544025162-d76694265947",
  american: "1568901346375-23c9450c58cd",
};

export function getMealImage(mealName: string, cuisine: string): string {
  const key = mealName.toLowerCase().trim();
  const photoId = MEAL_IMAGES[key] || CUISINE_FALLBACK[cuisine?.toLowerCase()] || "1546069901-ba9599a7e63c";
  return `https://images.unsplash.com/photo-${photoId}?w=400&h=200&fit=crop`;
}

export function getCookImage(cuisine: string, name: string): string {
  const photoId = CUISINE_FALLBACK[cuisine?.toLowerCase()] || "1546069901-ba9599a7e63c";
  return `https://images.unsplash.com/photo-${photoId}?w=400&h=200&fit=crop`;
}