"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"
import Image from "next/image"

interface Testimonial {
  name: string
  title: string
  quote: string
  avatar: string
  isLarge?: boolean
}

const testimonials: Testimonial[] = [
  {
    name: "Kiran Nagarkar",
    title: "Acclaimed Novelist & Playwright",
    quote: "The Arunachal Literature Festival is a wonderful platform that bridges cultures through literature. It's heartening to see such vibrant literary exchanges in this beautiful region.",
    avatar: "/placeholder.svg?height=40&width=40",
    isLarge: false,
  },
  
  {
    name: "Damodar Mauzo",
    title: "Jnanpith Award Recipient 2022",
    quote: "The Arunachal Literature Festival which I attended was an unforgettable experience. It provided a platform where I could intermingle with brilliant writers from the host state. I was deeply impressed by the intimate ambiance, focused deliberations, and the warmth of the organizers.",
    avatar: "/placeholder.svg?height=40&width=40",
    isLarge: true,
  },
  {
    name: "Githa Hariharan",
    title: "Renowned Author & Activist",
    quote: "Our audience will continue to explore opportunities to bridge traditional culture and modern civilization, with themes that are now being recognized globally.",
    avatar: "/placeholder.svg?height=40&width=40",
    isLarge: false,
  },
  {
    name: "Anita Desai",
    title: "Renowned Author & Literary Figure",
    quote: "The festival offers a unique perspective on literature from the Northeast, showcasing voices that deserve wider recognition in the national literary scene.",
    avatar: "/placeholder.svg?height=40&width=40",
    isLarge: false,
  },
]

export default function Attendeessay() {
  return (
    <div 
      className="relative min-h-screen overflow-hidden bg-blue-900 text-white pb-12"
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

      <div className="relative z-10 pt-[200px] md:pt-[300px] lg:pt-[400px] pb-10 md:pb-20 lg:pb-24 flex flex-col items-center px-4">
        {/* Header Text */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <h2 
              className="text-2xl md:text-3xl font-extrabold tracking-wider uppercase text-yellow-400 drop-shadow-lg"
            >
              Arunachal Literature Festival
            </h2>
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
          </div>
          <h1 
            className="text-4xl md:text-6xl font-extrabold mb-8 text-yellow-400 drop-shadow-lg"
          >
            WHAT OUR ATTENDEES SAY
          </h1>
          <div className="flex justify-center mb-8">
            <Image
              src="/attendeessay/book.png"
              alt="Stack of books"
              width={130}
              height={130}
              className="object-contain drop-shadow-2xl"
            />
          </div>
          <div className="w-24 h-1 mx-auto bg-yellow-400"></div>
        </div>

        {/* Testimonial Cards Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full relative mb-60">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            <TestimonialCard {...testimonials[0]} />
            <TestimonialCard {...testimonials[3]} />
          </div>
          
          {/* Center Column - Large Card */}
          <div className="flex justify-center">
            <TestimonialCard {...testimonials[1]} isLarge={true} />
          </div>
          
          {/* Right Column */}
          <div className="flex flex-col gap-6">
            <TestimonialCard {...testimonials[2]} />
            <TestimonialCard {...testimonials[0]} />
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

function TestimonialCard({ name, title, quote, avatar, isLarge }: Testimonial) {
  return (
    <Card
      className={`rounded-4xl p-6 relative ${
        isLarge ? "lg:p-8 h-full" : "h-auto"
      } flex flex-col transition-all hover:scale-[1.02] bg-blue-800 text-white border-none`}
    >
      <CardContent className="p-0 flex flex-col h-full">
        <div className="flex items-start gap-4 mb-2">
          <Avatar className="w-14 h-14 min-w-[56px] min-h-[56px] border-4 border-white shadow-md">
            <AvatarImage src={avatar || "/placeholder.svg"} alt={`${name}'s avatar`} />
            <AvatarFallback className="font-bold text-blue-900 text-xl">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1">
            <h3 className="font-bold text-xl text-white leading-tight">{name}</h3>
            <p className="text-sm text-white/80 mt-1">( {title} )</p>
            <div className="w-32 border-t border-white/60 my-2" />
          </div>
        </div>
        <div className="relative flex-grow mt-2">
          {/* Opening quote */}
          <svg className="absolute left-2 top-1 w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M7.17 17.66c-1.1 0-2-.9-2-2v-3.34c0-2.21 1.79-4 4-4h.5c.28 0 .5.22.5.5v1c0 .28-.22.5-.5.5h-.5c-1.1 0-2 .9-2 2v3.34c0 .28-.22.5-.5.5s-.5-.22-.5-.5zm8 0c-1.1 0-2-.9-2-2v-3.34c0-2.21 1.79-4 4-4h.5c.28 0 .5.22.5.5v1c0 .28-.22.5-.5.5h-.5c-1.1 0-2 .9-2 2v3.34c0 .28-.22.5-.5.5s-.5-.22-.5-.5z"/></svg>
          <p className={`text-base leading-relaxed pl-6 pr-4 pt-1 pb-3 text-left ${isLarge ? 'text-lg' : ''}`}>
            {quote}
          </p>
          {/* Closing quote (inverted) */}
          <svg className="absolute -right-2 bottom-1 w-5 h-5 text-yellow-400 rotate-180" fill="currentColor" viewBox="0 0 24 24"><path d="M7.17 17.66c-1.1 0-2-.9-2-2v-3.34c0-2.21 1.79-4 4-4h.5c.28 0 .5.22.5.5v1c0 .28-.22.5-.5.5h-.5c-1.1 0-2 .9-2 2v3.34c0 .28-.22.5-.5.5s-.5-.22-.5-.5zm8 0c-1.1 0-2-.9-2-2v-3.34c0-2.21 1.79-4 4-4h.5c.28 0 .5.22.5.5v1c0 .28-.22.5-.5.5h-.5c-1.1 0-2 .9-2 2v3.34c0 .28-.22.5-.5.5s-.5-.22-.5-.5z"/></svg>
        </div>
      </CardContent>
    </Card>
  )
}