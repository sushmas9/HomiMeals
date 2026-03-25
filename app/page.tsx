"use client";

import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageCircle, ChefHat, Heart, Leaf, Clock,
  Search, Star, ShieldCheck, Send, RotateCcw, CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

const INTENT_WEBHOOK = "https://sushmasara9.app.n8n.cloud/webhook/homi-intent";

interface Message {
  id: string;
  role: "bot" | "user";
  content: string;
  hints?: string[];
  hintLabel?: string;
}

interface Intent {
  cuisine: string | null;
  dietary_restrictions: string | string[] | null;
  additional_details: string | null;
  location: {
    street: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
  };
}

const createId = () => Math.random().toString(36).substring(2, 9);

const initialIntent: Intent = {
  cuisine: null,
  dietary_restrictions: null,
  additional_details: null,
  location: { street: null, city: null, state: null, zip: null },
};

const STEP_CONFIG: Record<string, { placeholder: string; format: string; hints: string[]; hintLabel: string }> = {
  default: {
    placeholder: "Tell me what you're craving...",
    format: "Example: Vegan Indian food in Irving TX 75063",
    hints: ["Vegan Indian near Irving TX 75063", "Italian food in Dallas TX 75201", "Thai food near Irving TX 75063"],
    hintLabel: "Try typing:",
  },
  location: {
    placeholder: "e.g. 123 Main St, Irving, TX 75063",
    format: "Format: Street Address, City, State, Zip",
    hints: ["123 Main St, Irving, TX 75063", "456 Oak Ave, Dallas, TX 75201", "789 Elm Rd, Irving, TX 75039"],
    hintLabel: "Address format examples:",
  },
  dietary: {
    placeholder: "Any dietary restrictions?",
    format: "Example: Vegan, Vegetarian, Gluten-Free, or None",
    hints: ["Vegan", "Vegetarian", "Gluten-Free", "Halal", "No restrictions"],
    hintLabel: "Options:",
  },
  additional: {
    placeholder: "Any additional preferences?",
    format: "Example: Spicy, Low oil, High protein, or Skip",
    hints: ["Spicy", "Low oil", "High protein", "Light meal", "Skip"],
    hintLabel: "Options:",
  },
  cuisine: {
    placeholder: "What cuisine are you craving?",
    format: "Example: Indian, Italian, Thai, Mexican",
    hints: ["Indian", "Italian", "Thai", "Mexican", "Chinese"],
    hintLabel: "Options:",
  },
};

function detectStep(missingFields: string[], nextQuestion: string): string {
  if (missingFields?.length > 0) {
    if (missingFields.includes("street") || missingFields.includes("zip")) return "location";
    if (missingFields.includes("dietary_restrictions")) return "dietary";
    if (missingFields.includes("additional_details")) return "additional";
    if (missingFields.includes("cuisine")) return "cuisine";
  }
  const q = nextQuestion?.toLowerCase() || "";
  if (q.includes("street") || q.includes("address") || q.includes("zip")) return "location";
  if (q.includes("dietary") || q.includes("restriction")) return "dietary";
  if (q.includes("additional") || q.includes("preference")) return "additional";
  if (q.includes("cuisine") || q.includes("craving")) return "cuisine";
  return "default";
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([{
    id: createId(),
    role: "bot",
    content: "Hi! Tell me what you're craving and where you are — I'll find the perfect home cook for you.",
    hints: STEP_CONFIG.default.hints,
    hintLabel: STEP_CONFIG.default.hintLabel,
  }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentIntent, setCurrentIntent] = useState<Intent>(initialIntent);
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const [clarificationTurns, setClarificationTurns] = useState(0);
  const [currentStep, setCurrentStep] = useState("default");
  const [isDone, setIsDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { id: createId(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const newHistory = [...history, { role: "user", content: text }];

    let requestBody: string;
    try {
      requestBody = JSON.stringify({
        message: text,
        history: newHistory,
        current_intent: currentIntent || initialIntent,
        clarification_turns: clarificationTurns || 0,
        bypass: false,
      });
    } catch (e) {
      console.error("Serialize error:", e, currentIntent);
      setMessages(prev => [...prev, { id: createId(), role: "bot", content: "Something went wrong. Please try again." }]);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(INTENT_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      });

      const data = await res.json();
      const response = Array.isArray(data) ? data[0] : data;
      console.log("Intent response:", JSON.stringify(data, null, 2));

      if (data.status === "complete" && data.cooks) {
        sessionStorage.setItem("homi_cooks", JSON.stringify(data.cooks));
        sessionStorage.setItem("homi_intent", JSON.stringify(currentIntent));
        setIsDone(true);
        setMessages(prev => [...prev, {
          id: createId(), role: "bot",
          content: `Found ${data.cooks.length} home cooks for you! Redirecting...`,
        }]);
        setTimeout(() => { window.location.href = "/cooks"; }, 1500);

      } else if (data.status === "complete") {
        sessionStorage.setItem("homi_intent", JSON.stringify(data.intent || currentIntent));
        window.location.href = "/cooks";

      } else {
        // Update intent — handle both nested and flat response
        if (data.intent) {
          setCurrentIntent(data.intent);
        } else {
          setCurrentIntent({
            cuisine: data.cuisine ?? currentIntent.cuisine,
            dietary_restrictions: data.dietary_restrictions ?? currentIntent.dietary_restrictions,
            additional_details: data.additional_details ?? currentIntent.additional_details,
            location: data.location ?? currentIntent.location,
          });
        }

        const turns = clarificationTurns + 1;
        setClarificationTurns(turns);
        setHistory([...newHistory, { role: "assistant", content: data.next_question || "" }]);

        const step = detectStep(data.missing_fields || [], data.next_question || "");
        setCurrentStep(step);
        const cfg = STEP_CONFIG[step] || STEP_CONFIG.default;

        setMessages(prev => [...prev, {
          id: createId(), role: "bot",
          content: data.next_question || "Could you provide more details?",
          hints: cfg.hints,
          hintLabel: cfg.hintLabel,
        }]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMessages(prev => [...prev, {
        id: createId(), role: "bot",
        content: "Something went wrong. Please try again.",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([{
      id: createId(), role: "bot",
      content: "Hi! Tell me what you're craving and where you are — I'll find the perfect home cook for you.",
      hints: STEP_CONFIG.default.hints,
      hintLabel: STEP_CONFIG.default.hintLabel,
    }]);
    setCurrentIntent(initialIntent);
    setHistory([]);
    setClarificationTurns(0);
    setCurrentStep("default");
    setIsDone(false);
    setInput("");
  };

  const cfg = STEP_CONFIG[currentStep] || STEP_CONFIG.default;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      {/* Hero */}
      <section className="relative flex min-h-[480px] items-center justify-center overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&h=600&fit=crop')" }} />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Fresh. Local. Homemade.</h1>
          <p className="mt-3 text-lg text-neutral-300">Home cooks in your area, ready to serve you.</p>
          <button onClick={() => chatRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
            <MessageCircle className="h-4 w-4" /> Start Conversation
          </button>
        </div>
      </section>

      {/* Chat Section */}
      <section ref={chatRef} id="chat" className="bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-foreground">Find Your Home Cook</h2>
            <p className="mt-1 text-sm text-muted-foreground">Tell our AI what you want — it handles the rest</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            {/* Chat header */}
            <div className="flex items-center justify-between bg-orange-500 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Homi AI</p>
                  <p className="text-xs text-orange-100">Online</p>
                </div>
              </div>
              <button onClick={handleReset} className="text-white/70 hover:text-white transition-colors">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto overscroll-contain p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  <div className={cn("flex w-full", msg.role === "bot" ? "justify-start" : "justify-end")}>
                    <div className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                      msg.role === "bot"
                        ? "bg-white border border-border text-foreground rounded-bl-md shadow-sm"
                        : "bg-orange-500 text-white rounded-br-md"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                  {msg.hints && msg.role === "bot" && (
                    <div className="pl-1">
                      <p className="text-xs text-muted-foreground mb-1.5">{msg.hintLabel}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.hints.map((hint) => (
                          <span key={hint}
                            className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground border border-border cursor-default select-none">
                            <CheckCircle2 className="h-3 w-3 text-orange-400" />
                            {hint}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400 [animation-delay:0ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400 [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400 [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input area */}
            {!isDone && (
              <div className="border-t border-border bg-background px-4 py-3">
                <p className="mb-2 text-xs text-muted-foreground">{cfg.format}</p>
                <div className="flex items-center gap-2">
                  <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        sendMessage(input);
                      }
                    }}
                    placeholder={cfg.placeholder}
                    disabled={isLoading}
                    className="flex-1 text-sm"
                  />
                  <Button onClick={() => sendMessage(input)} disabled={isLoading || !input.trim()}
                    size="icon" className="shrink-0 bg-orange-500 hover:bg-orange-600">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 py-20">
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
      <section className="bg-muted/40 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground">Why Choose Homi</h2>
          <p className="mt-2 text-muted-foreground">We're different from restaurants and delivery apps</p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              { icon: ShieldCheck, title: "Licensed & Verified Cooks", desc: "Every cook holds a valid Texas food handler certification. You know exactly who is making your food." },
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
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground">What Our Customers Say</h2>
          <p className="mt-2 text-muted-foreground">Real reviews from real customers</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { name: "Sarah M.", location: "Irving, TX", review: "The best Indian food I've ever had outside of a home kitchen. Anita's Dal Tadka is incredible!", rating: 5 },
              { name: "James K.", location: "Dallas, TX", review: "Found an amazing Thai cook right in my neighborhood. Fresh, authentic, and delivered with care.", rating: 5 },
              { name: "Priya R.", location: "Irving, TX", review: "Knowing the cook is licensed gives me peace of mind. Highly recommend Homi!", rating: 5 },
            ].map(({ name, location, review, rating }) => (
              <div key={name} className="rounded-xl border border-border bg-card p-5 text-left">
                <div className="flex gap-1 text-orange-400">
                  {Array.from({ length: rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
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
            Homi is a marketplace platform connecting customers with independent home cooks. All cooks operating on the Homi platform in Texas hold valid food handler certifications as required by the Texas Department of State Health Services. Homi does not operate a commercial kitchen and is not responsible for individual cook preparation methods. Customers with severe food allergies should contact their cook directly before placing an order. Availability of cooks and meals may vary by location. Homi currently operates in select zip codes in the Dallas-Fort Worth area.
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
          <button onClick={() => chatRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
            <MessageCircle className="h-4 w-4" /> Start Conversation
          </button>
        </div>
      </footer>
    </div>
  );
}