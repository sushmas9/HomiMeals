"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Meal } from "@/lib/meal-types";
import { cn } from "@/lib/utils";

interface MealCardProps {
  meal: Meal;
}

function getScoreColor(score: number): string {
  if (score >= 90) return "text-emerald-600";
  if (score >= 80) return "text-emerald-500";
  if (score >= 70) return "text-orange-500";
  return "text-orange-400";
}

function getProgressColor(score: number): string {
  if (score >= 90) return "bg-emerald-500";
  if (score >= 80) return "bg-emerald-400";
  if (score >= 70) return "bg-orange-400";
  return "bg-orange-300";
}

export function MealCard({ meal }: MealCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-foreground truncate">
              {meal.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {meal.cuisine}
            </p>
          </div>
          <div className="flex flex-col items-center shrink-0">
            <span className={cn("text-2xl font-bold", getScoreColor(meal.score))}>
              {meal.score}
            </span>
            <span className="text-xs text-muted-foreground">score</span>
          </div>
        </div>

        <div className="mt-4">
          <Progress 
            value={meal.score} 
            className="h-1.5 bg-muted"
          />
          <div 
            className={cn(
              "h-1.5 rounded-full -mt-1.5 transition-all",
              getProgressColor(meal.score)
            )}
            style={{ width: `${meal.score}%` }}
          />
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge 
            variant="secondary" 
            className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0"
          >
            {meal.dietary}
          </Badge>
          <Badge 
            variant="secondary"
            className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-0"
          >
            {meal.additional}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
