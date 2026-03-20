import { MealsList } from "@/components/meals/meals-list";

export const metadata = {
  title: "Recommended Meals | Homi",
  description: "Personalized meal recommendations based on your preferences",
};

export default function RecommendationsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Recommended Meals
          </h1>
          <p className="text-muted-foreground mt-2">
            Personalized suggestions based on your preferences
          </p>
        </header>

        <MealsList />
      </div>
    </main>
  );
}
