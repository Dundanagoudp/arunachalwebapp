import Image from "next/image"

export default function DiamondBackground() {
  return (
    <>
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-4 left-4 opacity-50 hidden sm:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-4 right-4 opacity-50 hidden sm:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute bottom-4 left-4 opacity-50 hidden sm:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute bottom-4 right-4 opacity-50 hidden sm:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-1/2 left-4 -translate-y-1/2 opacity-50 hidden md:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-1/2 right-4 -translate-y-1/2 opacity-50 hidden md:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-1/4 left-[10%] opacity-50 hidden lg:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-1/4 right-[10%] opacity-50 hidden lg:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute bottom-1/4 left-[10%] opacity-50 hidden lg:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute bottom-1/4 right-[10%] opacity-50 hidden lg:block"
      />
    </>
  )
} 