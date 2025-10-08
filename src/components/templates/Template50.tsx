
"use client";

import React, { useState, useEffect, memo, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { Play } from 'lucide-react';
import Particles, { type Container, type Engine } from "@tsparticles/react";
import { loadFull } from "tsparticles"; 
import { initParticlesEngine } from '@tsparticles/react';


interface Template50Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

const StarryBackground = memo(() => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {},
    []
  );

  const particleOptions = {
    fullScreen: {
      enable: true,
      zIndex: 0
    },
    particles: {
      number: {
        value: 150,
        density: {
          enable: true,
          area: 800,
        },
      },
      color: {
        value: '#ffffff',
      },
      shape: {
        type: 'circle' as const,
      },
      opacity: {
        value: { min: 0.1, max: 0.8 },
        animation: {
            enable: true,
            speed: 0.5,
            minimumValue: 0.1,
            sync: false
        }
      },
      size: {
        value: { min: 0.5, max: 2 },
      },
      move: {
        enable: true,
        speed: 0.2,
        direction: 'none' as const,
        random: true,
        straight: false,
        outModes: 'out' as const,
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'bubble',
        },
      },
      modes: {
        bubble: {
          distance: 100,
          duration: 2,
          opacity: 1,
          size: 3
        },
      },
    },
    detectRetina: true,
  };

  if (!init) {
    return null;
  }

  return (
      <Particles
        id="tsparticles-stars"
        particlesLoaded={particlesLoaded}
        options={particleOptions as any}
        className="absolute inset-0"
      />
  );
});
StarryBackground.displayName = 'StarryBackground';


export default function Template50({ data }: Template50Props) {
  const { name, mediaUrl } = data;
  const {
    isPlaying,
    currentSubtitle,
    videoRef,
    audioRef,
    isVideo,
    userInteracted,
    useVideoAsAudioSource,
    handleInitialInteraction,
    handlePlayPause,
    progress,
  } = useSaywithPlayer(data);


  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 20 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  // Parallax for main content
  const textX = useTransform(smoothX, (val) => val * 0.1 * -1);
  const textY = useTransform(smoothY, (val) => val * 0.1 * -1);
  const mediaX = useTransform(smoothX, (val) => val * 0.1 * 1);
  const mediaY = useTransform(smoothY, (val) => val * 0.1 * 1);

  // Parallax for background planets
  const planet1X = useTransform(smoothX, (val) => val * 0.05);
  const planet1Y = useTransform(smoothY, (val) => val * 0.05);
  const planet2X = useTransform(smoothX, (val) => val * 0.08);
  const planet2Y = useTransform(smoothY, (val) => val * 0.08);
  const planet3X = useTransform(smoothX, (val) => val * 0.03);
  const planet3Y = useTransform(smoothY, (val) => val * 0.03);


  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if(!userInteracted) return;
    const { clientX, clientY, currentTarget } = event;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const xPos = clientX - left;
    const yPos = clientY - top;
    const xPct = xPos / width - 0.5;
    const yPct = yPos / height - 0.5;
    x.set(xPct * 100);
    y.set(yPct * 100);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3, ease: 'easeIn' } },
  };
  
  return (
    <motion.div
      className="relative h-screen w-full overflow-hidden bg-black text-white"
      style={{ fontFamily: "'Exo 2', sans-serif" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={!userInteracted ? handleInitialInteraction : undefined}
    >
      <StarryBackground />

      {/* Parallax Planets */}
       <motion.div
        className="absolute top-[10%] left-[15%] w-32 h-32 bg-gradient-to-br from-blue-700 to-purple-900 rounded-full opacity-30 filter blur-sm"
        style={{ x: planet1X, y: planet1Y }}
        animate={{
          x: [null, 15, -10, 15],
          y: [null, -10, 15, -10],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-[15%] right-[20%] w-24 h-24 bg-gradient-to-br from-red-800 to-yellow-600 rounded-full opacity-40 filter blur-sm"
        style={{ x: planet2X, y: planet2Y }}
        animate={{
          x: [null, -20, 25, -20],
          y: [null, 15, -10, 15],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-[25%] right-[10%] w-16 h-16 bg-gradient-to-br from-teal-500 to-green-700 rounded-full opacity-20 filter blur-md"
        style={{ x: planet3X, y: planet3Y }}
        animate={{
          x: [null, 10, -5, 10],
          y: [null, -15, 20, -15],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop />}

      <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
        
        <motion.div 
            className="pointer-events-auto cursor-pointer relative flex items-center justify-center"
            style={{ x: mediaX, y: mediaY }}
            onClick={(e) => {
              e.stopPropagation();
              handlePlayPause();
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.2, duration: 0.8, ease: 'easeOut' } }}
        >
            <svg className="absolute w-[220px] h-[220px] md:w-[280px] md:h-[280px]" viewBox="0 0 100 100">
                <motion.circle
                    cx="50"
                    cy="50"
                    r="48"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="2"
                    fill="none"
                />
                 <motion.circle
                    cx="50"
                    cy="50"
                    r="48"
                    stroke="url(#orbitalGradient)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    pathLength="1"
                    strokeDasharray="1"
                    strokeDashoffset={useTransform(useMotionValue(progress), v => 1 - v / 100)}
                    transform="rotate(-90 50 50)"
                    style={{ filter: "drop-shadow(0 0 5px hsl(var(--primary)))" }}
                />
                <defs>
                    <linearGradient id="orbitalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="#9333ea" />
                    </linearGradient>
                </defs>
            </svg>

            <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-full overflow-hidden shadow-2xl bg-black/50">
              {mediaUrl && (
                  <>
                  {isVideo ? (
                      <video
                      ref={videoRef}
                      src={mediaUrl}
                      playsInline
                      loop
                      className="w-full h-full object-cover"
                      />
                  ) : (
                      <img
                      src={mediaUrl}
                      alt={name}
                      className="w-full h-full object-cover"
                      />
                  )}
                  </>
              )}
              <div className={`video-cover ${isPlaying || !isVideo ? 'hidden' : ''} rounded-full`} />
            </div>
            
            <AnimatePresence>
                {!isPlaying && !userInteracted && (
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.5 } }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="text-center">
                            <Play size={48} className="text-white/80" fill="white" />
                            <p className="text-xs mt-2">Click to Launch</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>

        <motion.div
            className="mt-8 text-center"
            style={{ x: textX, y: textY }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.8, ease: 'easeOut' } }}
        >
            <h1 className="text-3xl md:text-4xl text-white font-bold" style={{textShadow: "0 0 10px hsla(var(--primary), 0.7)"}}>
                {name}
            </h1>

            <div className="min-h-[56px] mt-2 max-w-md mx-auto">
                <AnimatePresence mode="wait">
                <motion.p
                    key={currentSubtitle}
                    variants={subtitleVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-lg md:text-xl text-white/80 whitespace-pre-wrap drop-shadow-lg"
                >
                    {currentSubtitle}
                </motion.p>
                </AnimatePresence>
            </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
