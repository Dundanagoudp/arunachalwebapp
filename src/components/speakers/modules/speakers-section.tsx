import Image from "next/image"

interface Speaker {
  name: string
  about: string
  image: string
}

const speakers: Speaker[] = [
  {
    name: "Speaker Name 1",
    about: "About",
    image: "/images/speaker-1.png",
  },
  {
    name: "Speaker Name 2",
    about: "About",
    image: "/images/speaker-2.png",
  },
  {
    name: "Speaker Name 3",
    about: "About",
    image: "/images/speaker-3.png",
  },
  {
    name: "Speaker Name 4",
    about: "About",
    image: "/images/speaker-1.png",
  },
  {
    name: "Speaker Name 5",
    about: "About",
    image: "/images/speaker-2.png",
  },
  {
    name: "Speaker Name 6",
    about: "About",
    image: "/images/speaker-3.png",
  },
  {
    name: "Speaker Name 7",
    about: "About",
    image: "/images/speaker-1.png",
  },
  {
    name: "Speaker Name 8",
    about: "About",
    image: "/images/speaker-2.png",
  },
  {
    name: "Speaker Name 9",
    about: "About",
    image: "/images/speaker-3.png",
  },
]

export default function SpeakersGrid() {
  return (
    <section className="py-12 md:py-20 bg-[#fdf8f0]">
      {" "}
      {/* Cream background */}
      <div className="container mx-auto px-4">
        <h2 className="text-center text-4xl font-bold text-[#3a3a6a] mb-12 uppercase tracking-wider">Speakers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {speakers.map((speaker, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="relative w-40 h-40 mb-4">
                {/* Outer border layer using the SVG frame as background */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: "url('/images/ornate-frame.png')",
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundColor: "#f0c040", // Outer border color
                  }}
                />
                {/* Inner border layer, slightly smaller and on top */}
                <div
                  className="absolute inset-[3px]" // Adjust padding for outer border thickness
                  style={{
                    backgroundImage: "url('/images/ornate-frame.png')",
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundColor: "#e0a020", // Inner border color
                  }}
                />
                {/* Image container with mask, slightly smaller for inner border thickness */}
                <div
                  className="absolute inset-[6px] overflow-hidden" // Adjust padding for inner border thickness
                  style={{
                    maskImage: "url('/images/ornate-frame.png')",
                    WebkitMaskImage: "url('/images/ornate-frame.png')", // For Webkit browsers
                    maskSize: "100% 100%",
                    WebkitMaskSize: "100% 100%",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                  }}
                >
                  <Image
                    src={speaker.image || "/placeholder.svg"}
                    alt={speaker.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{speaker.name}</h3>
              <p className="text-sm text-gray-600">{speaker.about}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
