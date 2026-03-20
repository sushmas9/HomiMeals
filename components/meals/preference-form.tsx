"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cuisineOptions, dietaryOptions, type MealPreferences } from "@/lib/meal-types";

interface PreferenceFormProps {
  onSubmit: (preferences: MealPreferences) => void;
  isLoading: boolean;
}

export function PreferenceForm({ onSubmit, isLoading }: PreferenceFormProps) {
  const [cuisine, setCuisine] = useState("");
  const [dietary, setDietary] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cuisine || !address) return;
    
    onSubmit({
      cuisine,
      dietary: dietary || "No Preference",
      additional_details: additionalDetails,
      address,
    });
  };

  const isValid = cuisine && address;

  return (
    <Card className="border-2 border-emerald-100">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-foreground">
          What are you in the mood for?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel>Cuisine Type</FieldLabel>
              <Select value={cuisine} onValueChange={setCuisine}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a cuisine" />
                </SelectTrigger>
                <SelectContent>
                  {cuisineOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Dietary Preference</FieldLabel>
              <Select value={dietary} onValueChange={setDietary}>
                <SelectTrigger>
                  <SelectValue placeholder="Select dietary preference" />
                </SelectTrigger>
                <SelectContent>
                  {dietaryOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>
                Additional Details <span className="text-muted-foreground">(optional)</span>
              </FieldLabel>
              <Textarea
                placeholder="e.g., spicy food, low calorie, comfort food..."
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                rows={2}
              />
            </Field>

            <Field>
              <FieldLabel>Delivery Address</FieldLabel>
              <Input
                placeholder="Enter your full address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Field>

            <Button 
              type="submit" 
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finding meals...
                </>
              ) : (
                "Get Recommendations"
              )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
