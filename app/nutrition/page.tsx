import { Header } from "@/components/header";

export default function NutritionPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <iframe
        src="https://preview--nutritionlabelgenerator.lovable.app"
        width="100%"
        style={{
          height: "calc(100vh - 64px)",
          border: "none",
        }}
        title="Nutrition Label Generator"
      />
    </div>
  );
}
