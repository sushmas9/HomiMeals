"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { ArrowLeft, Star, ShieldCheck, ChefHat } from "lucide-react";
import { DynamicImage } from "@/components/ui/dynamic-image";
import { getSeed } from "@/lib/food-images";

interface Cook {
  id: string;
  name: string;
  cuisine: string;
  city: string;
  state: string;
  zip: string;
  rating: number;
  license_verified: boolean;
  match_score?: number;
  match_reason?: string;
}

function unwrapCooks(data: unknown): Cook[] {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data.flatMap((item: Cook) =>
      item && typeof item === "object" && "cooks" in item && Array.isArray((item as { cooks: Cook[] }).cooks)
        ? (item as { cooks: Cook[] }).cooks
        : [item]
    );
  }
  if (typeof data === "object" && data !== null && "cooks" in data) {
    return unwrapCooks((data as { cooks: unknown }).cooks);
  }
  return [];
}

export default function CooksPage() {
  const [cooks, setCooks] = useState<Cook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("homi_cooks");
    if (stored) {
      try {
        const raw = JSON.parse(stored);
        const list = unwrapCooks(raw);
        const valid = list.filter(c => c && c.id && c.name);
        setCooks(valid);
      } catch {
        setCooks([]);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center gap-4">
          <button onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Home Cooks Near You</h1>
            <p className="text-sm text-muted-foreground">
              {cooks.length} cook{cooks.length !== 1 ? "s" : ""} found · Ranked by match & certification
            </p>
          </div>
        </div>

        {cooks.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <ChefHat className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No cooks found. Try a different search.</p>
            <button onClick={() => router.push("/")}
              className="rounded-full bg-orange-500 px-4 py-2 text-sm text-white hover:bg-orange-600">
              Search Again
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cooks.map((cook) => (
              <button key={cook.id} onClick={() => router.push(`/cooks/${cook.id}`)}
                className="group overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm hover:shadow-md transition-all">
                <div className="relative h-36 w-full overflow-hidden">
                  <DynamicImage
                    query={`${cook.cuisine ?? "food"} cuisine authentic dish food photography`}
                    seed={getSeed(cook.name ?? cook.cuisine ?? "food")}
                    alt={cook.name ?? "Cook"}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  {cook.license_verified && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white shadow">
                      <ShieldCheck className="h-3 w-3" /> Licensed
                    </div>
                  )}
                  {cook.match_score != null && (
                    <div className="absolute top-2 left-2 rounded-full bg-orange-500 px-2 py-1 text-xs font-bold text-white shadow">