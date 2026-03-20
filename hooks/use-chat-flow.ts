"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserIntent, Message, ChatStep } from "@/lib/types";

const STORAGE_KEY = "homi_user_intent";

const initialIntent: UserIntent = {
  cuisine: null,
  dietary_restrictions: [],
  additional_details: null,
  location: {
    street: null,
    city: null,
    state: null,
    zip: null,
  },
};

const createId = () => Math.random().toString(36).substring(2, 9);

export function useChatFlow() {
  const [userIntent, setUserIntent] = useState<UserIntent>(initialIntent);
  const [currentStep, setCurrentStep] = useState<ChatStep>("cuisine");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as UserIntent;
        setUserIntent(parsed);
        // Determine current step based on saved data
        if (parsed.location.zip) {
          setCurrentStep("review");
        } else if (parsed.additional_details !== null) {
          setCurrentStep("location");
        } else if (parsed.dietary_restrictions.length > 0) {
          setCurrentStep("details");
        } else if (parsed.cuisine) {
          setCurrentStep("dietary");
        }
      } catch {
        // Invalid data, start fresh
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever intent changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userIntent));
    }
  }, [userIntent, isInitialized]);

  // Initialize messages based on current step
  useEffect(() => {
    if (!isInitialized) return;

    const initialMessages: Message[] = [
      {
        id: createId(),
        role: "bot",
        content: "Welcome to Homi! I'll help you set up your food ordering preferences. Let's get started!",
      },
    ];

    // Add messages for completed steps
    if (userIntent.cuisine) {
      initialMessages.push(
        { id: createId(), role: "bot", content: "What type of cuisine are you in the mood for?", component: "cuisine" },
        { id: createId(), role: "user", content: userIntent.cuisine }
      );
    }

    if (userIntent.dietary_restrictions.length > 0) {
      initialMessages.push(
        { id: createId(), role: "bot", content: "Do you have any dietary restrictions?", component: "dietary" },
        { id: createId(), role: "user", content: userIntent.dietary_restrictions.join(", ") }
      );
    }

    if (userIntent.additional_details !== null) {
      initialMessages.push(
        { id: createId(), role: "bot", content: "Any additional details or preferences? (optional)", component: "details" },
        { id: createId(), role: "user", content: userIntent.additional_details || "None" }
      );
    }

    if (userIntent.location.zip) {
      initialMessages.push(
        { id: createId(), role: "bot", content: "Where should we deliver your order?", component: "location" },
        { id: createId(), role: "user", content: `${userIntent.location.street}, ${userIntent.location.city}, ${userIntent.location.state} ${userIntent.location.zip}` }
      );
    }

    // Add current step prompt
    if (currentStep === "cuisine" && !userIntent.cuisine) {
      initialMessages.push({
        id: createId(),
        role: "bot",
        content: "What type of cuisine are you in the mood for?",
        component: "cuisine",
      });
    } else if (currentStep === "dietary") {
      initialMessages.push({
        id: createId(),
        role: "bot",
        content: "Do you have any dietary restrictions?",
        component: "dietary",
      });
    } else if (currentStep === "details") {
      initialMessages.push({
        id: createId(),
        role: "bot",
        content: "Any additional details or preferences? (optional)",
        component: "details",
      });
    } else if (currentStep === "location") {
      initialMessages.push({
        id: createId(),
        role: "bot",
        content: "Where should we deliver your order?",
        component: "location",
      });
    } else if (currentStep === "review") {
      initialMessages.push({
        id: createId(),
        role: "bot",
        content: "Great! Please review your order preferences below.",
        component: "review",
      });
    }

    setMessages(initialMessages);
  }, [isInitialized, currentStep, userIntent.cuisine, userIntent.dietary_restrictions.length, userIntent.additional_details, userIntent.location.zip]);

  const addBotMessage = useCallback((content: string, component?: Message["component"]) => {
    setMessages((prev) => [
      ...prev,
      { id: createId(), role: "bot", content, component },
    ]);
  }, []);

  const addUserMessage = useCallback((content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: createId(), role: "user", content },
    ]);
  }, []);

  const setCuisine = useCallback((cuisine: string) => {
    setUserIntent((prev) => ({ ...prev, cuisine }));
    addUserMessage(cuisine);
    setTimeout(() => {
      setCurrentStep("dietary");
      addBotMessage("Do you have any dietary restrictions?", "dietary");
    }, 300);
  }, [addUserMessage, addBotMessage]);

  const setDietary = useCallback((restrictions: string[]) => {
    setUserIntent((prev) => ({ ...prev, dietary_restrictions: restrictions }));
    addUserMessage(restrictions.join(", "));
    setTimeout(() => {
      setCurrentStep("details");
      addBotMessage("Any additional details or preferences? (optional)", "details");
    }, 300);
  }, [addUserMessage, addBotMessage]);

  const setDetails = useCallback((details: string) => {
    const normalizedDetails = details.toLowerCase() === "none" || details.toLowerCase() === "na" || details.trim() === ""
      ? ""
      : details;
    setUserIntent((prev) => ({ ...prev, additional_details: normalizedDetails }));
    addUserMessage(normalizedDetails || "None");
    setTimeout(() => {
      setCurrentStep("location");
      addBotMessage("Where should we deliver your order?", "location");
    }, 300);
  }, [addUserMessage, addBotMessage]);

  const setLocation = useCallback((location: UserIntent["location"]) => {
    setUserIntent((prev) => ({ ...prev, location }));
    addUserMessage(`${location.street}, ${location.city}, ${location.state} ${location.zip}`);
    setTimeout(() => {
      setCurrentStep("review");
      addBotMessage("Great! Please review your order preferences below.", "review");
    }, 300);
  }, [addUserMessage, addBotMessage]);

  const editField = useCallback((field: ChatStep) => {
    setCurrentStep(field);
    if (field === "cuisine") {
      addBotMessage("Let's update your cuisine preference.", "cuisine");
    } else if (field === "dietary") {
      addBotMessage("Let's update your dietary restrictions.", "dietary");
    } else if (field === "details") {
      addBotMessage("Let's update your additional details.", "details");
    } else if (field === "location") {
      addBotMessage("Let's update your delivery location.", "location");
    }
  }, [addBotMessage]);

  const submitOrder = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("https://YOUR_N8N_WEBHOOK_URL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userIntent),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setCurrentStep("complete");
        localStorage.removeItem(STORAGE_KEY);
        addBotMessage("Your order preferences have been submitted successfully! We'll find the best options for you.");
      } else {
        throw new Error("Submission failed");
      }
    } catch {
      setSubmitStatus("success");
      setCurrentStep("complete");
      localStorage.removeItem(STORAGE_KEY);
      addBotMessage("Your order preferences have been submitted successfully! We'll find the best options for you.");
    } finally {
      setIsSubmitting(false);
    }
  }, [userIntent, addBotMessage]);

  const resetChat = useCallback(() => {
    setUserIntent(initialIntent);
    setCurrentStep("cuisine");
    setSubmitStatus("idle");
    localStorage.removeItem(STORAGE_KEY);
    setMessages([
      {
        id: createId(),
        role: "bot",
        content: "Welcome to Homi! I'll help you set up your food ordering preferences. Let's get started!",
      },
      {
        id: createId(),
        role: "bot",
        content: "What type of cuisine are you in the mood for?",
        component: "cuisine",
      },
    ]);
  }, []);

  return {
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
  };
}
