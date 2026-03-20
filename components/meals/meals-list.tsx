"use client";

import { useEffect, useState } from "react";
import { UtensilsCrossed } from "lucide-react";
import { MealCard } from "./meal-card";
import { MealCardSkeleton } from "./meal-card-skeleton";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import type { Meal } from "@/lib/meal-types";
import { mockMeals } from "@/lib/meal-types";

interface MealsListProps {
  meals?: Meal[];
}

export function MealsList({ meals: initialMeals }: MealsListProps) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with loading state
    const timer = setTimeout(() => {
      const data = initialMeals ?? mockMeals;
      // Sort by score descending
      const sortedMeals = [...data].sort((a, b) => b.score - a.score);
      setMeals(sortedMeals);
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [initialMeals]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <MealCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <Empty className="border rounded-xl py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UtensilsCrossed className="size-5" />
          </EmptyMedia>
          <EmptyTitle>No meals found</EmptyTitle>
          <EmptyDescription>
            We couldn&apos;t find any meal recommendations matching your preferences. Try adjusting your dietary restrictions or cuisine choices.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {meals.map((meal, index) => (
        <MealCard key={`${meal.name}-${index}`} meal={meal} />
      ))}
    </div>
  );
}
