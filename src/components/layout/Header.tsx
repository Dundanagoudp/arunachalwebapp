"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { href: "#speakers", label: "Speakers" },
    { href: "#schedule", label: "Schedule" },
    { href: "#registration", label: "Registration" },
    { href: "#archive", label: "Archive" },
    { href: "#in-the-news", label: "In the news" },
    { href: "#contact-us", label: "Contact Us" },
  ]

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between" style={{ backgroundColor: "#FFFAEE" }}>
      <Link href="/" className="flex items-center">
        <Image
          src="/logo.png"
          alt="Arunachal Lit-Fest Logo"
          // Use Tailwind classes for responsive sizing
          className="h-12 md:h-14 w-auto object-contain" // h-12 for mobile, h-14 for desktop, w-auto maintains aspect ratio
          width={0} // Set to 0 when using Tailwind for width/height
          height={0} // Set to 0 when using Tailwind for width/height
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimize image loading
        />
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8 text-lg font-medium font-bilo">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="text-black">
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-[#FFFAEE]">
            <div className="flex flex-col gap-4 py-6 font-bilo">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium text-black"
                  onClick={() => setIsMenuOpen(false)} // Close sheet on link click
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export default Header
