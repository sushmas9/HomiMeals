"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DynamicImage } from "@/components/ui/dynamic-image";
import { getSeed } from "@/lib/food-images";

interface Meal {
  id: string;
  name: string;
  cuisine: string;
  dietary_tags?: string[];
  additional_tags?: string[];
  price: number;
  available: boolean;
  // legacy fields — optional
  score?: number;
  dietary?: string;
  additional?: string;
  description?: string;
  image?: string;
}

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  // Handle both old shape (dietary, additional) and new shape (dietary_tags, additional_tags)
  const dietaryTags = meal.dietary_tags ?? (meal.dietary ? [meal.dietary] : []);
  const additionalTags = meal.additional_tags ?? (meal.additional ? [meal.additional] : []);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg group">
      <div className="relative h-40 w-full overflow-hidden">
        <DynamicImage
          query={`${meal.name} ${meal.cuisine} food dish`}
          seed={getSeed(meal.name)}
          alt={meal.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-foreground truncate">{meal.name}</h3>
            <p className="text-sm text-muted-foreground capitalize">{meal.cuisine}</p>
          </div>
          <span className="text-base font-bold text-foreground shrink-0">
            ${Number(meal.price).toFixed(2)}
          </span>
        </div>

        {meal.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{meal.description}</p>
        )}

        <div className="flex flex-wrap gap-1.5 mt-3">
          {dietaryTags.map(tag => (
            <Badge key={tag} variant="secondary"
              className="bg-green-100 text-green-700 hover:bg-green-100 border-0 capitalize">
              {tag}
            </Badge>
          ))}
          {additionalTags.map(tag => (
            <Badge key={tag} variant="secondary"
              className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-0 capitalize">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}