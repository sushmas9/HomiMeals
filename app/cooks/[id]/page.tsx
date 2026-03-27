"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Header } from "@/components/header";
import { ArrowLeft, Star, ShieldCheck, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DynamicImage } from "@/components/ui/dynamic-image";
import { getSeed } from "@/lib/food-images";

interface Meal {
  id: string;
  name: string;
  cuisine: string;
  dietary_tags: string[];
  additional_tags: string[];
  price: number;
  available: boolean;
}

interface Cook {
  id: string;
  name: string;
  cuisine: string;
  city: string;
  state: string;
  rating: number;
  license_verified: boolean;
  match_score?: number;
  match_reason?: string;
}

interface CartItem {
  meal: Meal;
  quantity: number;
}

const COOK_MEALS_WEBHOOK = "https://sushmasara9.app.n8n.cloud/webhook/homi-cook-meals";

export default function CookDetailPage() {
  const [cook, setCook] = useState<Cook | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const router = useRouter();
  const params = useParams();
  const cookId = params.id as string;

  useEffect(() => {
    // Try sessionStorage first
    const stored = sessionStorage.getItem("homi_cooks");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const list: Cook[] = Array.isArray(data) ? data : data.cooks ?? [];
        const found = list.find(c => c.id === cookId);
        if (found) setCook(found);
      } catch { }
    }

    // Fallback: fetch cook directly from Supabase if not in sessionStorage
    if (!sessionStorage.getItem("homi_cooks")) {
      fetch(
        `https://zrhkyznyumvcbbwlwsig.supabase.co/rest/v1/home_cooks?id=eq.${cookId}&select=id,name,cuisine,city,state,zip,rating,license_verified`,
        {
          headers: {
            apikey: "sb_publishable_XpBUBltwp7kJ8tNB_d8y_A_hsofjbf3",
            Authorization: "Bearer sb_publishable_XpBUBltwp7kJ8tNB_d8y_A_hsofjbf3",
          },
        }
      )
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) setCook(data[0]);
        })
        .catch(() => { });
    }


    // useEffect(() => {
    //   const stored = sessionStorage.getItem("homi_cooks");
    //   if (stored) {
    //     try {
    //       const data = JSON.parse(stored);
    //       const list: Cook[] = Array.isArray(data) ? data : data.cooks ?? [];
    //       const found = list.find(c => c.id === cookId);
    //       if (found) setCook(found);
    //     } catch { }
    //   }

    fetch(COOK_MEALS_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cook_id: cookId }),
    })
      .then(r => r.json())
      .then(data => setMeals(Array.isArray(data.meals) ? data.meals : []))
      .catch(() => setMeals([]))
      .finally(() => setIsLoading(false));
  }, [cookId]);

  const addToCart = (meal: Meal) => {
    setCart(prev => {
      const existing = prev.find(i => i.meal.id === meal.id);
      if (existing) return prev.map(i => i.meal.id === meal.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { meal, quantity: 1 }];
    });
  };

  const removeFromCart = (mealId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.meal.id === mealId);
      if (!existing) return prev;
      if (existing.quantity === 1) return prev.filter(i => i.meal.id !== mealId);
      return prev.map(i => i.meal.id === mealId ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  const getQuantity = (mealId: string) => cart.find(i => i.meal.id === mealId)?.quantity || 0;
  const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = cart.reduce((acc, i) => acc + i.meal.price * i.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">

        <button onClick={() => router.push("/cooks")}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to cooks
        </button>

        {cook && (
          <div className="mb-8 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-2xl font-bold text-orange-500">
                {cook.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-foreground">{cook.name}</h1>
                  {cook.license_verified && (
                    <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                      <ShieldCheck className="h-3 w-3" /> TX Licensed
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground capitalize">
                  {cook.cuisine} cuisine · {cook.city}, {cook.state}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                    <span className="text-sm font-medium">{cook.rating}</span>
                  </div>
                  {cook.match_score && (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600">
                      {cook.match_score}/10 match
                    </span>
                  )}
                </div>
              </div>
            </div>
            {cook.match_reason && (
              <p className="mt-4 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
                💡 {cook.match_reason}
              </p>
            )}
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Menu</h2>
          {totalItems > 0 && (
            <button onClick={() => setShowCart(!showCart)}
              className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
              <ShoppingCart className="h-4 w-4" />
              {totalItems} item{totalItems > 1 ? "s" : ""} · ${totalPrice.toFixed(2)}
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          </div>
        ) : meals.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">No meals available right now.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {meals.map(meal => {
              const qty = getQuantity(meal.id);
              return (
                <div key={meal.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="h-36 w-full overflow-hidden">
                    <DynamicImage
                      query={`${meal.name} ${meal.cuisine} food dish`}
                      seed={getSeed(meal.name)}
                      alt={meal.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{meal.name}</h3>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {meal.dietary_tags?.map(tag => (
                            <span key={tag} className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 capitalize">{tag}</span>
                          ))}
                          {meal.additional_tags?.map(tag => (
                            <span key={tag} className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700 capitalize">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <span className="text-base font-bold text-foreground">${meal.price.toFixed(2)}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-end">
                      {qty === 0 ? (
                        <Button size="sm" onClick={() => addToCart(meal)}
                          className="bg-orange-500 hover:bg-orange-600 text-white text-xs">
                          Add to order
                        </Button>
                      ) : (
                        <div className="flex items-center gap-3">
                          <button onClick={() => removeFromCart(meal.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border hover:bg-muted transition-colors">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-4 text-center text-sm font-semibold">{qty}</span>
                          <button onClick={() => addToCart(meal)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showCart && cart.length > 0 && !orderPlaced && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-4 font-bold text-foreground">Your Order</h3>
            <div className="space-y-2">
              {cart.map(({ meal, quantity }) => (
                <div key={meal.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{meal.name} × {quantity}</span>
                  <span className="font-medium">${(meal.price * quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="font-bold text-foreground">Total</span>
              <span className="text-lg font-bold text-orange-500">${totalPrice.toFixed(2)}</span>
            </div>
            <Button className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => setOrderPlaced(true)}>
              Place Order
            </Button>
          </div>
        )}

        {orderPlaced && (
          <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold text-green-800">Order Confirmed!</h3>
            <p className="mt-1 text-sm text-green-700">
              Your order has been placed with {cook?.name}.
            </p>
            <div className="mt-4 rounded-xl bg-white border border-green-100 p-4 text-left space-y-2">
              {cart.map(({ meal, quantity }) => (
                <div key={meal.id} className="flex justify-between text-sm">
                  <span className="text-foreground">{meal.name} × {quantity}</span>
                  <span className="font-medium">${(meal.price * quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-green-100 pt-2 font-bold">
                <span>Total</span>
                <span className="text-orange-500">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-green-600">
              Full ordering & payment coming in Phase 2 🚀
            </p>
            <button onClick={() => router.push("/")}
              className="mt-4 rounded-full bg-orange-500 px-6 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
              Back to Home
            </button>
          </div>
        )}
      </main>
    </div>
  );
}