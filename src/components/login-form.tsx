"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { setCookie } from "@/lib/cookies";
import { useEffect, useState } from "react";
import { getCookie } from "@/lib/cookies";
import Cookies from "js-cookie";

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user is already logged in
    const userRole = getCookie("userRole");
    console.log("[LoginForm] userRole from cookie:", userRole); // Debug log
    if (userRole) {
      // Always redirect to /admin/dashboard for all users
      router.replace("/admin/dashboard");
    }
  }, [router]);

  if (!mounted) return null; // Prevent hydration mismatch

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/onboarding/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include", 
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      console.log("[LoginForm] Account type from backend:", result.data.user.accountType); // Debug log
      // Use the imported setCookie function with the correct signature
      Cookies.set("userRole", result.data.user.role, { expires: 1, path: "/" });
      Cookies.set("token", result.token, { expires: 1, path: "/" });
      console.log("[LoginForm] Token set in cookie:", Cookies.get("token")); // Debug log

      toast.success(result.message);

      // Redirect based on role
      // Always redirect to /admin/dashboard for all users
      router.replace("/admin/dashboard");
      // Force reload to ensure token is available for all requests
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    }
  };

  // Basic email validation
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || "Invalid email address";
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email", {
              required: "Email is required",
              validate: validateEmail,
            })}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  );
}
