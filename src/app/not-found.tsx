"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false)
  const [dots, setDots] = useState<any[]>([])

  useEffect(() => {
    setIsVisible(true)
    // Generate random dot styles only on client
    setDots(
      Array.from({ length: 8 }).map((_, i) => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${i * 0.5}s`,
        animationDuration: `${3 + Math.random() * 2}s`,
      }))
    )
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative">
        {/* Floating dots animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {dots.map((style, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-float"
              style={style}
            />
          ))}
        </div>

        {/* Main 404 Display */}
        <div
          className={`relative transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="flex items-center justify-center relative">
            {/* First 4 */}
            <div className="relative">
              <span className="text-8xl md:text-9xl lg:text-[12rem] font-bold text-yellow-400 drop-shadow-lg animate-bounce-slow">
                4
              </span>
              {/* Detective character */}
              <div className="absolute -bottom-4 -right-2 animate-detective">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-800 rounded-full relative">
                  <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full"></div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full"></div>
                  <div className="absolute -top-2 -right-1 w-6 h-6 md:w-8 md:h-8 bg-yellow-600 rounded-full border-2 border-gray-800 flex items-center justify-center">
                    <Search className="w-3 h-3 md:w-4 md:h-4 text-gray-800" />
                  </div>
                </div>
              </div>
            </div>

            {/* 0 */}
            <div className="relative mx-4 md:mx-8">
              <span className="text-8xl md:text-9xl lg:text-[12rem] font-bold text-blue-500 drop-shadow-lg animate-pulse-slow">
                0
              </span>
              {/* Magnifying glass effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-blue-300 rounded-full animate-spin-slow opacity-50"></div>
              </div>
            </div>

            {/* Second 4 */}
            <div className="relative">
              <span
                className="text-8xl md:text-9xl lg:text-[12rem] font-bold text-yellow-400 drop-shadow-lg animate-bounce-slow"
                style={{ animationDelay: "0.5s" }}
              >
                4
              </span>
              {/* Helper character */}
              <div className="absolute -bottom-4 -left-2 animate-helper">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-400 rounded-full relative">
                  <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-black rounded-full"></div>
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full"></div>
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-black rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mt-8 space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Oops! Page Not Found
            </h1>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes detective {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-5px) rotate(-5deg); }
          75% { transform: translateX(5px) rotate(5deg); }
        }
        
        @keyframes helper {
          0%, 100% { transform: translateX(0) scale(1); }
          50% { transform: translateX(-3px) scale(1.1); }
        }
        
        .animate-float {
          animation: float infinite ease-in-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite ease-in-out;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s infinite ease-in-out;
        }
        
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        
        .animate-detective {
          animation: detective 3s infinite ease-in-out;
        }
        
        .animate-helper {
          animation: helper 2.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
} 