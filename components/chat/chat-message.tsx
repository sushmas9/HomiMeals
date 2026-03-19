"use client";

import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === "bot";

  return (
    <div
      className={cn(
        "flex w-full",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
          isBot
            ? "bg-muted text-foreground rounded-bl-md"
            : "bg-primary text-primary-foreground rounded-br-md"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
