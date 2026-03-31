"use client";

import Link from "next/link";
import { UtensilsCrossed, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const handleHomeClick = () => {
    // Clear localStorage to reset chat state
    localStorage.removeItem("homi-chat-state");
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <button 
          onClick={handleHomeClick}
          className="flex items-center gap-2 transition-opacity hover:opacity-70"
        >
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">Homi</h1>
        </button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/nutrition">
              <span className="mr-2 text-red-500">🍎</span>
              Calorie Checker 🔥
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleHomeClick}>
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </div>
      </div>
    </header>
  );
}
