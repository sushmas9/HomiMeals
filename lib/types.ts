export interface UserIntent {
  cuisine: string | null;
  dietary_restrictions: string[];
  additional_details: string | null;
  location: {
    street: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
  };
}

export interface Message {
  id: string;
  role: "bot" | "user";
  content: string;
  component?: "cuisine" | "dietary" | "details" | "location" | "review";
}

export type ChatStep = "cuisine" | "dietary" | "details" | "location" | "review" | "complete";

export const CUISINE_OPTIONS = [
  "Italian",
  "Mexican",
  "Indian",
  "Thai",
] as const;

export const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Kosher",
  "Low-Carb",
  "Keto",
  "None",
] as const;

export const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
] as const;