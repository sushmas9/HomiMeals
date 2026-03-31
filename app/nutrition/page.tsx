"use client";

import { useState } from "react";
import { Header } from "@/components/header";

export default function NutritionPage() {
  const [state, setState] = useState<"gate" | "unlocked">("gate");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://zrhkyznyumvcbbwlwsig.supabase.co/rest/v1/leads",
        {
          method: "POST",
          headers: {
            apikey: "sb_publishable_XpBUBltwp7kJ8tNB_d8y_A_hsofjbf3",
            Authorization: "Bearer sb_publishable_XpBUBltwp7kJ8tNB_d8y_A_hsofjbf3",
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            email: email,
            source: "calorie_checker",
          }),
        }
      );

      if (response.ok || response.status === 201) {
        setState("unlocked");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (state === "unlocked") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <iframe
          src="https://preview--nutritionlabelgenerator.lovable.app"
          width="100%"
          style={{
            height: "calc(100vh - 64px)",
            border: "none",
          }}
          title="Nutrition Label Generator"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Free Calorie Checker 🔥
          </h1>
          <p className="text-muted-foreground">
            Get instant macro breakdown for any homemade meal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email to get access"
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Get Free Access"}
          </button>
        </form>
      </div>
    </div>
  );
}
