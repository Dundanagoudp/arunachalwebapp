"use client";

import Image from "next/image";

export default function DiamondPatternBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top left diamonds */}
      <div className="absolute top-8 left-8 w-8 h-8 opacity-30">
        <Image src="/gallery/diamond-pattern.png" alt="" width={32} height={32} className="w-full h-full" />
      </div>
      <div className="absolute top-20 left-20 w-6 h-6 opacity-20">
        <Image src="/gallery/diamond-pattern.png" alt="" width={24} height={24} className="w-full h-full" />
      </div>

      {/* Top right diamonds */}
      <div className="absolute top-12 right-12 w-10 h-10 opacity-25">
        <Image src="/gallery/diamond-pattern.png" alt="" width={40} height={40} className="w-full h-full" />
      </div>
      <div className="absolute top-32 right-8 w-7 h-7 opacity-30">
        <Image src="/gallery/diamond-pattern.png" alt="" width={28} height={28} className="w-full h-full" />
      </div>

      {/* Middle left diamonds */}
      <div className="absolute top-1/2 left-4 w-9 h-9 opacity-20 -translate-y-1/2">
        <Image src="/gallery/diamond-pattern.png" alt="" width={36} height={36} className="w-full h-full" />
      </div>
      <div className="absolute top-1/2 left-16 w-5 h-5 opacity-25 translate-y-8">
        <Image src="/gallery/diamond-pattern.png" alt="" width={20} height={20} className="w-full h-full" />
      </div>

      {/* Middle right diamonds */}
      <div className="absolute top-1/2 right-6 w-8 h-8 opacity-30 -translate-y-8">
        <Image src="/gallery/diamond-pattern.png" alt="" width={32} height={32} className="w-full h-full" />
      </div>
      <div className="absolute top-1/2 right-20 w-6 h-6 opacity-20 translate-y-12">
        <Image src="/gallery/diamond-pattern.png" alt="" width={24} height={24} className="w-full h-full" />
      </div>

      {/* Bottom diamonds */}
      <div className="absolute bottom-16 left-12 w-7 h-7 opacity-25">
        <Image src="/gallery/diamond-pattern.png" alt="" width={28} height={28} className="w-full h-full" />
      </div>
      <div className="absolute bottom-8 right-16 w-9 h-9 opacity-20">
        <Image src="/gallery/diamond-pattern.png" alt="" width={36} height={36} className="w-full h-full" />
      </div>
      <div className="absolute bottom-24 right-4 w-5 h-5 opacity-30">
        <Image src="/gallery/diamond-pattern.png" alt="" width={20} height={20} className="w-full h-full" />
      </div>

      {/* Additional scattered diamonds for mobile */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 opacity-15 md:hidden">
        <Image src="/gallery/diamond-pattern.png" alt="" width={16} height={16} className="w-full h-full" />
      </div>
      <div className="absolute bottom-1/3 right-1/3 w-6 h-6 opacity-20 md:hidden">
        <Image src="/gallery/diamond-pattern.png" alt="" width={24} height={24} className="w-full h-full" />
      </div>
    </div>
  );
} 