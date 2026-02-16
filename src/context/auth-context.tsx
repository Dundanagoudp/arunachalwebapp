"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie, deleteCookie } from "@/lib/cookies";
import { getMyProfile } from "@/service/userServices";
import { logoutUser } from "@/service/authService";

type AuthContextType = {
  userRole: string | null;
  isLoading: boolean;
  login: (role: string) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const profileResponse = await getMyProfile();
      if (profileResponse.success && profileResponse.data?.role) {
        setUserRole(profileResponse.data.role);
        setCookie("userRole", profileResponse.data.role, { days: 1 });
        return true;
      }
      deleteCookie("userRole");
      setUserRole(null);
      return false;
    } catch (error) {
      console.error("Auth check failed:", error);
      deleteCookie("userRole");
      setUserRole(null);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const profileResponse = await getMyProfile();
      if (profileResponse.success && profileResponse.data?.role) {
        setUserRole(profileResponse.data.role);
        setCookie("userRole", profileResponse.data.role, { days: 1 });
      } else {
        deleteCookie("userRole");
        setUserRole(null);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (role: string) => {
    setCookie("userRole", role, { days: 1 });
    setUserRole(role);
  };

  const logout = async () => {
    try {
      await logoutUser({ message: "", success: true });
    } catch (e) {
      console.error("Logout API error:", e);
    }
    deleteCookie("userRole");
    setUserRole(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ userRole, isLoading, login, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ... useAuth hook remains the same
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
