import Image from "next/image"

export default function DiamondBackground({ size = 100, className = "", mobileCount }: { size?: number, className?: string, mobileCount?: number } = {}) {
  // Mobile diamond positions (up to 4)
  const mobileDiamonds = [
    { className: "block sm:hidden absolute top-2 left-2 opacity-40", key: "tl" },
    { className: "block sm:hidden absolute top-2 right-2 opacity-40", key: "tr" },
    { className: "block sm:hidden absolute bottom-2 left-1/2 -translate-x-1/2 opacity-40", key: "bc" },
    { className: "block sm:hidden absolute bottom-2 right-2 opacity-40", key: "br" },
  ];
  return (
    <div className={className}>
      {/* Mobile: show only a few diamonds if mobileCount is set */}
      {mobileCount && mobileCount > 0 && mobileCount <= 4 &&
        mobileDiamonds.slice(0, mobileCount).map((pos) => (
          <Image
            key={pos.key}
            src="/gallery/diamond-pattern.png"
            alt="Decorative diamond pattern"
            width={40}
            height={40}
            className={pos.className}
          />
        ))
      }
      {/* Desktop/tablet: show all as before */}
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={size}
        height={size}
        className="absolute top-4 left-4 opacity-50 hidden sm:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={size}
        height={size}
        className="absolute top-4 right-4 opacity-50 hidden sm:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={size}
        height={size}
        className="absolute bottom-4 left-4 opacity-50 hidden sm:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={size}
        height={size}
        className="absolute bottom-4 right-4 opacity-50 hidden sm:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={size}
        height={size}
        className="absolute top-1/2 left-4 -translate-y-1/2 opacity-50 hidden md:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={size}
        height={size}
        className="absolute top-1/2 right-4 -translate-y-1/2 opacity-50 hidden md:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={size}
        height={size}
        className="absolute top-1/4 left-[10%] opacity-50 hidden lg:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={size}
        height={size}
        className="absolute top-1/4 right-[10%] opacity-50 hidden lg:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={size}
        height={size}
        className="absolute bottom-1/4 left-[10%] opacity-50 hidden lg:block"
      />
      <Image
        src="/gallery/diamond-pattern.png"
        alt="Decorative diamond pattern"
        width={size}
        height={size}
        className="absolute bottom-1/4 right-[10%] opacity-50 hidden lg:block"
      />
    </div>
  )
} 