"use client"

import { ArrowUpRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import SunIcon from "@/components/archive/sun-icon"

export default function ContactUsPage() {
  const inputWrapperClass = "relative"
  const labelClass =
    "absolute left-4 -top-2.5 text-xs text-gray-700 bg-white px-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:-top-2.5 peer-focus:text-xs"
  const inputClass =
    "peer w-full border border-black rounded-lg p-3 pt-4 text-gray-900 placeholder-transparent focus:outline-none focus:border-black"

  return (
    <div className="min-h-screen bg-[#FFF8ED] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center overflow-x-hidden">
      {/* Header Section */}
      <div className="relative text-center mb-12 max-w-4xl mx-auto">
        <h1 className="text-[#1A3FA9] font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wide mb-4">
          CONTACT US
        </h1>
        <p className="text-gray-700 font-sans text-base sm:text-lg leading-relaxed px-4">
          We&apos;d love to hear from you! For any queries or more information about the Arunachal Literature and Art
          Festival 2025, please feel free to reach out to us.
        </p>
        <SunIcon
          size={48}
          className="absolute -top-4 -left-4"
        />
        <SunIcon
          size={48}
          className="absolute -top-4 -right-4"
        />
      </div>

      {/* Main Content: Form and Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-8 max-w-6xl mx-auto w-full relative">
        <SunIcon
          size={64}
          className="absolute -left-12 top-1/2 -translate-y-1/2 hidden lg:block z-0"
        />

        {/* Left Column: Contact Form */}
        <div className="bg-white p-10 rounded-lg shadow-lg border border-[#1A3FA9] flex flex-col gap-10 relative z-10">
          <div className={inputWrapperClass}>
            <Input
              id="fullName"
              type="text"
              placeholder="FULL NAME*"
              className={inputClass}
              suppressHydrationWarning
            />
            <label htmlFor="fullName" className={labelClass}>
              FULL NAME*
            </label>
          </div>

          <div className={inputWrapperClass}>
            <Input
              id="email"
              type="email"
              placeholder="EMAIL*"
              className={inputClass}
              suppressHydrationWarning
            />
            <label htmlFor="email" className={labelClass}>
              EMAIL*
            </label>
          </div>

          <div className={inputWrapperClass}>
            <Input
              id="mobile"
              type="tel"
              placeholder="MOBILE NUMBER*"
              className={inputClass}
              suppressHydrationWarning
            />
            <label htmlFor="mobile" className={labelClass}>
              MOBILE NUMBER*
            </label>
          </div>

          <div className={inputWrapperClass}>
            <Textarea
              id="description"
              placeholder="DESCRIPTION"
              rows={5}
              className={`${inputClass} resize-y`}
              suppressHydrationWarning
            />
            <label htmlFor="description" className={labelClass}>
              DESCRIPTION
            </label>
          </div>

          {/* View All Button */}
          <div className="mt-5 flex justify-start">
            <button className="group relative flex items-center hover:scale-105 transition-transform duration-300 focus:outline-none">
              <span className="bg-[#D95E1E] text-white px-6 py-2 pr-12 rounded-full text-lg font-medium">
                Submit
              </span>
              <span className="absolute right-0 left-30 translate-x-1/2 bg-[#D95E1E] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:translate-x-6 group-hover:rotate-12">
                <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-45" />
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Contact Details */}
        <div className="flex flex-col gap-8 text-gray-800 font-sans p-8 relative z-10 justify-end h-full">
          <SunIcon
            size={64}
            className="absolute -right-12 top-1/2 -translate-y-1/2 hidden lg:block z-0"
          />
          <div>
            <h3 className="font-bold text-lg mb-2 text-[#1A3FA9]">Event Venue:</h3>
            <p>Dorjee Khandu State Convention</p>
            <p>Centre, Itanagar, Arunachal</p>
            <p>Pradesh Pin - 791111</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-[#1A3FA9]">Email:</h3>
            <p>arunachallitfest@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
