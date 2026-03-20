import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MealCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/3 mt-2" />
          </div>
          <div className="flex flex-col items-center">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-3 w-8 mt-1" />
          </div>
        </div>
        <Skeleton className="h-1.5 w-full mt-4" />
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
