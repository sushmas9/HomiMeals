"use client";

import { useState, useEffect, useRef } from "react";
import { Send, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const INTENT_WEBHOOK = "https://sushmasara9.app.n8n.cloud/webhook-test/homi-intent";

interface Message {
  id: string;
  role: "bot" | "user";
  content: string;
  quick_options?: string[];
}

interface Intent {
  cuisine: string | null;
  dietary_restrictions: string | null;
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

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: createId(),
      role: "bot",
      content: "Welcome to Homi! Tell me what you're craving and where you are — I'll find the perfect home cook for you.",
      quick_options: ["Vegan Indian food in Irving TX 75063", "Italian food near Dallas TX", "Thai food in Irving TX"],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentIntent, setCurrentIntent] = useState<Intent>(initialIntent);
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const [clarificationTurns, setClarificationTurns] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

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

    try {
      const res = await fetch(INTENT_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: newHistory,
          current_intent: currentIntent,
          clarification_turns: clarificationTurns,
          bypass: false,
        }),
      });

      const data = await res.json();
      console.log("Intent response:", data);

      if (data.status === "complete" && data.cooks) {
        // Store cooks + intent for /cooks page
        sessionStorage.setItem("homi_cooks", JSON.stringify(data.cooks));
        sessionStorage.setItem("homi_intent", JSON.stringify(currentIntent));

        setMessages(prev => [...prev, {
          id: createId(),
          role: "bot",
          content: `Great! Found ${data.cooks.length} home cooks for you. Taking you there now...`,
        }]);

        setTimeout(() => {
          window.location.href = "/cooks";
        }, 1500);

      } else if (data.status === "complete") {
        // Complete but no cooks returned — navigate anyway
        sessionStorage.setItem("homi_intent", JSON.stringify(data.intent || currentIntent));
        window.location.href = "/cooks";

      } else {
        // Still clarifying — update intent and show next question
        if (data.intent) setCurrentIntent(data.intent);
        setClarificationTurns(data.clarification_turns || clarificationTurns + 1);
        setHistory([...newHistory, { role: "assistant", content: data.next_question || "" }]);

        const botMsg: Message = {
          id: createId(),
          role: "bot",
          content: data.next_question || "Could you provide more details?",
          quick_options: data.quick_options || undefined,
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (err) {
      console.error("Intent error:", err);
      setMessages(prev => [...prev, {
        id: createId(),
        role: "bot",
        content: "Something went wrong. Please try again.",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([{
      id: createId(),
      role: "bot",
      content: "Hi! Tell me what you're craving and where you are — I'll find the perfect home cook for you.",
    }]);
    setCurrentIntent(initialIntent);
    setHistory([]);
    setClarificationTurns(0);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 px-4">
        <div className="mx-auto max-w-2xl space-y-4 py-6">
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-3">
              <div className={cn("flex w-full", msg.role === "bot" ? "justify-start" : "justify-end")}>
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                  msg.role === "bot"
                    ? "bg-muted text-foreground rounded-bl-md"
                    : "bg-primary text-primary-foreground rounded-br-md"
                )}>
                  {msg.content}
                </div>
              </div>
              {msg.quick_options && msg.role === "bot" && (
                <div className="flex flex-wrap gap-2 pl-0">
                  {msg.quick_options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => sendMessage(opt)}
                      disabled={isLoading}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors disabled:opacity-50"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-border bg-background px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleReset} className="shrink-0 text-muted-foreground">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage(input)}
            placeholder="Tell me what you're craving..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={() => sendMessage(input)} disabled={isLoading || !input.trim()} size="icon" className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}