"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Loader2, ChevronDown, X } from "lucide-react";

interface NutritionResult {
  recipe_name: string;
  detected_ingredients: string[];
  per_serving: {
    calories: number;
    fat_g: number;
    carbs_g: number;
    protein_g: number;
  };
  total_recipe_calories: number;
  confidence_score: number;
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
  
  // Image upload
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Collapsible
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setAnalyzeError("Image must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImageBase64(base64);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageBase64(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyze = async () => {
    if (!ingredients.trim() && !imageBase64) {
      setAnalyzeError("Please enter ingredients or upload an image");
      return;
    }

    setAnalyzeError("");
    setIsAnalyzing(true);
    setResult(null);

    try {
      const body: Record<string, unknown> = {
        servings: servings,
      };
      
      if (ingredients.trim()) {
        body.ingredients = ingredients;
      }
      
      if (imageBase64) {
        body.image = imageBase64;
      }

      const response = await fetch(
        "https://zrhkyznyumvcbbwlwsig.supabase.co/functions/v1/analyze",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer sb_publishable_XpBUBltwp7kJ8tNB_d8y_A_hsofjbf3",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        setAnalyzeError("Failed to analyze. Please try again.");
      }
    } catch {
      setAnalyzeError("Failed to analyze. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Email gate state
  if (state === "gate") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 relative">
        <Link 
          href="/" 
          className="absolute top-4 left-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to Homi
        </Link>
        <div className="w-full max-w-md text-center">
          <div className="text-5xl text-red-500 mb-6">🍎</div>
          
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Calorie Checker 🔥
          </h1>
          
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Know exactly what you&apos;re eating before you order.
            <br />
            Get instant calorie and macro breakdown for any recipe. Free.
          </p>
          
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="text-left">
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

  // Unlocked state
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link 
          href="/" 
          className="inline-block text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          &larr; Back to Homi
        </Link>
        <div className="text-center mb-6">
          <div className="text-5xl text-red-500 mb-4">🍎</div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Calorie Checker 🔥
          </h1>
          <p className="text-muted-foreground">
            Turn any recipe into an instant macro breakdown.
            <br />
            Paste ingredients or upload a recipe image.
          </p>
        </div>
        
        {/* Input Card */}
        <div className="border border-border rounded-xl p-6 mb-6">
          {/* Image Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Recipe Image
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              Upload a photo of your recipe or dish
            </p>
            
            {imagePreview ? (
              <div className="relative inline-block">
                <img 
                  src={imagePreview} 
                  alt="Recipe preview" 
                  className="max-h-48 rounded-lg border border-border"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 border-2 border-dashed border-border rounded-lg hover:border-muted-foreground transition-colors text-muted-foreground hover:text-foreground"
              >
                Click to upload
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          
          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-muted-foreground">AND / OR</span>
            <div className="flex-1 border-t border-border" />
          </div>
          
          {/* Collapsible Ingredients Section */}
          <div className="mb-6">
            <button
              onClick={() => setIsIngredientsOpen(!isIngredientsOpen)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-sm font-medium">Add Recipe Ingredients</span>
              <ChevronDown 
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  isIngredientsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            
            {isIngredientsOpen && (
              <div className="mt-3">
                <textarea
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder={"1/2 bowl palak paneer\n1/2 bowl sprouts"}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Include quantities for each item
                </p>
              </div>
            )}
          </div>
          
          {/* Servings + Button Row */}
          <div className="flex items-end gap-4">
            <div className="w-24">
              <label className="block text-sm font-medium mb-2">
                Servings
              </label>
              <input
                type="number"
                value={servings}
                onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex-1 py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Check Your Nutrition Facts 🔥"
              )}
            </button>
          </div>
          
          {analyzeError && (
            <p className="text-sm text-red-500 mt-3">{analyzeError}</p>
          )}
        </div>
        
        {/* Result Card */}
        {result && (
          <div className="border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-3">{result.recipe_name}</h2>
            
            {result.detected_ingredients && result.detected_ingredients.length > 0 && (
              <>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Ingredients
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  {result.detected_ingredients.join(", ")}
                </p>
              </>
            )}
            
            <div className="border-t border-border my-4" />
            
            {/* Nutrition Facts Header */}
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-bold text-lg">Nutrition Facts</span>
              <span className="text-sm text-muted-foreground">per serving</span>
            </div>
            
            <div className="border-t-8 border-foreground mb-3" />
            
            {/* Calories Row */}
            <div className="flex justify-between items-baseline py-2">
              <span className="font-medium">Calories</span>
              <span className="text-2xl font-bold">{result.per_serving.calories}</span>
            </div>
            
            <div className="border-t border-border" />
            
            {/* Macros */}
            <div className="flex justify-between py-2">
              <span>Total Fat</span>
              <span>{result.per_serving.fat_g}g</span>
            </div>
            
            <div className="border-t border-border" />
            
            <div className="flex justify-between py-2">
              <span>Total Carbohydrate</span>
              <span>{result.per_serving.carbs_g}g</span>
            </div>
            
            <div className="border-t border-border" />
            
            <div className="flex justify-between py-2">
              <span>Protein</span>
              <span>{result.per_serving.protein_g}g</span>
            </div>
            
            <div className="border-t border-border my-3" />
            
            {result.total_recipe_calories && (
              <p className="text-xs text-muted-foreground mb-4">
                Total recipe calories: {result.total_recipe_calories}
              </p>
            )}
            
            {/* Confidence Score */}
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Confidence Score</span>
                <span>{result.confidence_score}/100</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${result.confidence_score}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on ingredient clarity
              </p>
            </div>
            
            <div className="border-t border-border my-4" />
            
            <p className="text-xs text-muted-foreground text-center">
              ESTIMATES ONLY · NOT MEDICAL ADVICE
            </p>
            <p className="text-xs text-muted-foreground text-center">
              1 serving per recipe
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
