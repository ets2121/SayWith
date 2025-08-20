"use client";

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-black">
      <img 
        src="/icons/ld-b.gif" 
        alt="Loading..." 
        className="max-w-[80%] max-h-[80%] object-contain"
      />
    </div>
  );
};
