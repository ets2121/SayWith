
"use client";

import React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Confetti from './Confetti';

interface Template46Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template46({ data }: Template46Props) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothMouseX = useSpring(mouseX, { stiffness: 70, damping: 20, mass: 0.5 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 70, damping: 20, mass: 0.5 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { clientWidth, clientHeight } = event.currentTarget;
    const x = (event.clientX / clientWidth) - 0.5;
    const y = (event.clientY / clientHeight) - 0.5;
    mouseX.set(x * 50);
    mouseY.set(y * 50);
  };
  
  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-[#1a001a] flex items-center justify-center font-sans text-white"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
          mouseX.set(0);
          mouseY.set(0);
      }}
    >
      <Confetti />
      <motion.div 
        className="text-center"
        style={{ x: smoothMouseX, y: smoothMouseY, textShadow: '0 0 20px #ff007f, 0 0 30px #ff007f, 0 0 40px #ff007f' }}
        >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-pulse-glow">
          Sweet Surprise 💖
        </h1>
      </motion.div>

      <style jsx global>{`
        @keyframes pulse-glow {
          0%, 100% {
            text-shadow: 0 0 15px #ff007f, 0 0 25px #ff007f;
          }
          50% {
            text-shadow: 0 0 25px #ff4da6, 0 0 40px #ff4da6;
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
