"use client";

import { useState } from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { PreferenceForm } from "./preference-form";
import { MealsList } from "./meals-list";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { Meal, MealPreferences } from "@/lib/meal-types";

const WEBHOOK_URL = "YOUR_WEBHOOK_URL";

export function RecommendationsContainer() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async (preferences: MealPreferences) => {
    setIsLoading(true);
    setError(null);
    setHasSubmitted(true);

    try {
      const response = await fetch("https://sushmasara9.app.n8n.cloud/webhook-test/meal-recommendation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cuisine: preferences.cuisine,
          dietary: preferences.dietary,
          additional_details: preferences.additional_details,
          address: preferences.address,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("DATA:", data);
      // Normalize response: handle both { output: [...] } and [...] formats
      const mealsData: Meal[] = data.output || data;
      console.log("MEALS:", mealsData);

      if (!Array.isArray(mealsData)) {
        throw new Error("Invalid response format");
      }

      setMeals(mealsData);
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch meal recommendations. Please try again."
      );
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
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground"
            >
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
