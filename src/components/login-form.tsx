"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/custom-toast";
import { setCookie } from "@/lib/cookies";
import { useEffect, useState } from "react";
import { getCookie } from "@/lib/cookies";
import Cookies from "js-cookie";
import { loginUser } from "@/service/authService";
import { Eye, EyeOff } from "lucide-react";

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user is already logged in
    const userRole = getCookie("userRole");
    if (userRole) {
      // Always redirect to /admin/dashboard for all users
      router.replace("/admin/dashboard");
    }
  }, [router]);

  if (!mounted) return null; 

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await loginUser(data);

      // Use the imported setCookie function with the correct signature
      Cookies.set("userRole", result.data.user.role, { expires: 1, path: "/" });
      Cookies.set("token", result.token, { expires: 1, path: "/" });

      showToast(result.message, "success");

      // Redirect based on role
      // Always redirect to /admin/dashboard for all users
      router.replace("/admin/dashboard");
      // Force reload to ensure token is available for all requests
      window.location.reload();
    } catch (error: any) {
      const status = error?.response?.status;
      const data = error?.response?.data || {};
      if (status === 401) {
        const remaining = data?.remainingAttempts;
        if (typeof remaining === "number") {
          const attemptsText = remaining === 1 ? "1 attempt left." : `${remaining} attempts left.`;
          showToast(`Invalid credentials. ${attemptsText}`, "error");
        } else {
          showToast(data?.message || "Invalid credentials", "error");
        }
      } else if (status === 423) {
        showToast("Your account is locked. Please try again after 24 hours.", "error");
      } else {
        showToast(data?.message || error.message || "Login failed", "error");
      }
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
            autoComplete="email"
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
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className="pr-10"
              {...register("password", {
                required: "Password is required",
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
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
    </form>
  );
}
