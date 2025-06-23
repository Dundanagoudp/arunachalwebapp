"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { motion, AnimatePresence } from "framer-motion"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const navLinks = [
    { href: "/speakers", label: "Speakers" },
    { href: "/schedule", label: "Schedule" },
    { href: "/registration", label: "Registration" },
    { href: "/archive", label: "Archive" },
    { href: "/Inthenews", label: "In the news" },
    { href: "/blog", label: "Blogs" },
    { href: "/contactus", label: "Contact Us" },
  ]

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Check if screen is mobile (lg: 1024px)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      {isMobile ? (
        <motion.header
          className={`fixed top-0 left-0 right-0 z-50 w-full py-4 px-6 flex items-center justify-between font-bilo transition-all duration-500 ${
            isScrolled ? "bg-[#FFFAEE]/95 backdrop-blur-md border-b border-amber-200/50" : "bg-[#FFFAEE]"
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
              <Image
                src="/logo.png"
                alt="Arunachal Lit-Fest Logo"
                className={`w-auto object-contain transition-all duration-300 ${
                  isScrolled ? "h-10 md:h-12" : "h-12 md:h-16"
                }`}
                width={0}
                height={0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 font-bilo">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link
                  href={link.href}
                  className="relative text-black hover:text-black font-bilo font-medium text-sm xl:text-base transition-colors duration-300 group py-2"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                  <motion.span
                    className="absolute inset-0 bg-amber-100/30 rounded-lg -z-10"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 hover:bg-amber-100 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 transition-all duration-300 relative overflow-hidden"
                >
                  <motion.div className="relative w-6 h-6 font-bilo" whileTap={{ scale: 0.9 }}>
                    <AnimatePresence mode="wait">
                      {!isMenuOpen ? (
                        <motion.div
                          key="menu"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0"
                        >
                          <Menu className="w-6 h-6 text-black font-bilo" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="close"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0"
                        >
                          <X className="w-6 h-6 text-black font-bilo" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[280px] sm:w-[320px] p-0 border-l border-amber-200/50 backdrop-blur-md"
                style={{ backgroundColor: "#FFFAEE" }}
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                {/* Mobile Menu Links */}
                <div className="py-6">
                  <nav className="space-y-1 font-bilo">
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.1 + index * 0.05,
                          duration: 0.4,
                          ease: "easeOut",
                        }}
                      >
                        <Link
                          href={link.href}
                          onClick={handleLinkClick}
                          className="group flex items-center px-6 py-4 text-base font-bilo font-medium text-black hover:text-black hover:bg-amber-50/50 transition-all duration-300 relative overflow-hidden"
                        >
                          <motion.div
                            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-600 to-orange-600"
                            initial={{ scaleY: 0 }}
                            whileHover={{ scaleY: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                          <motion.span className="relative z-10" whileHover={{ x: 8 }} transition={{ duration: 0.2 }}>
                            {link.label}
                            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
                          </motion.span>
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </div>

                {/* Mobile Menu Footer */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-6 border-t border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {/* <p className="text-xs text-gray-500 text-center font-medium">Literary Festival • Arunachal Pradesh</p> */}
                </motion.div>
              </SheetContent>
            </Sheet>
          </div>
        </motion.header>
      ) : (
        <header
          className={`fixed top-0 left-0 right-0 z-50 w-full py-4 px-6 flex items-center justify-between font-bilo transition-all duration-500 ${
            isScrolled ? "bg-[#FFFAEE]/95 backdrop-blur-md border-b border-amber-200/50" : "bg-[#FFFAEE]"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div>
              <Image
                src="/logo.png"
                alt="Arunachal Lit-Fest Logo"
                className={`w-auto object-contain transition-all duration-300 ${
                  isScrolled ? "h-10 md:h-12" : "h-12 md:h-16"
                }`}
                width={0}
                height={0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 font-bilo">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className="relative text-black hover:text-black font-bilo font-medium text-sm xl:text-base transition-colors duration-300 group py-2"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                  <span className="absolute inset-0 bg-amber-100/30 rounded-lg -z-10 opacity-0 group-hover:opacity-100 transition duration-200" />
                </Link>
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 hover:bg-amber-100 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="relative w-6 h-6 font-bilo">
                    {!isMenuOpen ? (
                      <div className="absolute inset-0">
                        <Menu className="w-6 h-6 text-black font-bilo" />
                      </div>
                    ) : (
                      <div className="absolute inset-0">
                        <X className="w-6 h-6 text-black font-bilo" />
                      </div>
                    )}
                  </div>
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[280px] sm:w-[320px] p-0 border-l border-amber-200/50 backdrop-blur-md"
                style={{ backgroundColor: "#FFFAEE" }}
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                {/* Mobile Menu Links */}
                <div className="py-6">
                  <nav className="space-y-1 font-bilo">
                    {navLinks.map((link) => (
                      <div key={link.href}>
                        <Link
                          href={link.href}
                          onClick={handleLinkClick}
                          className="group flex items-center px-6 py-4 text-base font-bilo font-medium text-black hover:text-black hover:bg-amber-50/50 transition-all duration-300 relative overflow-hidden"
                        >
                          <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-600 to-orange-600 opacity-0 group-hover:opacity-100 transition duration-300" />
                          <span className="relative z-10 group-hover:translate-x-2 transition duration-200">
                            {link.label}
                            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
                          </span>
                        </Link>
                      </div>
                    ))}
                  </nav>
                </div>

                {/* Mobile Menu Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50" />
              </SheetContent>
            </Sheet>
          </div>
        </header>
      )}

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className={`transition-all duration-500 ${isScrolled ? "h-16 md:h-20" : "h-20 md:h-24"}`} />
    </>
  )
}

export default Header
