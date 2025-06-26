import Attendeessay from "@/components/(public)/homecomponents/modules/attendeessay";
import Blogs from "@/components/(public)/homecomponents/modules/blogs";
import Carousel from "@/components/(public)/homecomponents/modules/carousel";
import Contactsection from "@/components/(public)/homecomponents/modules/contact-section";
import GallerySection from "@/components/(public)/homecomponents/modules/gallery-section";
import HeroSection from "@/components/(public)/homecomponents/modules/herosection";
import Schedule from "@/components/(public)/homecomponents/modules/schedule";
import Speakers from "@/components/(public)/homecomponents/modules/speakers";
import Testimonials from "@/components/(public)/homecomponents/modules/testimonials";
import FestivalInfo from "@/components/(public)/homecomponents/modules/welcome-section";


export default function Home() {
  return (
    <div>
      <HeroSection />
      <FestivalInfo />
      <Carousel/>
      <Schedule/>
      <Speakers/>
      <Testimonials/>
      <GallerySection/>
      <Attendeessay/>
      <Blogs/>
      <Contactsection/>
    </div>
  );
} 