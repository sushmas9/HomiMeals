"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import type { UserIntent, ChatStep } from "@/lib/types";
import { Pencil, MapPin, Utensils, AlertCircle, FileText } from "lucide-react";

interface ReviewCardProps {
  userIntent: UserIntent;
  onEdit: (field: ChatStep) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ReviewCard({ userIntent, onEdit, onSubmit, isSubmitting }: ReviewCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Review Your Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Utensils className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Cuisine</p>
              <p className="text-sm text-muted-foreground">{userIntent.cuisine}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit("cuisine")}
            disabled={isSubmitting}
          >
            <Pencil className="h-3 w-3" />
          </Button>
        </div>
        
        <Separator />
        
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Dietary Restrictions</p>
              <p className="text-sm text-muted-foreground">
                {userIntent.dietary_restrictions.join(", ")}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit("dietary")}
            disabled={isSubmitting}
          >
            <Pencil className="h-3 w-3" />
          </Button>
        </div>
        
        <Separator />
        
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Additional Details</p>
              <p className="text-sm text-muted-foreground">
                {userIntent.additional_details || "None"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit("details")}
            disabled={isSubmitting}
          >
            <Pencil className="h-3 w-3" />
          </Button>
        </div>
        
        <Separator />
        
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Delivery Location</p>
              <p className="text-sm text-muted-foreground">
                {userIntent.location.street}
                <br />
                {userIntent.location.city}, {userIntent.location.state} {userIntent.location.zip}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit("location")}
            disabled={isSubmitting}
          >
            <Pencil className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          size="lg"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner className="mr-2" />
              Submitting...
            </>
          ) : (
            "Submit Order Preferences"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
