import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import logo from "/logo.svg";
import { useNavigate } from "react-router-dom";
import { Loader2, Pen, RotateCcw } from "lucide-react";
import { OAuthButtons } from "@/components/signin/OAuthButtons";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const SignInForm = ({
  className,
  ...props
}: React.ComponentProps<"form">) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/auth/send-otp", { Email: email });
    } catch (err) {
      const msg =
        err instanceof AxiosError
          ? (err.response?.data?.error ?? "Failed to send code")
          : "Failed to send code";
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "email") {
      try {
        await sendOtp();
        setStep("otp");
      } catch {
        // error already toasted
      }
    } else {
      setLoading(true);
      try {
        await axiosInstance.post("/auth/verify-otp", { Email: email, OTP: otp });
        navigate("/");
      } catch (err) {
        const msg =
          err instanceof AxiosError
            ? (err.response?.data?.error ?? "Invalid or expired code")
            : "Invalid or expired code";
        toast.error(msg);
        setOtp("");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResend = async () => {
    try {
      await sendOtp();
      setOtp("");
      toast.success("Code resent");
    } catch {
      // error already toasted
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6 max-w-xs w-full", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <img src={logo} className="w-20" />
          <h1 className="text-2xl font-bold pt-5">Sign in to KatanaID</h1>
        </div>

        <Field className="mt-3">
          {step === "email" ? (
            <>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <FieldLabel>Enter your OTP</FieldLabel>
              </div>
              <div className="flex justify-between">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  disabled={loading}
                  autoFocus
                >
                  <InputOTPGroup><InputOTPSlot index={0} /></InputOTPGroup>
                  <InputOTPGroup><InputOTPSlot index={1} /></InputOTPGroup>
                  <InputOTPGroup><InputOTPSlot index={2} /></InputOTPGroup>
                  <InputOTPGroup><InputOTPSlot index={3} /></InputOTPGroup>
                  <InputOTPGroup><InputOTPSlot index={4} /></InputOTPGroup>
                  <InputOTPGroup><InputOTPSlot index={5} /></InputOTPGroup>
                </InputOTP>

                <Button type="button" variant="secondary" size="icon" disabled={loading} onClick={handleResend} title="Resend code" >
                  <RotateCcw />
                </Button>
                <Button type="button" variant="secondary" size="icon" disabled={loading} onClick={() => { setStep("email"); setOtp(""); }} title="Change email">
                  <Pen />
                </Button>
              </div>
            </>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : step === "email" ? "Continue with Email" : "Sign In"}
          </Button>
        </Field>

        <FieldSeparator>Or with</FieldSeparator>
        <Field className="gap-3">
          <OAuthButtons/>
        </Field>
      </FieldGroup>
    </form>
  );
}
