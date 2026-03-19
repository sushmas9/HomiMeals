"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DIETARY_OPTIONS } from "@/lib/types";

interface DietaryInputProps {
  onSubmit: (restrictions: string[]) => void;
  defaultValue?: string[];
}

export function DietaryInput({ onSubmit, defaultValue = [] }: DietaryInputProps) {
  const [selected, setSelected] = useState<string[]>(defaultValue);
  const [error, setError] = useState("");

  const handleToggle = (option: string) => {
    setError("");
    if (option === "None") {
      setSelected(["None"]);
      return;
    }
    
    setSelected((prev) => {
      const withoutNone = prev.filter((s) => s !== "None");
      if (prev.includes(option)) {
        return withoutNone.filter((s) => s !== option);
      }
      return [...withoutNone, option];
    });
  };

  const handleSubmit = () => {
    if (selected.length === 0) {
      setError("Please select at least one option (or 'None')");
      return;
    }
    onSubmit(selected);
  };

  return (
    <div className="w-full space-y-4 rounded-xl border border-border bg-card p-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {DIETARY_OPTIONS.map((option) => (
          <div key={option} className="flex items-center gap-2">
            <Checkbox
              id={option}
              checked={selected.includes(option)}
              onCheckedChange={() => handleToggle(option)}
            />
            <Label htmlFor={option} className="cursor-pointer text-sm">
              {option}
            </Label>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSubmit}>
          Continue
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
