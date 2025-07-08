"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import DiamondBackground from "./DiamondBackground"
import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function Contactsection() {
  const router = useRouter()

  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: 'ease-in-out',
      once: true,
    })
  }, [])

  const handleContactClick = () => {
    router.push("/contactus")
  }

  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 bg-[#FDF6E9] overflow-hidden">
      {/* Decorative background elements - Diamonds */}
      <DiamondBackground />
      <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
        <div className="space-y-4">
          <p data-aos="fade-up" data-aos-delay="0" data-aos-duration="1000" className="text-lg md:text-xl font-medium uppercase text-[#6A1B1A] tracking-widest font-dm-serif">
            Arunachal Literature Festival
          </p>
          <h2 data-aos="fade-up" data-aos-delay="100" data-aos-duration="1000" className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase text-[#6A1B1A] font-dm-serif">Contact Us</h2>
          <div data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000" className="mt-0 flex justify-center mb-12 relative z-10">
           <button 
              onClick={handleContactClick}
              className="group relative flex items-center hover:scale-105 transition-transform duration-300 focus:outline-none cursor-pointer"
            >
              <span className="bg-[#6A1B1A] text-white px-8 py-3 rounded-full text-lg font-medium font-bilo">
                Get In Touch
              </span>
              <span className="absolute right-0 left-36 translate-x-1/2 bg-[#6A1B1A] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:translate-x-6 group-hover:rotate-12">
                <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-45" />
              </span>
            </button>
      </div>
        </div>

        <div className="mt-12 space-y-8 text-base md:text-lg text-gray-800 font-bilo">
          <div data-aos="fade-up" data-aos-delay="300" data-aos-duration="1000">
            <p className="font-semibold font-dm-serif">Office address :</p>
            <p>Directorate of Information and Public Relations</p>
            <p>(Soochna Bhawan), Papu Nallah, Naharlagun, Arunachal</p>
            <p>Pradesh Pin - 791110</p>
          </div>
          <div data-aos="fade-up" data-aos-delay="400" data-aos-duration="1000">
            <p className="font-semibold font-dm-serif">Event Venue:</p>
            <p>Dorjee Khandu State Convention Centre, Itanagar,</p>
            <p>Arunachal Pradesh Pin - 791111</p>
          </div>
          <div data-aos="fade-up" data-aos-delay="500" data-aos-duration="1000">
            <p className="font-semibold font-dm-serif">Email:</p>
            <p>arunachallitfest@gmail.com</p>
          </div>
        </div>
      </div>
    </section>
  )
}
