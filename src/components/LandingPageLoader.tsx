
"use client";

import Image from "next/image";

export default function LandingPageLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      <div className="relative w-24 h-24">
        <Image
          src="/icons/icon-192x192.png"
          alt="SayWith Logo"
          width={96}
          height={96}
          className="animate-pulse"
        />
      </div>
      <p className="mt-6 text-lg text-primary animate-pulse">
        Say it with style...
      </p>
    </div>
  );
}

    