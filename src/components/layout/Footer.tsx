import Image from "next/image"
import Link from "next/link"
import { Linkedin, Instagram, Facebook } from "lucide-react"
import DiamondBackground from "./DiamondBackground"

export default function Footer() {
  return (
    <footer
      className="bg-[#1A3FA9] text-white py-12 px-4 md:px-6 lg:px-8 relative overflow-hidden font-bilo"
      style={{
        // backgroundImage: "url('/images/Footer.png')",
        // backgroundRepeat: "",
        backgroundSize: "200px", // Adjusted size to make the pattern very sparse and subtle
      }}
    >
      <DiamondBackground />
      <div className="container mx-auto max-w-7xl">
        {/* Top Section: Logo and Main Heading */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 text-center md:text-left">
          <div className="mb-6 md:mb-0">
            <Image
              src="/images/Footerlogo.png"
              alt="Arunachal Lit-Fest Logo"
              width={120} 
              height={50} 
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider uppercase text-center md:flex-1 text-[#FF9900]">
            ARUNACHAL LITERATURE FESTIVAL
          </h2>
          <div className="md:w-[180px] md:h-[90px] hidden md:block" /> {/* Placeholder to balance layout */}
        </div>

        {/* Bottom Section: Navigation, Assistance, Socials, Office Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center md:text-left">
          {/* Navigate Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#FF9900] font-bilo">Navigate</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/registration" className="hover:underline">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="hover:underline">
                  Schedule
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:underline">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/workshop" className="hover:underline">
                  Workshop
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/inthenews" className="hover:underline">
                  In the news
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:underline">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Assistance Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#FF9900] font-bilo">Assistance</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contactus" className="hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* New parent div for Socials and Office Address */}
          <div className="flex flex-col gap-8">
            {/* Socials Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#FF9900] font-bilo">Socials</h3>
              <div className="flex justify-center md:justify-start space-x-4">
                <Link href="#" aria-label="LinkedIn" className="hover:text-gray-300">
                  <Linkedin className="size-6" />
                </Link>
                <Link href="#" aria-label="Instagram" className="hover:text-gray-300">
                  <Instagram className="size-6" />
                </Link>
                <Link href="#" aria-label="Facebook" className="hover:text-gray-300">
                  <Facebook className="size-6" />
                </Link>
              </div>
            </div>

            {/* Office Address Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#FF9900] font-bilo">Office Address</h3>
              <p className="text-sm leading-relaxed">
                Directorate of Information and Public Relations (Soochna bhawan), papu nallah, Naharlagun, Arunachal
                Pradesh Pin - 791110
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
