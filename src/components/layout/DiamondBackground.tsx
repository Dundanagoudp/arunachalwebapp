import Image from "next/image"

export default function DiamondBackground() {
  return (
    <>
      <Image
        src="/dimond-white.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-4 left-4 opacity-50 hidden sm:block pointer-events-none select-none"
      />
      <Image
        src="/dimond-white.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-4 right-4 opacity-50 hidden sm:block pointer-events-none select-none"
      />
      <Image
        src="/dimond-white.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute bottom-4 left-4 opacity-50 hidden sm:block pointer-events-none select-none"
      />
      <Image
        src="/dimond-white.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute bottom-4 right-4 opacity-50 hidden sm:block pointer-events-none select-none"
      />
      <Image
        src="/dimond-white.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-1/2 left-4 -translate-y-1/2 opacity-50 hidden md:block pointer-events-none select-none"
      />
      <Image
        src="/dimond-white.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-1/2 right-4 -translate-y-1/2 opacity-50 hidden md:block pointer-events-none select-none"
      />
      <Image
        src="/dimond-white.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-1/4 left-[10%] opacity-50 hidden lg:block pointer-events-none select-none"
      />
      <Image
        src="/dimond-white.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-1/4 right-[10%] opacity-50 hidden lg:block pointer-events-none select-none"
      />
      <Image
        src="/dimond-white.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute bottom-1/4 left-[10%] opacity-50 hidden lg:block pointer-events-none select-none"
      />
      <Image
        src="/dimond-white.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute bottom-1/4 right-[10%] opacity-50 hidden lg:block pointer-events-none select-none"
      />
      {/* Center cluster diamonds */}
      <Image
        src="/dimond-white.png"
        alt="Decorative diamond pattern center top-left"
        width={100}
        height={100}
        className="absolute left-1/2 top-1/2 -translate-x-[70%] -translate-y-[70%] opacity-50 pointer-events-none select-none z-10"
      />

      <Image
        src="/dimond-white.png"
        alt="Decorative diamond pattern center bottom-right"
        width={100}
        height={100}
        className="absolute left-1/2 top-1/2 translate-x-[30%] translate-y-[30%] opacity-50 pointer-events-none select-none z-10"
      />
    </>
  )
} 