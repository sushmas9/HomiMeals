export interface Meal {
  name: string;
  cuisine: string;
  dietary: string;
  additional: string;
  score: number;
}

export const mockMeals: Meal[] = [
  {
    name: "Vegetable Biryani",
    cuisine: "Indian",
    dietary: "Vegetarian",
    additional: "Low Oil",
    score: 95,
  },
  {
    name: "Chana Masala",
    cuisine: "Indian",
    dietary: "Vegetarian",
    additional: "Low Oil",
    score: 90,
  },
  {
    name: "Pad Thai",
    cuisine: "Thai",
    dietary: "Vegan",
    additional: "Spicy",
    score: 88,
  },
  {
    name: "Grilled Salmon Bowl",
    cuisine: "Japanese",
    dietary: "Gluten-Free",
    additional: "High Protein",
    score: 85,
  },
  {
    name: "Mediterranean Quinoa Salad",
    cuisine: "Mediterranean",
    dietary: "Vegan",
    additional: "Low Calorie",
    score: 82,
  },
  {
    name: "Butter Chicken",
    cuisine: "Indian",
    dietary: "Gluten-Free",
    additional: "Creamy",
    score: 78,
  },
];
