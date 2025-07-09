"use client"
import { ArrowUpRight } from "lucide-react"
import type React from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import SunIcon from "../archive/sun-icon"
import { useState } from "react"
import { contactUsMail } from "@/service/contactusServices"
import { toast } from "sonner"

export default function ContactUsPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await contactUsMail({
        name: fullName,
        email,
        message: description,
        phone: mobile,
      })
      if (response.success) {
        toast.success("Message sent! Thank you for contacting us. We'll get back to you soon.")
        setFullName("")
        setEmail("")
        setMobile("")
        setDescription("")
      } else {
        toast.error(response.error || "Failed to send message. Please try again.")
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF8ED] py-8 px-2 sm:py-12 sm:px-4 lg:px-8 flex flex-col items-center overflow-x-hidden font-['Inter',sans-serif]">
      {/* Header Section */}
      <div className="relative text-center mb-8 sm:mb-12 max-w-4xl mx-auto px-2 sm:px-4">
        <h1 className="text-[#1A3FA9] font-dm-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-wide mb-4">
          CONTACT US
        </h1>
        <p className="text-gray-700 font-bilo text-sm sm:text-base sm:text-lg leading-relaxed px-1 sm:px-4">
          We&apos;d love to hear from you! For any queries or more information about the Arunachal Literature and Art
          Festival 2025, please feel free to reach out to us.
        </p>
        <SunIcon size={40} className="absolute -top-4 -left-4" />
        <SunIcon size={40} className="absolute -top-4 -right-4" />
      </div>

      {/* Main Content: Form and Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 md:gap-x-16 gap-y-8 w-full max-w-xl sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SunIcon size={48} className="absolute -left-6 top-1/2 -translate-y-1/2 hidden lg:block z-0" />

        {/* Left Column: Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg border-2 border-[#1A3FA9] flex flex-col gap-6 relative z-10 w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto font-bilo"
        >
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2 font-bilo">
              FULL NAME<span className="text-red-500">*</span>
            </label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-4 text-gray-900 focus:outline-none focus:border-[#1A3FA9] transition-colors font-medium bg-white font-bilo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-bilo">
              EMAIL<span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-4 text-gray-900 focus:outline-none focus:border-[#1A3FA9] transition-colors font-medium bg-white font-bilo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2 font-bilo">
              MOBILE NUMBER<span className="text-red-500">*</span>
            </label>
            <Input
              id="mobile"
              type="tel"
              placeholder="Enter your mobile number"
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-4 text-gray-900 focus:outline-none focus:border-[#1A3FA9] transition-colors font-medium bg-white font-bilo"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2 font-bilo">
              DESCRIPTION
            </label>
            <Textarea
              id="description"
              placeholder="Enter your message or description"
              rows={5}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:outline-none focus:border-[#1A3FA9] transition-colors font-medium bg-white resize-y min-h-[60px] sm:min-h-[120px] font-bilo"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="mt-4 flex justify-start">
            <button
              type="submit"
              className="group relative flex items-center hover:scale-105 transition-transform duration-300 focus:outline-none font-bilo"
              disabled={loading}
            >
              <span className="bg-[#D95E1E] text-white px-8 py-2 rounded-full text-base sm:text-lg font-medium font-bilo">
                {loading ? "Submitting..." : "Submit"}
              </span>
              <span className="absolute right-0 left-25 translate-x-1/2 bg-[#D95E1E] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:translate-x-6 group-hover:rotate-12">
                <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-45" />
              </span>
            </button>
          </div>
        </form>

        {/* Right Column: Contact Details */}
        <div className="flex flex-col gap-6 sm:gap-8 text-gray-800 font-bilo p-4 sm:p-8 relative z-10 justify-end h-full">
          <SunIcon
            size={48}
            className="absolute -right-6 top-1/2 -translate-y-1/2 hidden lg:block z-0"
          />
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-2 text-[#1A3FA9] font-dm-serif">Event Venue:</h3>
            <p>Dorjee Khandu State Convention</p>
            <p>Centre, Itanagar, Arunachal</p>
            <p>Pradesh Pin - 791111</p>
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-2 text-[#1A3FA9] font-dm-serif">Email:</h3>
            <p>arunachallitfest@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
