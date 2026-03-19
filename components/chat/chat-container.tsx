"use client";

import { useEffect, useRef } from "react";
import { useChatFlow } from "@/hooks/use-chat-flow";
import { ChatMessage } from "./chat-message";
import { CuisineInput } from "./cuisine-input";
import { DietaryInput } from "./dietary-input";
import { DetailsInput } from "./details-input";
import { LocationInput } from "./location-input";
import { ReviewCard } from "./review-card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcw, CheckCircle2 } from "lucide-react";

export function ChatContainer() {
  const {
    userIntent,
    currentStep,
    messages,
    isSubmitting,
    submitStatus,
    isInitialized,
    setCuisine,
    setDietary,
    setDetails,
    setLocation,
    editField,
    submitOrder,
    resetChat,
  } = useChatFlow();

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentStep]);

  if (!isInitialized) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const renderInput = () => {
    if (submitStatus === "success" || currentStep === "complete") {
      return (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <div>
            <h3 className="font-semibold">Order Preferences Submitted!</h3>
            <p className="text-sm text-muted-foreground">
              We'll find the best food options for you.
            </p>
          </div>
          <Button variant="outline" onClick={resetChat}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Start New Order
          </Button>
        </div>
      );
    }

    switch (currentStep) {
      case "cuisine":
        return (
          <CuisineInput
            onSubmit={setCuisine}
            defaultValue={userIntent.cuisine}
          />
        );
      case "dietary":
        return (
          <DietaryInput
            onSubmit={setDietary}
            defaultValue={userIntent.dietary_restrictions}
          />
        );
      case "details":
        return (
          <DetailsInput
            onSubmit={setDetails}
            defaultValue={userIntent.additional_details}
          />
        );
      case "location":
        return (
          <LocationInput
            onSubmit={setLocation}
            defaultValue={userIntent.location}
          />
        );
      case "review":
        return (
          <ReviewCard
            userIntent={userIntent}
            onEdit={editField}
            onSubmit={submitOrder}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <div className="mx-auto max-w-2xl space-y-4 py-6">
          {messages.map((message, index) => {
            const isLastBotMessage =
              message.role === "bot" &&
              index === messages.length - 1 &&
              message.component;

            return (
              <div key={message.id} className="space-y-4">
                <ChatMessage message={message} />
                {isLastBotMessage && (
                  <div className="pl-0">
                    {renderInput()}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
