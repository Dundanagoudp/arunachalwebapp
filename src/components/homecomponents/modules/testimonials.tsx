import Image from "next/image"

export default function Testimonials() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#fdf8f0] p-4">
      {/* Decorative background patterns */}
      <div className="absolute bottom-2 left-2 w-10 h-10 md:w-16 md:h-16 z-0 opacity-60">
        <Image src="/testimonials/background-pattern.png" alt="Pattern" fill style={{ objectFit: "contain" }} />
      </div>
      <div className="absolute bottom-2 right-2 w-10 h-10 md:w-16 md:h-16 z-0 opacity-60">
        <Image src="/testimonials/background-pattern.png" alt="Pattern" fill style={{ objectFit: "contain" }} />
      </div>
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 z-0 opacity-40">
        <Image src="/testimonials/background-pattern.png" alt="Pattern" fill style={{ objectFit: "contain" }} />
      </div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 z-0 opacity-40">
        <Image src="/testimonials/background-pattern.png" alt="Pattern" fill style={{ objectFit: "contain" }} />
      </div>
      <div className="absolute top-1/4 left-10 w-8 h-8 md:w-12 md:h-12 z-0 opacity-50">
        <Image src="/testimonials/background-pattern.png" alt="Pattern" fill style={{ objectFit: "contain" }} />
      </div>
      <div className="absolute top-1/4 right-10 w-8 h-8 md:w-12 md:h-12 z-0 opacity-50">
        <Image src="/testimonials/background-pattern.png" alt="Pattern" fill style={{ objectFit: "contain" }} />
      </div>
      <div className="absolute bottom-1/4 left-10 w-8 h-8 md:w-12 md:h-12 z-0 opacity-50">
        <Image src="/testimonials/background-pattern.png" alt="Pattern" fill style={{ objectFit: "contain" }} />
      </div>
      <div className="absolute bottom-1/4 right-10 w-8 h-8 md:w-12 md:h-12 z-0 opacity-50">
        <Image src="/testimonials/background-pattern.png" alt="Pattern" fill style={{ objectFit: "contain" }} />
      </div>

      <div className="relative mt-25 z-10 flex w-full max-w-4xl flex-col items-center justify-center p-6">
        {/* Quote container */}
        <div className="relative flex w-full items-center justify-center">
          <Image
            src="/testimonials/Vector3.png"
            alt="Decorative blob shape"
            width={400}
            height={200}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[320px] md:max-w-[400px] lg:max-w-[790px] w-full h-auto opacity-60 object-contain pointer-events-none"
          />
          <div className="relative z-10 flex flex-col items-center justify-center p-25 text-center">
            <span className="absolute -top-8 -left-8 text-8xl font-serif text-[#000000] opacity-70 md:-top-12 md:-left-12 md:text-9xl">
              &ldquo;
            </span>
            <p className="text-2xl italic text-gray-800 md:text-4xl ">{"The poetry of the earth is never dead."}</p>
            <p className="mt-4 text-lg font-medium text-gray-700">-John Keats</p>
            <span className="absolute -bottom-8 -right-8 text-8xl font-serif text-[#000000] opacity-70 md:-bottom-18 md:-right-25 md:text-9xl">
              &rdquo;
            </span>
          </div>
        </div>

        {/* Books and pen image */}
        <div className="mt-25">
          <Image
            src="/testimonials/book.png"
            alt="Stack of books and a pen"
            width={200}
            height={150}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}