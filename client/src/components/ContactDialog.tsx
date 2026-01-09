import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { LucideLoader2 } from "lucide-react";

interface ContactDialogProps {
  children: React.ReactNode;
}

export function ContactDialog({ children }: ContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lastSubmittedRef = useRef({ email: "", reason: "" });
  const [isDebouncing, setIsDebouncing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !reason) {
      toast.error("Please fill in all fields");
      return;
    }

    if (reason.length < 10) {
      toast.error("Please provide more details (at least 10 characters)");
      return;
    }

    // Check if values changed since last submission
    const hasChanged =
      email !== lastSubmittedRef.current.email ||
      reason !== lastSubmittedRef.current.reason;

    if (!hasChanged || isDebouncing) {
      return; // Block submission
    }

    // Save current values as last submitted
    lastSubmittedRef.current = { email, reason };

    // Start 3-second debounce
    setIsDebouncing(true);
    setTimeout(() => setIsDebouncing(false), 3000);

    setIsSubmitting(true);

    try {
      const res = await axiosInstance.post("/api/contact", { email, reason });
      toast.success(res.data.message);
      setEmail("");
      setReason("");
      setOpen(false);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 429) {
          toast.error("Too many requests. Please try again later.");
        } else {
          toast.error(error.response?.data?.error || "Failed to submit");
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
          <DialogDescription>
            Have a question or feedback? We'd love to hear from you.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-reason">Message</Label>
            <textarea
              id="contact-reason"
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              placeholder="Tell us what's on your mind... (min 10 characters)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={2000}
              required
            />
            <span className="text-xs text-muted-foreground text-right">
              {reason.length}/2000
            </span>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || isDebouncing}>
              {isSubmitting ? (
                <LucideLoader2 className="animate-spin" />
              ) : (
                "Send Message"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}