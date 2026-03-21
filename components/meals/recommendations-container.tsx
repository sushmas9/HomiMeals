"use client";

import { useState, useEffect } from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { PreferenceForm } from "./preference-form";
import { MealsList } from "./meals-list";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { Meal, MealPreferences } from "@/lib/meal-types";

const WEBHOOK_URL = "https://sushmasara9.app.n8n.cloud/webhook/homi-orderpreference";

export function RecommendationsContainer() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("homi_meals");
    if (stored) {
      setMeals(JSON.parse(stored));
      setHasSubmitted(true);
      sessionStorage.removeItem("homi_meals");
    }
  }, []);

  const handleSubmit = async (preferences: MealPreferences) => {
    setIsLoading(true);
    setError(null);
    setHasSubmitted(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cuisine: preferences.cuisine,
          dietary_restrictions: preferences.dietary,
          additional_details: preferences.additional_details,
          location: preferences.address,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      console.log("n8n raw response:", data);

      // n8n returns [{ meals: [...] }]
      const mealsData: Meal[] = (Array.isArray(data) ? data[0]?.meals : data.meals) ?? [];

      if (!Array.isArray(mealsData) || mealsData.length === 0) {
        throw new Error("No meals returned. Check n8n Respond to Webhook node.");
      }

      setMeals(mealsData);
    } catch (err) {
      console.error("Fetch failed:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch recommendations.");
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setHasSubmitted(false);
    setMeals([]);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {!hasSubmitted ? (
        <div className="max-w-md mx-auto">
          <PreferenceForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Change preferences
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <MealsList meals={meals} isLoading={isLoading} />
        </>
      )}
    </div>
  );
}