// context/SignupContext.tsx
"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

interface SignupData {
  adminDetails: {
    email: string;
    name: string;
    phone: string;
    password: string;
    confirmPassword: string;
  };
  organizationDetails: {
    organization_name: string;
    organization_phone: string;
    organization_email: string;
    organization_address: string;
    organization_state: string;
    organization_country: string;
  };
}

interface SignupContextType {
  step: number;
  data: SignupData;
  setStep: (step: number) => void;
  setAdminDetails: (details: Partial<SignupData["adminDetails"]>) => void;
  setOrganizationDetails: (
    details: Partial<SignupData["organizationDetails"]>
  ) => void;
  submitSignup: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export function SignupProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SignupData>({
    adminDetails: {
      email: "",
      name: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    organizationDetails: {
      organization_name: "",
      organization_phone: "",
      organization_email: "",
      organization_address: "",
      organization_state: "",
      organization_country: "",
    },
  });
  const router = useRouter();

  const setAdminDetails = (details: Partial<SignupData["adminDetails"]>) => {
    setData((prev) => ({
      ...prev,
      adminDetails: {
        ...prev.adminDetails,
        ...details,
      },
    }));
  };

  const setOrganizationDetails = (
    details: Partial<SignupData["organizationDetails"]>
  ) => {
    setData((prev) => ({
      ...prev,
      organizationDetails: {
        ...prev.organizationDetails,
        ...details,
      },
    }));
  };

  const submitSignup = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/onboarding/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            organizationDetails: data.organizationDetails,
            adminDetails: {
              user_name: data.adminDetails.name,
              email: data.adminDetails.email,
              password: data.adminDetails.password,
              phone: data.adminDetails.phone,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();
      router.push("/dashboard"); // Redirect on success
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignupContext.Provider
      value={{
        step,
        data,
        setStep,
        setAdminDetails,
        setOrganizationDetails,
        submitSignup,
        isLoading,
        error,
      }}
    >
      {children}
    </SignupContext.Provider>
  );
}

export function useSignup() {
  const context = useContext(SignupContext);
  if (context === undefined) {
    throw new Error("useSignup must be used within a SignupProvider");
  }
  return context;
}
