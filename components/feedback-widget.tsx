"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROLES = [
  "Home Cook",
  "Meal Planner",
  "Busy Parent",
  "Food Enthusiast",
  "Other",
];

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [whatWorked, setWhatWorked] = useState("");
  const [whatImprove, setWhatImprove] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setRole("");
    setRating(null);
    setWhatWorked("");
    setWhatImprove("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !role || !rating) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: supabaseError } = await supabase.from("feedback").insert({
        name,
        email,
        role,
        rating,
        what_worked: whatWorked,
        what_improve: whatImprove,
      });

      if (supabaseError) {
        throw supabaseError;
      }

      toast.success("Thank you for your feedback!");
      resetForm();
      setOpen(false);
    } catch (err) {
      console.error("Feedback submission error:", err);
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-4 left-4 z-50 gap-2 bg-green-600 text-white hover:bg-green-700"
          size="lg"
        >
          <MessageSquare className="h-5 w-5" />
          Share Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <DialogDescription>
            Help us improve HomiMeals by sharing your experience.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              Overall Rating <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRating(num)}
                  className={`flex h-10 w-10 items-center justify-center rounded-md border text-sm font-medium transition-colors ${
                    rating === num
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-input bg-background hover:bg-accent"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="what-worked">What worked well?</Label>
            <Textarea
              id="what-worked"
              value={whatWorked}
              onChange={(e) => setWhatWorked(e.target.value)}
              placeholder="Tell us what you liked..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="what-improve">What should we improve?</Label>
            <Textarea
              id="what-improve"
              value={whatImprove}
              onChange={(e) => setWhatImprove(e.target.value)}
              placeholder="Tell us how we can do better..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
