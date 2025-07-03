"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { getTestimonials } from "@/service/testimonialService"
import type { Testimonial as ApiTestimonial } from "@/types/testimonial-types"

export default function Attendeessay() {
  const [testimonials, setTestimonials] = useState<ApiTestimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTestimonials() {
      setLoading(true)
      setError(null)
      try {
        const res = await getTestimonials()
        if (res.success && res.data) {
          setTestimonials(res.data)
        } else {
          setError(res.error || "Failed to fetch testimonials.")
        }
      } catch (err) {
        setError("Failed to fetch testimonials.")
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  // Loading state
  if (loading) {
    return (
      <div 
        className="relative min-h-0 md:min-h-screen overflow-hidden bg-blue-900 text-white pb-12 font-bilo text-base"
      >
        {/* Top Blurred Image */}
        <div className="absolute top-0 left-0 w-full h-[200px] md:h-[300px] lg:h-[420px] overflow-hidden">
          <Image
            src="/attendeessay/b3.png"
            alt="Blurred sky with clouds"
            fill
            className="object-cover object-top"
          />
          {/* #fdf8f0 blur overlay at the top */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#fdf8f0] via-[#fdf8f0]/80 to-transparent z-20" />
        </div>

        {/* Book image for mobile/tablet only */}
        <div className="relative z-20 flex justify-center lg:hidden pt-[120px] md:pt-[180px] pb-6">
          <Image
            src="/attendeessay/book.png"
            alt="Stack of books"
            width={110}
            height={110}
            className="object-contain drop-shadow-2xl"
          />
        </div>

        <div className="relative z-10 md:pt-[300px] lg:pt-[400px] pb-10 md:pb-20 lg:pb-24 flex flex-col items-center px-4 font-bilo text-base">
          {/* Header Text */}
          <div className="text-center mb-12 max-w-4xl mx-auto font-bilo">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <h2 
                className="text-2xl md:text-3xl font-bold font-serif tracking-wide uppercase text-yellow-400 drop-shadow-lg font-bilo"
              >
                Arunachal Literature Festival
              </h2>
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
            </div>
            <h3 
              className="text-2xl md:text-5xl font-bold mb-8 text-yellow-400 drop-shadow-lg font-serif tracking-wide"
            >
              WHAT OUR ATTENDEES SAY
            </h3>
          </div>

          {/* Loading Skeleton Cards */}
          <div>
            {/* Mobile/Tablet loading skeleton */}
            <div className="flex flex-row gap-4 w-screen pl-4 pr-4 sm:pl-8 sm:pr-8 lg:hidden overflow-x-auto scrollbar-hide pb-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-w-[85vw] max-w-[90vw] flex-shrink-0">
                  <LoadingTestimonialCard mobilePadding />
                </div>
              ))}
            </div>

            {/* Desktop loading skeleton */}
            <div className="hidden lg:grid grid-cols-3 gap-6 max-w-6xl mx-auto w-full relative mb-60">
              {/* Left Column */}
              <div className="flex flex-col gap-6">
                <LoadingTestimonialCard />
                <LoadingTestimonialCard />
              </div>
              {/* Center Column - Large Card */}
              <div className="justify-center h-100 mt-30">
                {/* Book image for desktop only */}
                <div className="justify-center mb-8 ml-28 hidden lg:block">
                  <Image
                    src="/attendeessay/book.png"
                    alt="Stack of books"
                    width={130}
                    height={130}
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
                <LoadingTestimonialCard />
              </div>
              {/* Right Column */}
              <div className="flex flex-col gap-6">
                <LoadingTestimonialCard />
                <LoadingTestimonialCard />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Blurred Image */}
        <div className="absolute bottom-0 left-0 w-full h-[120px] md:h-[180px] lg:h-[280px] overflow-hidden">
          <Image
            src="/attendeessay/bottom2.png"
            alt="Blurred forest trees"
            fill
            className="object-cover object-bottom"
          />
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="relative min-h-0 md:min-h-screen flex items-center justify-center bg-blue-900 text-white pb-12">
        <div className="text-xl font-bold text-red-400">{error}</div>
      </div>
    )
  }

  // No testimonials state
  if (!testimonials.length) {
    return (
      <div className="relative min-h-0 md:min-h-screen flex items-center justify-center bg-blue-900 text-white pb-12">
        <div className="text-xl font-bold">No testimonials available yet.</div>
      </div>
    )
  }

  // Layout: 2 left, 1 center (large), 2 right (if enough), else fill as possible
  let left: ApiTestimonial[] = []
  let center: ApiTestimonial | null = null
  let right: ApiTestimonial[] = []
  if (testimonials.length >= 5) {
    left = testimonials.slice(0, 2)
    center = testimonials[2]
    right = testimonials.slice(3, 5)
  } else if (testimonials.length === 4) {
    left = testimonials.slice(0, 2)
    center = testimonials[2]
    right = [testimonials[3]]
  } else if (testimonials.length === 3) {
    left = [testimonials[0]]
    center = testimonials[1]
    right = [testimonials[2]]
  } else if (testimonials.length === 2) {
    left = [testimonials[0]]
    center = testimonials[1]
    right = []
  } else if (testimonials.length === 1) {
    left = []
    center = testimonials[0]
    right = []
  }

  return (
    <div 
      className="relative min-h-0 md:min-h-screen overflow-hidden bg-blue-900 text-white pb-12 font-bilo text-base"
    >
      
      {/* Top Blurred Image */}

       <div className="absolute top-0 left-0 w-full h-[200px] md:h-[300px] lg:h-[420px] overflow-hidden">
       <Image
          src="/attendeessay/b3.png"
          alt="Blurred sky with clouds"
          fill
          className="object-cover object-top"
        />
        {/* #fdf8f0 blur overlay at the top */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#fdf8f0] via-[#fdf8f0]/80 to-transparent z-20" />
      </div>

      {/* Book image for mobile/tablet only */}
      <div className="relative z-20 flex justify-center lg:hidden pt-[120px] md:pt-[180px] pb-6">
        <Image
          src="/attendeessay/book.png"
          alt="Stack of books"
          width={110}
          height={110}
          className="object-contain drop-shadow-2xl"
        />
      </div>

      <div className="relative z-10  md:pt-[300px] lg:pt-[400px] pb-10 md:pb-20 lg:pb-24 flex flex-col items-center px-4 font-bilo text-base">
        {/* Header Text */}
        <div className="text-center mb-12 max-w-4xl mx-auto font-bilo">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <h2 
              className="text-2xl md:text-3xl font-bold font-serif tracking-wide uppercase text-yellow-400 drop-shadow-lg font-bilo"
            >
              Arunachal Literature Festival
            </h2>
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
          </div>
          <h3 
            className="text-2xl md:text-5xl font-bold mb-8 text-yellow-400 drop-shadow-lg font-serif tracking-wide"
          >
            WHAT OUR ATTENDEES SAY
          </h3>

        </div>

        {/* Testimonial Cards Layout */}
        {/* Mobile: single column, edge-to-edge; Desktop: 3 columns as before */}
        <div>
          {/* Mobile/Tablet only: horizontal scrollable carousel */}
          <div className="flex flex-row gap-4 w-screen pl-4 pr-4 sm:pl-8 sm:pr-8 lg:hidden overflow-x-auto scrollbar-hide pb-2">
            {testimonials.map((t) => (
              <div key={t._id} className="min-w-[85vw] max-w-[90vw] flex-shrink-0">
                <TestimonialCard
                  name={t.name}
                  title={t.about}
                  quote={t.description}
                  avatar={t.image_url}
                  mobilePadding
                />
              </div>
            ))}
          </div>

          {/* Desktop: 3 columns as before */}
          <div className="hidden lg:grid grid-cols-3 gap-6 max-w-6xl mx-auto w-full relative mb-60">
            {/* Left Column */}
            <div className="flex flex-col gap-6">
              {left.map((t) => (
                <TestimonialCard
                  key={t._id}
                  name={t.name}
                  title={t.about}
                  quote={t.description}
                  avatar={t.image_url}
                />
              ))}
            </div>
            {/* Center Column - Large Card */}
            <div className="justify-center h-100 mt-30">
              {/* Book image for desktop only */}
              <div className="justify-center mb-8 ml-28 hidden lg:block">
                <Image
                  src="/attendeessay/book.png"
                  alt="Stack of books"
                  width={130}
                  height={130}
                  className="object-contain drop-shadow-2xl"
                />
              </div>
              {center && (
                <TestimonialCard
                  key={center._id}
                  name={center.name}
                  title={center.about}
                  quote={center.description}
                  avatar={center.image_url}
                />
              )}
            </div>
            {/* Right Column */}
            <div className="flex flex-col gap-6">
              {right.map((t) => (
                <TestimonialCard
                  key={t._id}
                  name={t.name}
                  title={t.about}
                  quote={t.description}
                  avatar={t.image_url}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Blurred Image */}
      <div className="absolute bottom-0 left-0 w-full h-[120px] md:h-[180px] lg:h-[280px] overflow-hidden">
        <Image
          src="/attendeessay/bottom2.png"
          alt="Blurred forest trees"
          fill
          className="object-cover object-bottom"
        />
      </div>
    </div>
  )
}

type TestimonialCardProps = {
  name: string
  title: string
  quote: string
  avatar: string
  mobilePadding?: boolean
}

function TestimonialCard({ name, title, quote, avatar, mobilePadding }: TestimonialCardProps) {
  return (
    <Card
      className={`rounded-4xl relative h-auto flex flex-col transition-all hover:scale-[1.02] bg-blue-800 text-white border-none font-bilo text-base ${mobilePadding ? 'p-4 sm:p-6' : 'p-6'}`}
    >
      <CardContent className="p-0 flex flex-col h-full font-bilo text-base">
        <div className="flex items-start gap-4 mb-2 font-bilo text-base">
          <Avatar className="w-14 h-14 min-w-[56px] min-h-[56px] border-1 border-white shadow-md">
            <AvatarImage src={avatar || "/placeholder.svg"} alt={`${name}'s avatar`} />
            <AvatarFallback className="font-bold text-blue-900 text-xl font-bilo">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 font-bilo text-base">
            <h3 className="text-xl text-white leading-tight font-bilo">{quote}</h3>
            <p className="text-sm text-white/80 mt-1 font-bilo">( {title} )</p>
            <div className="w-32 border-t border-white/60 my-2" />
          </div>
        </div>
        <div className="relative flex-grow mt-2 font-bilo text-base">
          {/* Opening quote */}
          <Image
            src="/attendeessay/Closing quote.png"
            alt="Opening quote"
            width={20}
            height={20}
            className="absolute left-2 top-1 w-5 h-5 object-contain"
          />
          <p className={`text-base leading-relaxed pl-8 pr-2 pt-1 pb-4 text-left font-bilo`}>
            {name}
          </p>
          {/* Closing quote (inverted) */}
          <Image
            src="/attendeessay/Closing quote.png"
            alt="Closing quote"
            width={20}
            height={20}
            className="absolute right-2 bottom-1 w-5 h-5 object-contain rotate-180"
          />
        </div>
      </CardContent>
    </Card>
  )
}

type LoadingTestimonialCardProps = {
  mobilePadding?: boolean
}

function LoadingTestimonialCard({ mobilePadding }: LoadingTestimonialCardProps) {
  return (
    <Card
      className={`rounded-4xl relative h-auto flex flex-col bg-blue-800 text-white border-none font-bilo text-base animate-pulse ${mobilePadding ? 'p-4 sm:p-6' : 'p-6'}`}
    >
      <CardContent className="p-0 flex flex-col h-full font-bilo text-base">
        <div className="flex items-start gap-4 mb-2 font-bilo text-base">
          {/* Skeleton Avatar */}
          <div className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-full bg-blue-700 animate-pulse" />
          <div className="flex flex-col flex-1 font-bilo text-base">
            {/* Skeleton Quote */}
            <div className="h-6 bg-blue-700 rounded mb-2 animate-pulse w-3/4" />
            <div className="h-4 bg-blue-700 rounded w-2/3 mb-2 animate-pulse" />
            {/* Skeleton Title */}
            <div className="h-4 bg-blue-700 rounded w-1/2 mb-2 animate-pulse" />
            <div className="w-32 h-px bg-blue-700 my-2" />
          </div>
        </div>
        <div className="relative flex-grow mt-2 font-bilo text-base">
          {/* Skeleton Quote Icon */}
          <div className="absolute left-2 top-1 w-5 h-5 bg-yellow-400/80 rounded-full animate-pulse" />
          {/* Skeleton Name */}
          <div className="h-4 bg-blue-700 rounded w-1/3 pl-8 pr-2 pt-1 pb-4 animate-pulse" />
          {/* Skeleton Closing Quote Icon */}
          <div className="absolute right-2 bottom-1 w-5 h-5 bg-yellow-400/80 rounded-full animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}