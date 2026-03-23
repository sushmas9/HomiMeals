import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { MessageCircle, ChefHat, Heart, Leaf, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      {/* Hero */}
      <section className="relative flex min-h-[480px] items-center justify-center overflow-hidden bg-neutral-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&h=600&fit=crop')",
          }}
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Fresh. Local. Homemade.
          </h1>
          <p className="mt-3 text-lg text-neutral-300">
            Home cooks in your area, ready to serve you.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="flex flex-1 flex-col items-center px-4 py-16 md:flex-row md:items-start md:justify-center md:gap-20 md:py-24">

        {/* Left */}
        <div className="max-w-md">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Real Homemade Food, Real People
          </p>
          <h2 className="text-4xl font-bold leading-tight text-foreground">
            Homemade Meals
          </h2>
          <h2 className="text-4xl font-bold leading-tight text-orange-500">
            Made With Love
          </h2>
          <p className="mt-4 text-muted-foreground">
            Skip the chains. Discover home cooks in your area serving authentic,
            homemade meals crafted with care and fresh local ingredients.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/chat">
              <Button size="lg" className="gap-2 bg-orange-500 hover:bg-orange-600 text-white">
                <MessageCircle className="h-4 w-4" />
                Start Conversation
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { icon: ChefHat, label: "Home Cooks" },
              { icon: Heart, label: "Made with Love" },
              { icon: Leaf, label: "Fresh Ingredients" },
              { icon: Clock, label: "Ready When You Are" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Right — chat preview */}
        <div className="mt-12 w-full max-w-xs md:mt-0">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
            {/* Chat header */}
            <div className="flex items-center gap-3 bg-orange-500 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Homi AI</p>
                <p className="text-xs text-orange-100">Online</p>
              </div>
            </div>

            {/* Chat messages */}
            <div className="space-y-3 p-4">
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-muted px-3 py-2 text-xs">
                  What are you craving today?
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-orange-500 px-3 py-2 text-xs text-white">
                  Vegan Indian near Irving TX
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-muted px-3 py-2 text-xs">
                  Found 5 home cooks near you!
                </div>
              </div>
            </div>

            {/* Example prompts — not clickable */}
            <div className="border-t border-border px-4 py-3">
              <p className="mb-2 text-xs text-muted-foreground">Try asking:</p>
              <div className="space-y-1">
                {[
                  "Vegan Indian near Irving TX",
                  "Italian food in Dallas",
                  "Thai food near me",
                ].map((ex) => (
                  <p key={ex} className="text-xs text-muted-foreground">
                    · {ex}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}