"use client"

import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  // Prevent right-click context menu on login page for security
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <div 
      className="min-h-screen bg-white flex items-center justify-center p-4"
      onContextMenu={handleContextMenu}
    >
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <a href="#" className="inline-flex items-center gap-3 font-semibold text-gray-800" aria-label="Arunachal Literature" title="Arunachal Literature">
            <Image
              src="/logo.png"
              alt="Arunachal Literature Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold text-gray-800">
              Arunachal Literature
            </span>
          </a>
        </div>

        {/* Login Form Container */}
        <LoginForm />

      </div>
    </div>
  )
}