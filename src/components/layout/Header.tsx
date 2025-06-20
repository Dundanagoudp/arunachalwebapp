"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { motion } from "framer-motion"

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
          className="h-12 md:h-16 w-auto object-contain"
          width={0}
          height={0}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8 text-lg font-medium font-bilo">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-black hover:text-gray-600 transition-colors duration-300"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="focus-visible:ring-0 focus-visible:ring-offset-0">
              <motion.div
                animate={isMenuOpen ? "open" : "closed"}
                variants={{
                  open: { rotate: 90 },
                  closed: { rotate: 0 },
                }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-6 w-6" />
              </motion.div>
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[250px] sm:w-[300px] bg-[#FFFAEE] p-0"
            onInteractOutside={(e) => {
              e.preventDefault()
            }}
          >
            <SheetTitle className="sr-only">Main Navigation</SheetTitle>
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              // Modified transition for a smoother, slower pop-up
              transition={{ type: "tween", duration: 0.5, ease: "easeOut" }}
              className="h-full"
            >
              <div className="flex flex-col gap-6 py-8 px-6 font-bilo h-full">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="text-lg font-medium text-black hover:text-gray-600 transition-colors duration-300 block py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export default Header
