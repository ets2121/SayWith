
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const Particle = ({ className }: { className: string }) => (
    <div className={`absolute rounded-full bg-primary/50 ${className}`} />
);

export default function LandingPageLoader() {
    const [particles, setParticles] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const generateParticles = () => {
            const newParticles = Array.from({ length: 30 }).map((_, i) => {
                const size = Math.random() * 3 + 1;
                const top = Math.random() * 100;
                const left = Math.random() * 100;
                const duration = Math.random() * 5 + 5;
                const delay = Math.random() * 5;
                const randomX = Math.random() * 40 - 20;
                const randomY = Math.random() * 40 - 20;
                const randomScale = Math.random() * 0.5 + 0.8;

                return (
                    <div
                        key={i}
                        className="absolute rounded-full bg-primary/30 particle-drift"
                        style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            top: `${top}%`,
                            left: `${left}%`,
                            animationDuration: `${duration}s`,
                            animationDelay: `${delay}s`,
                            '--drift-x': `${randomX}px`,
                            '--drift-y': `${randomY}px`,
                            '--drift-scale': `${randomScale}`
                        } as React.CSSProperties}
                    />
                );
            });
            setParticles(newParticles);
        };
        generateParticles();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground overflow-hidden">
            <style jsx global>{`
                @keyframes drift {
                    0% {
                        transform: translate(0, 0) scale(1);
                        opacity: 0.1;
                    }
                    100% {
                        transform: translate(var(--drift-x), var(--drift-y)) scale(var(--drift-scale));
                        opacity: 0.8;
                    }
                }
                .particle-drift {
                    animation-name: drift;
                    animation-timing-function: ease-in-out;
                    animation-iteration-count: infinite;
                    animation-direction: alternate;
                }
                @keyframes breath {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 10px 0px hsla(var(--primary), 0); }
                    50% { transform: scale(1.05); box-shadow: 0 0 25px 10px hsla(var(--primary), 0.3); }
                }
                .animate-breath {
                    animation: breath 3s ease-in-out infinite;
                }
                @keyframes glow {
                    0%, 100% { text-shadow: 0 0 5px hsla(var(--primary), 0.2); }
                    50% { text-shadow: 0 0 15px hsla(var(--primary), 0.5); }
                }
                .text-glow {
                     animation: glow 3s ease-in-out infinite;
                }
            `}</style>
            <div className="absolute inset-0 z-0">
                {particles}
            </div>
            <div className="relative w-24 h-24 z-10">
                <Image
                    src="/icons/icon-192x192.png"
                    alt="SayWith Logo"
                    width={96}
                    height={96}
                    className="animate-breath rounded-full"
                />
            </div>
            <p className="mt-6 text-lg text-primary text-glow">
                Say it with style...
            </p>
        </div>
    );
}
