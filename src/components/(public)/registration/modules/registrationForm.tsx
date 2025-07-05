"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { useState } from "react"

export default function RegistrationForm() {
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [fieldValues, setFieldValues] = useState({
    fullName: "",
    designation: "",
    dateOfBirth: "",
    email: "",
    mobile: "",
    expectation: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }))
  }

  const inputWrapperClass = "relative mb-6"

  const getInputClass = (fieldName: string) => {
    const baseClass =
      "w-full px-4 py-3 text-sm font-medium bg-transparent border-2 rounded-full transition-all duration-300 focus:outline-none peer focus:ring-0"
    const isActive = focusedField === fieldName || fieldValues[fieldName as keyof typeof fieldValues]

    if (fieldName === "designation") {
      return `${baseClass} border-blue-500 focus:border-blue-600`
    }
    return `${baseClass} border-gray-400 focus:border-blue-500 hover:border-gray-500`
  }

  const getLabelClass = (fieldName: string, fieldType?: string) => {
    const baseClass = "absolute left-4 transition-all duration-300 pointer-events-none text-sm font-medium"
    const isActive =
      fieldType === "date" ||
      focusedField === fieldName ||
      fieldValues[fieldName as keyof typeof fieldValues]

    if (isActive) {
      if (fieldName === "designation") {
        return `${baseClass} -top-2 text-xs bg-[#FFFAEE] px-2 text-blue-600`
      }
      return `${baseClass} -top-2 text-xs bg-[#FFFAEE] px-2 text-gray-600`
    }
    return `${baseClass} top-3 text-gray-500`
  }

  const getTextareaClass = () => {
    const baseClass =
      "w-full px-4 py-3 text-sm font-medium bg-transparent border-2 rounded-2xl transition-all duration-300 focus:outline-none peer resize-none focus:ring-0"
    return `${baseClass} border-gray-400 focus:border-blue-500 hover:border-gray-500`
  }

  const getTextareaLabelClass = () => {
    const baseClass = "absolute left-4 transition-all duration-300 pointer-events-none text-sm font-medium"
    const isActive = focusedField === "expectation" || fieldValues.expectation

    if (isActive) {
      return `${baseClass} -top-2 text-xs bg-[#FFFAEE] px-2 text-gray-600`
    }
    return `${baseClass} top-3 text-gray-500`
  }

  return (
    <div className="min-h-screen bg-[#FFFAEE] relative overflow-hidden">
      {/* Decorative Sun Icons */}
      <div className="absolute top-20 left-10">
        <Image src="/sungif.gif" alt="Sun decoration" width={40} height={40} className="opacity-80" />
      </div>
      <div className="absolute top-32 right-16">
        <Image src="/sungif.gif" alt="Sun decoration" width={35} height={35} className="opacity-70" />
      </div>
      <div className="absolute bottom-40 left-8">
        <Image src="/sungif.gif" alt="Sun decoration" width={30} height={30} className="opacity-60" />
      </div>
      <div className="absolute top-96 right-20">
        <Image src="/sungif.gif" alt="Sun decoration" width={25} height={25} className="opacity-50" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="p-2 mr-4">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600 mb-4 tracking-wider">REGISTRATION</h1>

          <div className="flex items-center justify-center gap-4 mb-6">
            <Image src="/sungif.gif" alt="Sun decoration" width={40} height={40} />
            <h2 className="text-2xl md:text-3xl font-bold text-orange-500 text-center">
              BEGIN WHERE INDIA WAKES REGISTER NOW
            </h2>
            <Image src="/sungif.gif" alt="Sun decoration" width={40} height={40} />
          </div>
        </div>

        {/* Selected Workshop */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800">Screenwriting & Film Studies</h3>
        </div>

        {/* Registration Form */}
        <form className="space-y-6">
          {/* Full Name */}
          <div className={inputWrapperClass}>
            <Input
              id="fullName"
              type="text"
              value={fieldValues.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              onFocus={() => setFocusedField("fullName")}
              onBlur={() => setFocusedField(null)}
              className={getInputClass("fullName")}
            />
            <label htmlFor="fullName" className={getLabelClass("fullName")}>
              FULL NAME*
            </label>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Designation */}
            <div className={inputWrapperClass}>
              <Input
                id="designation"
                type="text"
                value={fieldValues.designation}
                onChange={(e) => handleInputChange("designation", e.target.value)}
                onFocus={() => setFocusedField("designation")}
                onBlur={() => setFocusedField(null)}
                className={getInputClass("designation")}
              />
              <label htmlFor="designation" className={getLabelClass("designation")}>
                DESIGNATION*
              </label>
            </div>

            {/* Date of Birth */}
            <div className={inputWrapperClass}>
              <Input
                id="dateOfBirth"
                type="date"
                value={fieldValues.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                onFocus={() => setFocusedField("dateOfBirth")}
                onBlur={() => setFocusedField(null)}
                className={getInputClass("dateOfBirth")}
              />
              <label htmlFor="dateOfBirth" className={getLabelClass("dateOfBirth", "date")}>
                DATE OF BIRTH*
              </label>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className={inputWrapperClass}>
              <Input
                id="email"
                type="email"
                value={fieldValues.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className={getInputClass("email")}
              />
              <label htmlFor="email" className={getLabelClass("email")}>
                EMAIL*
              </label>
            </div>

            {/* Mobile Number */}
            <div className={inputWrapperClass}>
              <Input
                id="mobile"
                type="tel"
                value={fieldValues.mobile}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                onFocus={() => setFocusedField("mobile")}
                onBlur={() => setFocusedField(null)}
                className={getInputClass("mobile")}
              />
              <label htmlFor="mobile" className={getLabelClass("mobile")}>
                MOBILE NUMBER*
              </label>
            </div>
          </div>

          {/* Expectation Textarea */}
          <div className={inputWrapperClass}>
            <Textarea
              id="expectation"
              value={fieldValues.expectation}
              onChange={(e) => handleInputChange("expectation", e.target.value)}
              onFocus={() => setFocusedField("expectation")}
              onBlur={() => setFocusedField(null)}
              rows={5}
              className={getTextareaClass()}
            />
            <label htmlFor="expectation" className={getTextareaLabelClass()}>
              EXPECTATION FROM THIS WORKSHOP*
            </label>
          </div>

          {/* Submit Button */}
             <div className="mt-8 flex justify-center">
          <button className="group relative flex items-center hover:scale-105 transition-transform duration-300 focus:outline-none">
            <span className="bg-[#6A1B1A] text-white px-6 py-3 pr-7 rounded-full text-lg font-medium">
              Regesiter
            </span>
            <span className="absolute right-0 left-30 translate-x-1/2 bg-[#6A1B1A] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:translate-x-6 group-hover:rotate-12">
              <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </button>
        </div>
        </form>
      </div>
    </div>
  )
}
