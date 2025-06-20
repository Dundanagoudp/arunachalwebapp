"use client"
import Image from "next/image"
import Link from "next/link" // Import Link
import { ArrowRight, ArrowUpRight } from "lucide-react" // Change to ArrowRight
import { BlogCardSkeleton } from "@/components/blog-card-skeleton" // Import the new skeleton component

export default function Blogs() {
  const isLoading = false // For demonstration, set to false. In a real app, this would come from data fetching.

  return (
    <div className="min-h-screen bg-[#FDF6E9] p-8 relative overflow-hidden">
      {/* Decorative Sun Icons */}
      <div className="absolute top-10 left-10 z-0">
        <Image src="/blogs/sun.gif" alt="Decorative sun" width={50} height={50} />
      </div>
      <div className="absolute top-10 right-10 z-0">
        <Image src="/blogs/sun.gif" alt="Decorative sun" width={50} height={50} />
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 left-0 -ml-4 z-0">
        {" "}
        {/* New sun icon */}
        <Image src="/blogs/sun.gif" alt="Decorative sun" width={50} height={50} />
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-0 -mr-4 z-0">
        {" "}
        {/* New sun icon */}
        <Image src="/blogs/sun.gif" alt="Decorative sun" width={50} height={50} />
      </div>

      {/* Header */}
      <div className="text-center mt-16 mb-12 relative z-10">
        <h1 className="text-[#4F8049] text-3xl font-medium mb-2">ARUNACHAL LITERATURE FESTIVAL</h1>
        <div className="flex justify-center items-center gap-4">
          <div className="w-4 h-4 rounded-full bg-[#4F8049]"></div> {/* Increased size */}
          <h2 className="text-[#4F8049] text-4xl font-bold">BLOGS AND MEDIA</h2>
          <div className="w-4 h-4 rounded-full bg-[#4F8049]"></div> {/* Increased size */}
        </div>
      </div>

      {/* View All Button */}
      <div className="mt-0 flex justify-center mb-12 relative z-10">
           <button className="group relative flex items-center hover:scale-105 transition-transform duration-300 focus:outline-none">
              <span className="bg-[#4F8049] text-white px-6 py-3 pr-12 rounded-full text-lg font-medium">
                View All
              </span>
              <span className="absolute right-0 left-30 translate-x-1/2 bg-[#4F8049] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:translate-x-6 group-hover:rotate-12">
                <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-45" />
              </span>
            </button>
      </div>

      {/* Blog Cards or Skeletons */}
      <div
        className="grid gap-6 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      >
        {isLoading ? (
          <>
            <BlogCardSkeleton />
            <BlogCardSkeleton />
            <BlogCardSkeleton />
          </>
        ) : (
          <>
            {/* Card 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md group">
              {" "}
              {/* Changed to rounded-xl, added group */}
              <div className="p-4">
                <div className="relative h-56 w-full">
                  <Image
                    src="/blogs/blog1.png"
                    alt="Arunachal Literature Festival 2022"
                    fill
                    className="object-cover rounded-t-xl" // Changed to rounded-t-xl
                  />
                </div>
                <h3 className="text-xl font-bold mt-4 mb-2">The Rise of Indigenous Literature in Arunachal Pradesh</h3>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-gray-500">30 October 2023</p>
                  <Link href="#" className="text-[#4F8049] font-medium hover:underline group-hover:text-[#3A6035]">
                    Read More
                  </Link>{" "}
                  {/* Changed to Link, added hover */}
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md group">
              {" "}
              {/* Changed to rounded-xl, added group */}
              <div className="p-4">
                <div className="relative h-56 w-full">
                  <Image
                    src="/blogs/blog2.png"
                    alt="Literary Icons"
                    fill
                    className="object-cover rounded-t-xl" // Changed to rounded-t-xl
                  />
                </div>
                <h3 className="text-xl font-bold mt-4 mb-2">Meet the Literary Icons Gracing This Year's Festival</h3>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-gray-500">30 October 2023</p>
                  <Link href="#" className="text-[#4F8049] font-medium hover:underline group-hover:text-[#3A6035]">
                    Read More
                  </Link>{" "}
                  {/* Changed to Link, added hover */}
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md group">
              {" "}
              {/* Changed to rounded-xl, added group */}
              <div className="p-4">
                <div className="relative h-56 w-full">
                  <Image
                    src="/blogs/blog3.png"
                    alt="Arunachal Literature Festival 2019"
                    fill
                    className="object-cover rounded-t-xl" // Changed to rounded-t-xl
                  />
                </div>
                <h3 className="text-xl font-bold mt-4 mb-2">5 Must-Attend Sessions at This Year's Festival</h3>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-gray-500">30 October 2023</p>
                  <Link href="#" className="text-[#4F8049] font-medium hover:underline group-hover:text-[#3A6035]">
                    Read More
                  </Link>{" "}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* More Decorative Sun Icons */}
      <div className="relative mt-16">
        <div className="absolute bottom-10 left-10 z-0">
          <Image src="/blogs/sun.gif" alt="Decorative sun" width={50} height={50} />
        </div>
        <div className="absolute bottom-10 right-10 z-0">
          <Image src="/blogs/sun.gif" alt="Decorative sun" width={50} height={50} />
        </div>
        <div className="flex justify-center pt-10 relative z-10">
          {" "}
          {/* Added pt-10 for spacing */}
          <Image src="/blogs/sun.gif" alt="Decorative sun" width={40} height={40} />
        </div>
      </div>
    </div>
  )
}
