import Carousel from "@/components/homecomponents/modules/carousel"
import HeroSection from "@/components/homecomponents/modules/herosection"
import Schedule from "@/components/homecomponents/modules/schedule"
import Speakers from "@/components/homecomponents/modules/speakers"
import FestivalInfo from "@/components/homecomponents/modules/welcome-section"

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FestivalInfo />
      <Carousel/>
      <Schedule/>
      <Speakers/>
    </div>
  )
}
