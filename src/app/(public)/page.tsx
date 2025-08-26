"use client";

import Homesection from "@/components/(public)/homecomponents/homesection";
import HeroSection from "@/components/(public)/homecomponents/modules/herosection";
import React, { useEffect } from "react";
import { getCookies } from "@/service/getCookiesServices";


export default function Home () {
  useEffect(() => {
    const fetchCookies = async () => {
      const response = await getCookies();
      // Cookies fetched silently for functionality
    };
    fetchCookies();
  }, []);

  return (
    <div>
      <HeroSection />
      <Homesection/>
    </div>
  );
} 