"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import Image from "next/image"

export default function Contactsection() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 bg-[#FDF6E9] overflow-hidden">
      {/* Decorative background elements - Diamonds */}
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-4 left-4 opacity-50 hidden sm:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-4 right-4 opacity-50 hidden sm:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute bottom-4 left-4 opacity-50 hidden sm:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute bottom-4 right-4 opacity-50 hidden sm:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-1/2 left-4 -translate-y-1/2 opacity-50 hidden md:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-1/2 right-4 -translate-y-1/2 opacity-50 hidden md:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-1/4 left-[10%] opacity-50 hidden lg:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-1/4 right-[10%] opacity-50 hidden lg:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute bottom-1/4 left-[10%] opacity-50 hidden lg:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute bottom-1/4 right-[10%] opacity-50 hidden lg:block"
      />

      {/* Decorative background elements - Dots */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#6A1B1A] rounded-full" />
      <div className="absolute top-[100px] left-[calc(50%-150px)] w-2 h-2 bg-[#6A1B1A] rounded-full hidden sm:block" />
      <div className="absolute top-[100px] right-[calc(50%-150px)] w-2 h-2 bg-[#6A1B1A] rounded-full hidden sm:block" />

      <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
        <div className="space-y-4">
          <p className="text-lg md:text-xl font-medium uppercase text-[#6A1B1A] tracking-widest font-dm-serif">
            Arunachal Literature Festival
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase text-[#6A1B1A] font-dm-serif">Contact Us</h2>
          <div className="mt-0 flex justify-center mb-12 relative z-10">
           <button className="group relative flex items-center hover:scale-105 transition-transform duration-300 focus:outline-none">
              <span className="bg-[#6A1B1A] text-white px-6 py-3 pr-12 rounded-full text-lg font-medium font-bilo">
                Get In Touch
              </span>
              <span className="absolute right-0 left-40 translate-x-1/2 bg-[#6A1B1A] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:translate-x-6 group-hover:rotate-12">
                <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-45" />
              </span>
            </button>
      </div>
        </div>

        <div className="mt-12 space-y-8 text-base md:text-lg text-gray-800 font-bilo">
          <div>
            <p className="font-semibold font-dm-serif">Office address :</p>
            <p>Directorate of Information and Public Relations</p>
            <p>(Soochna Bhawan), Papu Nallah, Naharlagun, Arunachal</p>
            <p>Pradesh Pin - 791110</p>
          </div>
          <div>
            <p className="font-semibold font-dm-serif">Event Venue:</p>
            <p>Dorjee Khandu State Convention Centre, Itanagar,</p>
            <p>Arunachal Pradesh Pin - 791111</p>
          </div>
          <div>
            <p className="font-semibold font-dm-serif">Email:</p>
            <p>arunachallitfest@gmail.com</p>
          </div>
        </div>
      </div>
    </section>
  )
}
