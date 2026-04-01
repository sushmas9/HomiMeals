"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { ArrowLeft, Star, ShieldCheck, ChefHat } from "lucide-react";

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

const AVATAR_COLORS = [
  "bg-orange-100 text-orange-600",
  "bg-green-100 text-green-600",
  "bg-blue-100 text-blue-600",
  "bg-purple-100 text-purple-600",
  "bg-rose-100 text-rose-600",
  "bg-amber-100 text-amber-600",
];

function getAvatarColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
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
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Choose Your Home Chef</h1>
            <p className="text-sm text-muted-foreground">
              {cooks.length} chef{cooks.length !== 1 ? "s" : ""} matched · Select a chef to view their menu and place your order
            </p>
          </div>
        </div>

        {cooks.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <ChefHat className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No chefs found. Try a different search.</p>
            <button
              onClick={() => router.push("/")}
              className="rounded-full bg-orange-500 px-4 py-2 text-sm text-white hover:bg-orange-600">
              Search Again
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cooks.map((cook) => (
              <button
                key={cook.id}
                onClick={() => router.push(`/cooks/${cook.id}`)}
                className="group rounded-2xl border border-border bg-card text-left shadow-sm hover:shadow-md transition-all p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold ${getAvatarColor(cook.name ?? "A")}`}>
                    {(cook.name ?? "?")[0].toUpperCase()}
                  </div>
                  {cook.license_verified && (
                    <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                      <ShieldCheck className="h-3 w-3" /> TX Licensed
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-foreground text-base">{cook.name}</h3>
                <p className="text-sm text-muted-foreground capitalize mt-0.5">
                  {cook.cuisine} cuisine · {cook.city}, {cook.state}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                    <span className="text-sm font-medium">{cook.rating}</span>
                  </div>
                  {cook.match_score != null && (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600">
                      {cook.match_score}/10 match
                    </span>
                  )}
                </div>
                {cook.match_reason && (
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{cook.match_reason}</p>
                )}
                <div className="mt-3 text-xs font-semibold text-orange-500 group-hover:underline">
                  View menu & order →
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
