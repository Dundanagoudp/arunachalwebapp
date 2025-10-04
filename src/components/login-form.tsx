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


  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await loginUser(data);

      // Use the imported setCookie function with the correct signature
      Cookies.set("userRole", result.data.user.role, { expires: 1, path: "/" });
      Cookies.set("token", result.token, { expires: 1, path: "/" });

      showToast("Welcome to Dashboard! Login successful.", "success");

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
    <div className="w-full">
      <form
        className={cn("bg-white rounded-lg shadow-lg border border-gray-200 p-6 space-y-6 block", className)}
        onSubmit={handleSubmit(onSubmit)}
        {...props}
      >
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#e67e22] to-[#d35400] rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600 text-sm">
              Login to your account to continue
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              className="h-12 px-4 border-gray-200 focus:border-[#e67e22] focus:ring-[#e67e22]"
              {...register("email", {
                required: "Email is required",
                validate: validateEmail,
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="h-12 px-4 pr-12 border-gray-200 focus:border-[#e67e22] focus:ring-[#e67e22]"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login Button */}
          <Button 
            type="submit" 
            className="w-full h-12 bg-[#e67e22] hover:bg-[#d35400] text-white font-semibold rounded-lg" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Logging in...</span>
              </div>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
