import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium" aria-label="Arunachal Festival" title="Arunachal Festival">
            <Image
              src="/logo.png"
              alt="Arunachal Festival Logo"
              width={24}
              height={24}
              className="w-6 h-6 object-contain drop-shadow-lg transition-all duration-300 hover:drop-shadow-xl hover:scale-105"
            />
            Arunachal Festival
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-[#FDF6E9] hidden lg:flex items-center justify-center">
        <Image
          src="/login.gif"
          alt="Login Illustration"
          width={500}
          height={450}
          className="object-contain dark:brightness-[0.2] dark:grayscale"
          priority
          style={{ width: 'auto', height: 'auto' }}
        />
      </div>
    </div>
  )
}