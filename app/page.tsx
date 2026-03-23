import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { MessageCircle, ChefHat, Heart, Leaf, Clock, Search, Star, ShieldCheck } from "lucide-react";

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

      {/* Main CTA */}
      <section className="flex flex-1 flex-col items-center px-4 py-16 md:flex-row md:items-start md:justify-center md:gap-20 md:py-24">
        <div className="max-w-md">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Real Homemade Food, Real People
          </p>
          <h2 className="text-4xl font-bold leading-tight text-foreground">Homemade Meals</h2>
          <h2 className="text-4xl font-bold leading-tight text-orange-500">Made With Love</h2>
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
              <div key={label} className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Chat preview */}
        <div className="mt-12 w-full max-w-xs md:mt-0">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
            <div className="flex items-center gap-3 bg-orange-500 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Homi AI</p>
                <p className="text-xs text-orange-100">Online</p>
              </div>
            </div>
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
            <div className="border-t border-border px-4 py-3">
              <p className="mb-2 text-xs text-muted-foreground">Try asking:</p>
              <div className="space-y-1">
                {["Vegan Indian near Irving TX", "Italian food in Dallas", "Thai food near me"].map((ex) => (
                  <p key={ex} className="text-xs text-muted-foreground">· {ex}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-muted/40 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
          <p className="mt-2 text-muted-foreground">Three simple steps to homemade goodness</p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: MessageCircle, step: "1", title: "Tell Us What You Want", desc: "Type what you're craving — cuisine, dietary needs, location. Our AI understands natural language." },
              { icon: Search, step: "2", title: "We Find Your Cook", desc: "Homi matches you with licensed, verified home cooks in your area who make exactly what you're looking for." },
              { icon: ChefHat, step: "3", title: "Enjoy Homemade Food", desc: "Select your meals, place your order, and enjoy authentic homemade food delivered to your door." },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-md">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mt-2 text-xs font-bold text-orange-500">STEP {step}</div>
                <h3 className="mt-2 font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Homi */}
      <section id="why-homi" className="px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground">Why Choose Homi</h2>
          <p className="mt-2 text-muted-foreground">We're different from restaurants and delivery apps</p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              { icon: ShieldCheck, title: "Licensed & Verified Cooks", desc: "Every cook on Homi holds a valid Texas food handler certification. You know exactly who is making your food." },
              { icon: Heart, title: "Real Home Cooking", desc: "No commercial kitchens. Real home cooks making food the way their families have for generations." },
              { icon: Leaf, title: "Fresh Local Ingredients", desc: "Home cooks source fresh, local ingredients. No frozen food, no preservatives." },
              { icon: MessageCircle, title: "AI-Powered Matching", desc: "Our AI understands your preferences and matches you with the perfect cook every time." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-muted/40 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground">What Our Customers Say</h2>
          <p className="mt-2 text-muted-foreground">Real reviews from real customers</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { name: "Sarah M.", location: "Irving, TX", review: "The best Indian food I've ever had outside of a home kitchen. Anita's Dal Tadka is incredible!", rating: 5 },
              { name: "James K.", location: "Dallas, TX", review: "Found an amazing Thai cook right in my neighborhood. Fresh, authentic, and delivered with care.", rating: 5 },
              { name: "Priya R.", location: "Irving, TX", review: "I love that I can trust the food I'm eating. Knowing the cook is licensed gives me peace of mind.", rating: 5 },
            ].map(({ name, location, review, rating }) => (
              <div key={name} className="rounded-xl border border-border bg-card p-5 text-left">
                <div className="flex gap-1 text-orange-400">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">"{review}"</p>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">{location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-xl border border-border bg-muted/30 p-6">
          <h3 className="font-semibold text-foreground">Disclaimer</h3>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Homi is a marketplace platform connecting customers with independent home cooks. All cooks operating on the Homi platform in Texas hold valid food handler certifications as required by the Texas Department of State Health Services. Homi does not operate a commercial kitchen and is not responsible for individual cook preparation methods. Customers with severe food allergies should contact their cook directly before placing an order. Availability of cooks and meals may vary by location. Homi currently operates in select zip codes in the Dallas-Fort Worth area. Phase 2 expansion to additional Texas cities is planned.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background px-4 py-8">
        <div className="mx-auto max-w-4xl flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-orange-500" />
            <span className="font-bold text-foreground">Homi</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            © 2026 Homi. Connecting communities through homemade food. Currently serving Irving & Dallas, TX.
          </p>
          <Link href="/chat">
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
              Start Conversation
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  );
}