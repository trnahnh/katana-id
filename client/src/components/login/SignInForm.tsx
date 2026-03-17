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
import logo from "/logo.svg";
import { useNavigate } from "react-router-dom";
import { LucideLoader2 } from "lucide-react";
import { OAuthButtons } from "@/components/OAuthButtons";

export const LoginForm = ({
  className,
  ...props
}: React.ComponentProps<"form">) => {
  const navigate = useNavigate();

  return (
    <form
      className={cn("flex flex-col gap-6 max-w-sm w-full", className)}
      {...props}
      onSubmit={() => {}}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <img src={logo} className="w-20"></img>
          <h1 className="text-2xl font-bold pt-5">Login to KatanaID</h1>
        </div>
        <Field className="mt-5">
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="damian@email.com"
            required
          />
        </Field>

        <Field>
          <Button type="submit">
            {true ? <LucideLoader2 className="animate-spin" /> : "Login"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field className="gap-5">
          <OAuthButtons labelPrefix="Login" />
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a
              onClick={() => navigate("/signup")}
              className="underline underline-offset-4"
            >
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
