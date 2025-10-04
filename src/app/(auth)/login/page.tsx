import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
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

        {/* Footer text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Secure access to your festival dashboard
          </p>
        </div>
      </div>
    </div>
  )
}