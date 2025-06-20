"use client"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import SunIcon from "./sun-icon"

export default function Archive() {
  const router = useRouter()

  // Function to handle redirection when clicking on a year card
  const handleYearClick = (year: number) => {
    router.push(`/archive/${year}`)
  }

  return (
    <div className="min-h-screen bg-[#FFFAEE]">
      <header className="flex justify-center pt-8 pb-4 relative">
        <SunIcon size={32} className="absolute top-4 right-4" />
        <h1 className="text-4xl font-bold text-blue-700 tracking-wider">ARCHIVE</h1>
      </header>

      <main className="container mx-auto px-4 py-8 lg:-w-64 lg:px-18">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <SunIcon size={38} className="absolute top-58 left-5 " />
          {[2024, 2023, 2022, 2021].map((year) => (
            <motion.div
              key={year}
              className="border-2 border-orange-400 rounded-xl p-4 relative overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => handleYearClick(year)}
              tabIndex={0}
              role="button"
              aria-label={`View gallery for year ${year}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleYearClick(year)
                }
              }}
            >
              {/* <SunIcon size={24} className="absolute top-2 left-0 " /> */}

              <div className="grid grid-cols-2 gap-2 mb-4">
                
                <div className="aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src="/gallery/gallery1.png"
                    alt={`Gallery preview image 1 for year ${year}`}
                    width={200}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src="/gallery/gallery2.png"
                    alt={`Gallery preview image 2 for year ${year}`}
                    width={200}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src="/gallery/gallery3.png"
                    alt={`Gallery preview image 3 for year ${year}`}
                    width={200}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src="/gallery/gallery4.png"
                    alt={`Gallery preview image 4 for year ${year}`}
                    width={200}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
                   {/* <SunIcon size={24} className="absolute top-2 left-0 " /> */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-amber-800">{year}</h2>
                <div className="flex items-center text-sm font-medium text-gray-700">
                  View All <ArrowRight size={16} className="ml-1" />
                </div>
              </div>
            </motion.div>
          ))}
                        <SunIcon size={35} className="absolute top-190 left-0 " />

        </div>
      </main>
    </div>
  )
}
