
"use client";

import { useEffect, useState } from 'react';

const loadingTexts = [
    "Wait lang boss...",
    "Making it awesome...",
    "Konti na lang, pramis!",
    "Almost there, beshie...",
    "Sandali lang, processing na..."
];

export const LoadingSpinner = () => {
    const [textIndex, setTextIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const textInterval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
                setFade(true);
            }, 500);
        }, 2500);
        return () => clearInterval(textInterval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground overflow-hidden">
             <style jsx>{`
                @keyframes spin-outer {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes spin-inner {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                 @keyframes pulse-core {
                    0%, 100% { 
                        transform: scale(0.9);
                        box-shadow: 0 0 0 0 hsla(var(--primary), 0.7);
                    }
                    50% { 
                        transform: scale(1);
                        box-shadow: 0 0 10px 15px hsla(var(--primary), 0);
                    }
                }
                .animate-spin-outer {
                    animation: spin-outer 4s linear infinite;
                }
                .animate-spin-inner {
                    animation: spin-inner 3s linear infinite;
                }
                .animate-pulse-core {
                    animation: pulse-core 2s ease-in-out infinite;
                }
            `}</style>
            <div className="w-32 h-32 relative flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-spin-outer"></div>
                <div className="absolute inset-6 border-t-2 border-b-2 border-primary/70 rounded-full animate-spin-inner h-[80px] w-[80px]"></div>
                <div className="absolute h-4 w-4 bg-primary rounded-full animate-pulse-core"></div>
            </div>
            <div className="mt-6 text-center">
                 <p className="text-2xl font-bold text-primary">SayWith</p>
                <div className="text-lg h-6 mt-2">
                    <span className={`transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                        {loadingTexts[textIndex]}
                    </span>
                </div>
            </div>
        </div>
    );
};
