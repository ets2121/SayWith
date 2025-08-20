"use client";

import { useEffect, useState } from "react";

export const LoadingSpinner = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simulate loading done after 2s (replace with real API logic)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black transition-opacity duration-700 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <img
        src="/icons/ld-w.gif"
        alt="Loading..."
        className="max-w-[80%] max-h-[80%] object-contain"
      />
    </div>
  );
};
