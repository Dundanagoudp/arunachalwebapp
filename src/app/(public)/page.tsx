'use client';
import Homesection from "@/components/(public)/homecomponents/homesection";
import HeroSection from "@/components/(public)/homecomponents/modules/herosection";
import React, { useEffect } from "react";
import { getCookies } from "@/service/getCookiesServices";


export default function Home () {
  useEffect(() => {
    const fetchCookies = async () => {
      const response = await getCookies();
      if (response?.success) {
        console.log("Cookies:", response.data);
      } else {
        console.error("Error fetching cookies:", response.error);
      }
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