"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Meal } from "@/lib/meal-types";
import { getCuisinePlaceholder } from "@/lib/meal-types";
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
  const imageUrl = meal.image || getCuisinePlaceholder(meal.cuisine);
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg group">
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={meal.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3">
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full bg-background/90 backdrop-blur-sm shadow-sm",
          )}>
            <span className={cn("text-lg font-bold", getScoreColor(meal.score))}>
              {meal.score}
            </span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-foreground truncate">
              {meal.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {meal.cuisine}
            </p>
          </div>
        </div>

        {meal.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
            {meal.description}
          </p>
        )}

        <div className="mt-3">
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

        <div className="flex flex-wrap gap-2 mt-3">
          <Badge 
            variant="secondary" 
            className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0"
          >
            {meal.dietary}
          </Badge>
          {meal.additional && (
            <Badge 
              variant="secondary"
              className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-0"
            >
              {meal.additional}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
