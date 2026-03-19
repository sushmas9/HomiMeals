"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { US_STATES, type UserIntent } from "@/lib/types";

interface LocationInputProps {
  onSubmit: (location: UserIntent["location"]) => void;
  defaultValue?: UserIntent["location"];
}

export function LocationInput({ onSubmit, defaultValue }: LocationInputProps) {
  const [location, setLocation] = useState({
    street: defaultValue?.street || "",
    city: defaultValue?.city || "",
    state: defaultValue?.state || "",
    zip: defaultValue?.zip || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!location.street.trim()) {
      newErrors.street = "Street address is required";
    }
    if (!location.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!location.state) {
      newErrors.state = "State is required";
    }
    if (!location.zip.trim()) {
      newErrors.zip = "Zip code is required";
    } else if (!/^\d{5}$/.test(location.zip.trim())) {
      newErrors.zip = "Please enter a valid 5-digit US zip code";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        street: location.street.trim(),
        city: location.city.trim(),
        state: location.state,
        zip: location.zip.trim(),
      });
    }
  };

  return (
    <div className="w-full space-y-4 rounded-xl border border-border bg-card p-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="street">Street Address</FieldLabel>
          <Input
            id="street"
            placeholder="123 Main St, Apt 4"
            value={location.street}
            onChange={(e) => {
              setLocation({ ...location, street: e.target.value });
              setErrors({ ...errors, street: "" });
            }}
          />
          {errors.street && <p className="text-sm text-destructive">{errors.street}</p>}
        </Field>
        
        <Field>
          <FieldLabel htmlFor="city">City</FieldLabel>
          <Input
            id="city"
            placeholder="Austin"
            value={location.city}
            onChange={(e) => {
              setLocation({ ...location, city: e.target.value });
              setErrors({ ...errors, city: "" });
            }}
          />
          {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
        </Field>
        
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="state">State</FieldLabel>
            <Select
              value={location.state}
              onValueChange={(value) => {
                setLocation({ ...location, state: value });
                setErrors({ ...errors, state: "" });
              }}
            >
              <SelectTrigger id="state">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
          </Field>
          
          <Field>
            <FieldLabel htmlFor="zip">Zip Code</FieldLabel>
            <Input
              id="zip"
              placeholder="78701"
              value={location.zip}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 5);
                setLocation({ ...location, zip: value });
                setErrors({ ...errors, zip: "" });
              }}
              maxLength={5}
            />
            {errors.zip && <p className="text-sm text-destructive">{errors.zip}</p>}
          </Field>
        </div>
      </FieldGroup>
      
      <div className="flex justify-end">
        <Button onClick={handleSubmit}>
          Continue
        </Button>
      </div>
    </div>
  );
}
