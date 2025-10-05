
"use client";

import React from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import Confetti from './Confetti';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { Play } from 'lucide-react';

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
  const {
    isPlaying,
    currentSubtitle,
    videoRef,
    audioRef,
    isVideo,
    useVideoAsAudioSource,
    handleInitialInteraction,
  } = useSaywithPlayer(data);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 70, damping: 20, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { clientWidth, clientHeight } = event.currentTarget;
    const x = (event.clientX / clientWidth) - 0.5;
    const y = (event.clientY / clientHeight) - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };
  
  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-[#1a001a] flex items-center justify-center font-sans text-white"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
          mouseX.set(0);
          mouseY.set(0);
      }}
      onClick={handleInitialInteraction}
    >
      {isPlaying && <Confetti />}
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop />}
      
      <motion.div 
        className="relative text-center w-full max-w-md flex flex-col items-center justify-center"
      >
        <motion.h1 
            className="text-3xl font-bold mb-4 animate-pulse-glow"
            style={{ 
                x: useSpring(smoothMouseX.get() * -10, springConfig), 
                y: useSpring(smoothMouseY.get() * -10, springConfig),
            }}
        >
            {data.name}
        </motion.h1>

        <motion.div 
            className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl mb-8 border-2 border-pink-500/30"
            style={{ 
                x: useSpring(smoothMouseX.get() * 30, springConfig), 
                y: useSpring(smoothMouseY.get() * 30, springConfig),
                textShadow: '0 0 20px #ff007f, 0 0 30px #ff007f, 0 0 40px #ff007f' 
            }}
        >
             {data.mediaUrl && (
                <>
                {isVideo ? (
                    <video
                    ref={videoRef}
                    src={data.mediaUrl}
                    playsInline
                    loop
                    className="w-full h-full object-cover"
                    />
                ) : (
                    <img
                    src={data.mediaUrl}
                    alt={data.name}
                    className="w-full h-full object-cover"
                    />
                )}
                </>
            )}
            {!isPlaying && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play size={60} className="text-white/80" />
                </div>
            )}
        </motion.div>

        <motion.div 
            className="min-h-[84px]"
            style={{ 
                x: useSpring(smoothMouseX.get() * -20, springConfig), 
                y: useSpring(smoothMouseY.get() * -20, springConfig)
            }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSubtitle}
              variants={subtitleVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="drop-shadow-lg"
              style={{ textShadow: '0 0 10px #ff007f, 0 0 20px #ff007f' }}
            >
              {currentSubtitle.split('\n').map((line, index) => (
                  <p key={index} className="text-2xl md:text-3xl font-semibold leading-tight">
                      {line}
                  </p>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

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
