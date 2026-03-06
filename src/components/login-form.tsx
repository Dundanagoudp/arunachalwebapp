"use client";

import React, { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/custom-toast";
import { setCookie, getCookie } from "@/lib/cookies";
import { loginUser, generateCaptcha } from "@/service/authService";
import { getMyProfile } from "@/service/userServices";
import { Eye, EyeOff, RefreshCw } from "lucide-react";

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

  const [captchaSvg, setCaptchaSvg] = useState<string>("");
  const [captchaId, setCaptchaId] = useState<string>("");
  const [captchaCode, setCaptchaCode] = useState<string>("");
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [captchaError, setCaptchaError] = useState<string>("");

  const loadCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    setCaptchaCode("");
    setCaptchaError("");
    try {
      const res = await generateCaptcha();
      if (res.success) {
        setCaptchaSvg(res.svg);
        setCaptchaId(res.captchaId);
      } else {
        setCaptchaError("Failed to load CAPTCHA");
      }
    } catch {
      setCaptchaError("Failed to load CAPTCHA. Please refresh the page.");
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  // Check for existing lockout on mount and load captcha
  useEffect(() => {
    setMounted(true);

    const userRole = getCookie("userRole");
    if (userRole) {
      router.replace("/admin/dashboard");
      return;
    }

    const lockoutUntil = sessionStorage.getItem("loginLockoutUntil");
    if (lockoutUntil) {
      const lockoutTime = parseInt(lockoutUntil);
      const now = Date.now();
      if (now < lockoutTime) {
        setIsLocked(true);
        setLockoutRemaining(lockoutTime - now);
      } else {
        sessionStorage.removeItem("loginLockoutUntil");
      }
    }

    loadCaptcha();
  }, [router, loadCaptcha]);

  // Countdown timer effect
  useEffect(() => {
    if (!isLocked || lockoutRemaining === null) return;

    const interval = setInterval(() => {
      const lockoutUntil = sessionStorage.getItem("loginLockoutUntil");
      if (!lockoutUntil) {
        setIsLocked(false);
        setLockoutRemaining(null);
        return;
      }

      const lockoutTime = parseInt(lockoutUntil);
      const now = Date.now();
      const remaining = lockoutTime - now;

      if (remaining <= 0) {
        sessionStorage.removeItem("loginLockoutUntil");
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
    if (isLocked) return;

    setCaptchaError("");

    if (!captchaId) {
      setCaptchaError("CAPTCHA not loaded. Click 'New' to reload.");
      return;
    }

    if (!captchaCode.trim()) {
      setCaptchaError("Please enter the CAPTCHA code");
      return;
    }

    try {
      const result = await loginUser({
        email: data.email,
        password: data.password,
        captchaId,
        captchaCode: captchaCode.trim(),
      });

      if (!result.success) {
        showToast(result.message || "Login failed", "error");
        loadCaptcha();
        return;
      }

      sessionStorage.removeItem("loginLockoutUntil");

      const profileResponse = await getMyProfile();
      if (!profileResponse.success || !profileResponse.data) {
        showToast(
          "Login succeeded but could not load your profile. Please refresh.",
          "error"
        );
        return;
      }

      setCookie("userRole", profileResponse.data.role, { days: 1 });
      showToast("Welcome to Dashboard! Login successful.", "success");
      router.replace("/admin/dashboard");
    } catch (error: any) {
      const status = error?.response?.status;
      const errData = error?.response?.data || {};

      loadCaptcha();

      if (status === 429) {
        const lockoutEnd = Date.now() + 5 * 60 * 1000;
        sessionStorage.setItem("loginLockoutUntil", lockoutEnd.toString());
        setIsLocked(true);
        setLockoutRemaining(5 * 60 * 1000);
        showToast(
          "Too many login attempts. Please try again in 5 minutes.",
          "error"
        );
      } else if (status === 401) {
        const remaining = errData?.remainingAttempts;
        if (typeof remaining === "number") {
          const attemptsText =
            remaining === 1 ? "1 attempt left." : `${remaining} attempts left.`;
          if (remaining <= 2) {
            showToast(
              `Warning: Only ${attemptsText} Account will be locked after failed attempts.`,
              "error"
            );
          } else {
            showToast(`Invalid credentials. ${attemptsText}`, "error");
          }
        } else {
          showToast(errData?.message || "Invalid credentials", "error");
        }
      } else {
        const errorMessage =
          errData?.message || error.message || "Login failed";
        const remaining = errData?.remainingAttempts;
        let toastMessage = errorMessage;
        if (typeof remaining === "number") {
          const attemptsText =
            remaining === 1 ? "1 attempt left." : `${remaining} attempts left.`;
          toastMessage = `${errorMessage} ${attemptsText}`;
        }
        if (errorMessage.toLowerCase().includes("captcha")) {
          setCaptchaError(errorMessage);
        }
        showToast(toastMessage, "error");
      }
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || "Invalid email address";
  };

  return (
    <div className="w-full">
      <form
        className={cn(
          "bg-white rounded-lg shadow-lg border border-gray-200 p-6 space-y-6 block",
          className
        )}
        onSubmit={handleSubmit(onSubmit)}
        {...props}
      >
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#e67e22] to-[#d35400] rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm">
              Login to your account to continue
            </p>
          </div>
        </div>

        {/* Lockout Banner */}
        {isLocked && lockoutRemaining !== null && (
          <div
            className="bg-red-50 border border-red-200 rounded-lg p-4"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-red-600 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800 mb-1">
                  Too Many Login Attempts
                </h3>
                <p className="text-sm text-red-700">
                  Please try again in{" "}
                  {Math.floor(lockoutRemaining / 60000)}:
                  {String(
                    Math.floor((lockoutRemaining % 60000) / 1000)
                  ).padStart(2, "0")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
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
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="new-password"
                className="h-12 px-4 pr-12 border-gray-200 focus:border-[#e67e22] focus:ring-[#e67e22]"
                disabled={isLocked}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
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

          {/* SVG CAPTCHA Section */}
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-3">
              <div className="text-center">
                <h3 className="text-gray-800 text-xs font-bold tracking-widest uppercase">
                  Security Code Verification
                </h3>
              </div>

              <p className="text-[#e67e22] text-sm font-semibold text-center tracking-wide">
                Type this exact code below
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <div className="bg-white rounded-md border border-gray-200 p-2 flex items-center justify-center min-h-[60px] min-w-[200px] shadow-sm overflow-hidden">
                  {captchaLoading ? (
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : captchaSvg ? (
                    <div
                      className="[&>svg]:max-w-full [&>svg]:h-auto"
                      dangerouslySetInnerHTML={{ __html: captchaSvg }}
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">
                      CAPTCHA unavailable
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={loadCaptcha}
                  disabled={captchaLoading || isLocked}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-[#e67e22] hover:text-[#d35400] rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 shadow-sm"
                  title="Load new CAPTCHA"
                >
                  <RefreshCw
                    className={cn(
                      "h-3.5 w-3.5",
                      captchaLoading && "animate-spin"
                    )}
                  />
                  New
                </button>
              </div>

              <p className="text-gray-500 text-xs text-center">
                Enter the 8-character code exactly as shown (case insensitive)
              </p>
            </div>

            <Input
              type="text"
              placeholder="Enter CAPTCHA code"
              maxLength={8}
              value={captchaCode}
              onChange={(e) => setCaptchaCode(e.target.value)}
              disabled={isLocked || captchaLoading}
              className="h-12 px-4 text-center text-lg tracking-[0.3em] font-mono border-gray-200 focus:border-[#e67e22] focus:ring-[#e67e22]"
              autoComplete="off"
            />
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
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
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
