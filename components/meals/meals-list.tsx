"use client";

import { UtensilsCrossed } from "lucide-react";
import { MealCard } from "./meal-card";
import { MealCardSkeleton } from "./meal-card-skeleton";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import type { Meal } from "@/lib/meal-types";

interface MealsListProps {
  meals: Meal[];
  isLoading: boolean;
}

export function MealsList({ meals, isLoading }: MealsListProps) {
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
            We couldn&apos;t find any meal recommendations matching your preferences. Try adjusting your selections.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  // Sort by score descending
  const sortedMeals = [...meals];
  // const sortedMeals = [...meals].sort((a, b) => b.score - a.score);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedMeals.map((meal, index) => (
        <MealCard key={`${meal.name}-${index}`} meal={meal} />
      ))}
    </div>
  );
}
