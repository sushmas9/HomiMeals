import { RecommendationsContainer } from "@/components/meals/recommendations-container";

export const metadata = {
  title: "Recommended Meals | Homi",
  description: "Get personalized meal recommendations based on your preferences",
};

export default function RecommendationsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Recommended Meals
          </h1>
          <p className="text-muted-foreground mt-2">
            Tell us your preferences and we&apos;ll find the perfect meals for you
          </p>
        </header>

        <RecommendationsContainer />
      </div>
    </main>
  );
}
