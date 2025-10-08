"use client";

import ContactUsPage from '@/components/(public)/contact/contact-us';
import React, { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function Contact() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500); // 2.5 seconds
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#fff8ed' }}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ContactUsPage />
    </div>
  );
} 