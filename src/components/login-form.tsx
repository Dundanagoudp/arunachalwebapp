"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/custom-toast";
import { setCookie } from "@/lib/cookies";
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
  } = useForm<LoginFormValues>({ mode: "onBlur" });
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [altchaKey, setAltchaKey] = useState(Date.now());
  const [captchaError, setCaptchaError] = useState<string>("");
  
  // Get API base URL from environment
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://litfest.arunachal.gov.in/api/v1";
  const captchaUrl = `${apiBaseUrl}/captcha/generate`;

  // Load ALTCHA on client-side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      Promise.all([
        import("altcha/external"),
        // @ts-ignore - CSS import doesn't have types
        import("altcha/altcha.css")
      ]).catch(console.error);
    }
  }, []);

  // Check for existing lockout on mount
  useEffect(() => {
    setMounted(true);
    // Check if user is already logged in
    const userRole = getCookie("userRole");
    if (userRole) {
      // Always redirect to /admin/dashboard for all users
      router.replace("/admin/dashboard");
      return;
    }

    // Check for existing lockout in sessionStorage
    const lockoutUntil = sessionStorage.getItem('loginLockoutUntil');
    if (lockoutUntil) {
      const lockoutTime = parseInt(lockoutUntil);
      const now = Date.now();
      if (now < lockoutTime) {
        // Still locked
        setIsLocked(true);
        setLockoutRemaining(lockoutTime - now);
      } else {
        // Lockout expired, clear it
        sessionStorage.removeItem('loginLockoutUntil');
      }
    }
  }, [router]);

  // Countdown timer effect
  useEffect(() => {
    if (!isLocked || lockoutRemaining === null) return;

    const interval = setInterval(() => {
      const lockoutUntil = sessionStorage.getItem('loginLockoutUntil');
      if (!lockoutUntil) {
        setIsLocked(false);
        setLockoutRemaining(null);
        return;
      }

      const lockoutTime = parseInt(lockoutUntil);
      const now = Date.now();
      const remaining = lockoutTime - now;

      if (remaining <= 0) {
        // Lockout expired
        sessionStorage.removeItem('loginLockoutUntil');
        setIsLocked(false);
        setLockoutRemaining(null);
        clearInterval(interval);
      } else {
        setLockoutRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocked, lockoutRemaining]);


  const onSubmit = async (data: LoginFormValues) => {
    // Check if form is locked
    if (isLocked) {
      return;
    }

    // Clear previous captcha error
    setCaptchaError("");

    // Get ALTCHA widget and validate payload
    const widget = document.querySelector('altcha-widget') as any;
    
    if (!widget) {
      setCaptchaError("CAPTCHA widget not loaded");
      return;
    }

    // ALTCHA widget stores payload in a hidden input with name="altcha"
    const form = widget.closest('form');
    const hiddenInput = form?.querySelector('input[name="altcha"]') as HTMLInputElement;
    const altchaPayload = hiddenInput?.value || widget.value;

    if (!altchaPayload) {
      setCaptchaError("Please complete the CAPTCHA");
      return;
    }

    try {
      const result = await loginUser({
        email: data.email,
        password: data.password,
        altchaPayload: altchaPayload
      });

      // Clear any lockout data on successful login
      sessionStorage.removeItem('loginLockoutUntil');

      // Use the imported setCookie function with the correct signature
      Cookies.set("userRole", result.data.user.role, { expires: 1, path: "/" });
      Cookies.set("token", result.token, { expires: 1, path: "/" });

      showToast("Welcome to Dashboard! Login successful.", "success");

      // Redirect to dashboard
      router.replace("/admin/dashboard");
    } catch (error: any) {
      const status = error?.response?.status;
      const data = error?.response?.data || {};
      
      // Refresh captcha widget after any error
      setAltchaKey(Date.now());
      
      if (status === 429) {
        // Rate limit exceeded - lock form for 15 minutes
        const lockoutEnd = Date.now() + (15 * 60 * 1000); // 15 minutes
        sessionStorage.setItem('loginLockoutUntil', lockoutEnd.toString());
        setIsLocked(true);
        setLockoutRemaining(15 * 60 * 1000);
        showToast("Too many login attempts. Please try again in 15 minutes.", "error");
      } else if (status === 401) {
        const remaining = data?.remainingAttempts;
        if (typeof remaining === "number") {
          const attemptsText = remaining === 1 ? "1 attempt left." : `${remaining} attempts left.`;
          
          // Show stronger warning after 3 failed attempts (when remaining is 2 or less)
          if (remaining <= 2) {
            showToast(`⚠️ Warning: Only ${attemptsText} Account will be locked after failed attempts.`, "error");
          } else {
            showToast(`Invalid credentials. ${attemptsText}`, "error");
          }
        } else {
          showToast(data?.message || "Invalid credentials", "error");
        }
      } else if (status === 423) {
        showToast("Your account is locked. Please try again after 24 hours.", "error");
      } else {
        // Check if it's a captcha-specific error
        const errorMessage = data?.message || error.message || "Login failed";
        if (errorMessage.toLowerCase().includes("captcha")) {
          setCaptchaError(errorMessage);
        }
        showToast(errorMessage, "error");
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

        {/* Lockout Banner */}
        {isLocked && lockoutRemaining !== null && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4" role="alert" aria-live="polite">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800 mb-1">
                  Too Many Login Attempts
                </h3>
                <p className="text-sm text-red-700">
                  Please try again in {Math.floor(lockoutRemaining / 60000)}:{String(Math.floor((lockoutRemaining % 60000) / 1000)).padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>
        )}

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
              disabled={isLocked}
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
                disabled={isLocked}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters"
                  }
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

          {/* ALTCHA CAPTCHA Widget */}
          <div className="space-y-2">
            {React.createElement('altcha-widget' as any, {
              key: altchaKey,
              challengeurl: captchaUrl,
              disabled: isLocked,
              workerurl: '/altcha-worker.js'
            })}
            {captchaError && (
              <p className="text-sm text-red-500 mt-1">{captchaError}</p>
            )}
          </div>

          {/* Login Button */}
          <Button 
            type="submit" 
            className="w-full h-12 bg-[#e67e22] hover:bg-[#d35400] text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={isSubmitting || isLocked}
          >
            {isLocked ? (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Form Locked</span>
              </div>
            ) : isSubmitting ? (
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
