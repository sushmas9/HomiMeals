"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { ArrowLeft, Star, ShieldCheck, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

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

function getCuisineImage(cuisine: string, name: string): string {
  const query = encodeURIComponent(`${cuisine} food cooking`);
  const seed = (name + cuisine).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return `https://source.unsplash.com/400x200/?${query}&sig=${seed}`;
}

export default function CooksPage() {
  const [cooks, setCooks] = useState<Cook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("homi_cooks");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const list = Array.isArray(data) ? data : data.cooks ?? [];
        setCooks(list);
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
            <p className="text-sm text-muted-foreground">{cooks.length} cooks found · Ranked by match & certification</p>
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
                  <img src={getCuisineImage(cook.cuisine, cook.name)} alt={cook.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  {cook.license_verified && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white shadow">
                      <ShieldCheck className="h-3 w-3" /> Licensed
                    </div>
                  )}
                  {cook.match_score && (
                    <div className="absolute top-2 left-2 rounded-full bg-orange-500 px-2 py-1 text-xs font-bold text-white shadow">
                      {cook.match_score}/10 match
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{cook.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{cook.cuisine} cuisine</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                      <span className="font-medium">{cook.rating}</span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground capitalize">
                    {cook.city}, {cook.state}
                  </p>
                  {cook.match_reason && (
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{cook.match_reason}</p>
                  )}
                  <div className="mt-3 text-xs font-medium text-orange-500 group-hover:underline">
                    View meals →
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}