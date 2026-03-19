"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface DetailsInputProps {
  onSubmit: (details: string) => void;
  defaultValue?: string | null;
}

export function DetailsInput({ onSubmit, defaultValue }: DetailsInputProps) {
  const [details, setDetails] = useState(defaultValue || "");

  const handleSubmit = () => {
    onSubmit(details.trim() || "none");
  };

  return (
    <div className="w-full space-y-4 rounded-xl border border-border bg-card p-4">
      <Textarea
        placeholder="E.g., 'Extra spicy, no onions, prefer family-style portions'..."
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        rows={3}
        className="resize-none"
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => onSubmit("none")}>
          Skip
        </Button>
        <Button onClick={handleSubmit}>
          Continue
        </Button>
      </div>
    </div>
  );
}
