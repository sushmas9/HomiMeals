"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CUISINE_OPTIONS } from "@/lib/types";

interface CuisineInputProps {
  onSubmit: (cuisine: string) => void;
  defaultValue?: string | null;
}

export function CuisineInput({ onSubmit, defaultValue }: CuisineInputProps) {
  const [selected, setSelected] = useState<string>(defaultValue || "");
  const [custom, setCustom] = useState("");
  const [error, setError] = useState("");

  const handleSelect = (cuisine: string) => {
    setSelected(cuisine);
    setCustom("");
    setError("");
  };

  const handleSubmit = () => {
    const value = custom.trim() || selected;
    if (!value) {
      setError("Please select or enter a cuisine type");
      return;
    }
    onSubmit(value);
  };

  return (
    <div className="w-full space-y-4 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap gap-2">
        {CUISINE_OPTIONS.map((cuisine) => (
          <Button
            key={cuisine}
            variant={selected === cuisine && !custom ? "default" : "outline"}
            size="sm"
            onClick={() => handleSelect(cuisine)}
            className="rounded-full"
          >
            {cuisine}
          </Button>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Or type a different cuisine..."
          value={custom}
          onChange={(e) => {
            setCustom(e.target.value);
            setSelected("");
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="flex-1"
        />
        <Button onClick={handleSubmit}>
          Continue
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
