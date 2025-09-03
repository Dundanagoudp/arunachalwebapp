import Image from "next/image"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect, useState } from 'react'
import { getIntro } from '@/service/homeService'

export default function FestivalInfo() {
  const [welcomeData, setWelcomeData] = useState<{
    title: string
    description: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false)
  const [apiError, setApiError] = useState(false)

  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: 'ease-in-out',
      once: true,
    })
  }, [])

  useEffect(() => {
    const fetchWelcomeContent = async () => {
      try {
        setLoading(true)
        setNoData(false)
        setApiError(false)
        const response = await getIntro()
        if (response.success && response.data && response.data.length > 0) {
          // Use the first intro item for welcome content
          const firstIntro = response.data[0]
          setWelcomeData({
            title: firstIntro.title,
            description: firstIntro.description
          })
        } else {
          setNoData(true)
        }
      } catch (error) {
        console.error('Failed to fetch welcome content:', error)
        setApiError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchWelcomeContent()
  }, [])

  if (loading) {
    return (
      <div className="relative bg-[#fdf8f0] flex items-center justify-center py-8 sm:py-12 lg:py-8 lg:min-h-150 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto text-center lg:text-left">
          <div className="animate-pulse">
            <div className="h-8 sm:h-10 md:h-8 bg-gray-300 rounded mb-6 md:mb-5 max-w-2xl mx-auto"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded max-w-7xl mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded max-w-6xl mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded max-w-5xl mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded max-w-4xl mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Bamboo Image - Top Left (Hidden on mobile/tablet, visible on large screens) */}
        <div data-aos="fade-right" data-aos-delay="600" data-aos-duration="1200" data-aos-easing="ease-in-out" className="absolute top-0 left-0 p-4 sm:p-8 lg:p-12 hidden lg:block">
          <Image
            src="/welcome/image1.png"
            alt="Bamboo illustration"
            width={160}
            height={160}
            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-contain"
            priority
          />
        </div>

        {/* Hornbill Image - Bottom Left (Hidden on mobile/tablet, visible on large screens) */}
        <div data-aos="fade-up" data-aos-delay="900" data-aos-duration="1200" data-aos-easing="ease-in-out" className="absolute bottom-0 left-0 p-4 sm:p-8 lg:p-12 hidden lg:block">
          <Image
            src="/welcome/image2.png"
            alt="Hornbill illustration"
            width={160}
            height={160}
            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-contain"
            priority
          />
        </div>

        {/* Bull Image - Middle Right (Hidden on mobile/tablet, visible on large screens) */}
        <div data-aos="fade-left" data-aos-delay="1200" data-aos-duration="1200" data-aos-easing="ease-in-out" className="absolute top-1/2 right-0 -translate-y-1/2 p-4 sm:p-8 lg:p-12 hidden lg:block">
          <Image
            src="/welcome/image3.png"
            alt="Bull illustration"
            width={160}
            height={160}
            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-60 lg:h-[180px] object-contain"
            priority
          />
        </div>
      </div>
    )
  }

  if (apiError) {
    return (
      <div className="relative bg-[#fdf8f0] flex items-center justify-center py-8 sm:py-12 lg:py-8 lg:min-h-150 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-600">API Call Failed</h3>
            <p className="text-sm text-gray-500">Unable to load welcome content. Please try again later.</p>
          </div>
        </div>

        {/* Bamboo Image - Top Left (Hidden on mobile/tablet, visible on large screens) */}
        <div data-aos="fade-right" data-aos-delay="600" data-aos-duration="1200" data-aos-easing="ease-in-out" className="absolute top-0 left-0 p-4 sm:p-8 lg:p-12 hidden lg:block">
          <Image
            src="/welcome/image1.png"
            alt="Bamboo illustration"
            width={160}
            height={160}
            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-contain"
            priority
          />
        </div>

        {/* Hornbill Image - Bottom Left (Hidden on mobile/tablet, visible on large screens) */}
        <div data-aos="fade-up" data-aos-delay="900" data-aos-duration="1200" data-aos-easing="ease-in-out" className="absolute bottom-0 left-0 p-4 sm:p-8 lg:p-12 hidden lg:block">
          <Image
            src="/welcome/image2.png"
            alt="Hornbill illustration"
            width={160}
            height={160}
            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-contain"
            priority
          />
        </div>

        {/* Bull Image - Middle Right (Hidden on mobile/tablet, visible on large screens) */}
        <div data-aos="fade-left" data-aos-delay="1200" data-aos-duration="1200" data-aos-easing="ease-in-out" className="absolute top-1/2 right-0 -translate-y-1/2 p-4 sm:p-8 lg:p-12 hidden lg:block">
          <Image
            src="/welcome/image3.png"
            alt="Bull illustration"
            width={160}
            height={160}
            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-60 lg:h-[180px] object-contain"
            priority
          />
        </div>
      </div>
    )
  }

  if (noData) {
    return (
      <div className="relative bg-[#fdf8f0] flex items-center justify-center py-8 sm:py-12 lg:py-8 lg:min-h-150 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-600">No Data Found</h3>
            <p className="text-sm text-gray-500">Welcome content is not available at the moment.</p>
          </div>
        </div>

        {/* Bamboo Image - Top Left (Hidden on mobile/tablet, visible on large screens) */}
        <div data-aos="fade-right" data-aos-delay="600" data-aos-duration="1200" data-aos-easing="ease-in-out" className="absolute top-0 left-0 p-4 sm:p-8 lg:p-12 hidden lg:block">
          <Image
            src="/welcome/image1.png"
            alt="Bamboo illustration"
            width={160}
            height={160}
            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-contain"
            priority
          />
        </div>

        {/* Hornbill Image - Bottom Left (Hidden on mobile/tablet, visible on large screens) */}
        <div data-aos="fade-up" data-aos-delay="900" data-aos-duration="1200" data-aos-easing="ease-in-out" className="absolute bottom-0 left-0 p-4 sm:p-8 lg:p-12 hidden lg:block">
          <Image
            src="/welcome/image2.png"
            alt="Hornbill illustration"
            width={160}
            height={160}
            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-contain"
            priority
          />
        </div>

        {/* Bull Image - Middle Right (Hidden on mobile/tablet, visible on large screens) */}
        <div data-aos="fade-left" data-aos-delay="1200" data-aos-duration="1200" data-aos-easing="ease-in-out" className="absolute top-1/2 right-0 -translate-y-1/2 p-4 sm:p-8 lg:p-12 hidden lg:block">
          <Image
            src="/welcome/image3.png"
            alt="Bull illustration"
            width={160}
            height={160}
            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-60 lg:h-[180px] object-contain"
            priority
          />
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-[#fdf8f0] flex items-center justify-center py-8 sm:py-12 lg:py-8 lg:min-h-150 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto text-center lg:text-left">
        <h1 data-aos="fade-up" data-aos-delay="0" data-aos-duration="1200" data-aos-easing="ease-in-out" className="text-3xl sm:text-4xl md:text-3xl font-bold text-[#1A3FA9] mb-6 md:mb-5 tracking-wider leading-tight font-dm-serif text-center">
          {welcomeData?.title}
        </h1>
        <p data-aos="fade-up" data-aos-delay="300" data-aos-duration="1200" data-aos-easing="ease-in-out" className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-7xl mx-auto text-center font-bilo tracking-wide">
          {welcomeData?.description}
        </p>
      </div>

      {/* Bamboo Image - Top Left (Hidden on mobile/tablet, visible on large screens) */}
      <div data-aos="fade-right" data-aos-delay="600" data-aos-duration="1200" data-aos-easing="ease-in-out" className="absolute top-0 left-0 p-4 sm:p-8 lg:p-12 hidden lg:block">
        <Image
          src="/welcome/image1.png"
          alt="Bamboo illustration"
          width={160}
          height={160}
          className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-contain"
          priority
        />
      </div>

      {/* Hornbill Image - Bottom Left (Hidden on mobile/tablet, visible on large screens) */}
      <div data-aos="fade-up" data-aos-delay="900" data-aos-duration="1200" data-aos-easing="ease-in-out" className="absolute bottom-0 left-0 p-4 sm:p-8 lg:p-12 hidden lg:block">
        <Image
          src="/welcome/image2.png"
          alt="Hornbill illustration"
          width={160}
          height={160}
          className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-contain"
          priority
        />
      </div>

      {/* Bull Image - Middle Right (Hidden on mobile/tablet, visible on large screens) */}
      <div data-aos="fade-left" data-aos-delay="1200" data-aos-duration="1200" data-aos-easing="ease-in-out" className="absolute top-1/2 right-0 -translate-y-1/2 p-4 sm:p-8 lg:p-12 hidden lg:block">
        <Image
          src="/welcome/image3.png"
          alt="Bull illustration"
          width={160}
          height={160}
          className="w-24 h-24 sm:w-32 sm:h-32 lg:w-60 lg:h-[180px] object-contain"
          priority
        />
      </div>
    </div>
  )
}
