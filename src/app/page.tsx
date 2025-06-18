import Carousel from "@/components/homecomponents/modules/carousel"
import HeroSection from "@/components/homecomponents/modules/herosection"
import FestivalInfo from "@/components/homecomponents/modules/welcome-section"

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FestivalInfo />
      <Carousel/>
    </div>
  )
}
