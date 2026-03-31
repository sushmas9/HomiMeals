"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Loader2 } from "lucide-react";

interface NutritionResult {
  recipe_name: string;
  calories: number;
  total_fat: number;
  total_carbs: number;
  protein: number;
  confidence: number;
}

export default function NutritionPage() {
  const [state, setState] = useState<"gate" | "unlocked">("gate");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Unlocked state
  const [ingredients, setIngredients] = useState("");
  const [servings, setServings] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState("");
  const [result, setResult] = useState<NutritionResult | null>(null);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
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

  const handleAnalyze = async () => {
    if (!ingredients.trim()) {
      setAnalyzeError("Please enter some ingredients");
      return;
    }

    setAnalyzeError("");
    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch(
        "https://zrhkyznyumvcbbwlwsig.supabase.co/functions/v1/analyze",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer sb_publishable_XpBUBltwp7kJ8tNB_d8y_A_hsofjbf3",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ingredients: ingredients,
            servings: servings,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        setAnalyzeError("Failed to analyze ingredients. Please try again.");
      }
    } catch {
      setAnalyzeError("Failed to analyze ingredients. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Email gate state
  if (state === "gate") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl text-red-500 mb-6">🍎</div>
          
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Calorie Checker 🔥
          </h1>
          
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Know exactly what you&apos;re eating before you order.
            <br />
            Paste any recipe ingredients and get an instant
            <br />
            breakdown of calories, protein, carbs and fat.
            <br />
            100% free. No app needed.
          </p>
          
          <div className="border-t border-border my-6" />
          
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="text-left">
              <label className="block text-sm font-medium mb-2">
                Get free access
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
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

  // Unlocked state
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold tracking-tight mb-6 text-center">
          Calorie Checker 🔥
        </h1>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Add Recipe Ingredients
            </label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder={"2 chicken breasts\n1 cup rice\n1 tbsp olive oil"}
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Servings
            </label>
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          {analyzeError && (
            <p className="text-sm text-red-500">{analyzeError}</p>
          )}
          
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Generate Label 🔥"
            )}
          </button>
        </div>
        
        {result && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">{result.recipe_name}</h2>
            
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-orange-500">
                {result.calories}
              </div>
              <div className="text-sm text-muted-foreground">Calories per serving</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg font-semibold">{result.total_fat}g</div>
                <div className="text-xs text-muted-foreground">Total Fat</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg font-semibold">{result.total_carbs}g</div>
                <div className="text-xs text-muted-foreground">Total Carbs</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg font-semibold">{result.protein}g</div>
                <div className="text-xs text-muted-foreground">Protein</div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Confidence</span>
                <span>{result.confidence}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              ESTIMATES ONLY · NOT MEDICAL ADVICE
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
