
"use client";

import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import Particles, { type Container, type Engine } from "@tsparticles/react";
import { loadFull } from "tsparticles"; 
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { initParticlesEngine } from '@tsparticles/react';
import { Play } from 'lucide-react';

interface Template48Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

const bubbleOptions = {
    fullScreen: {
      enable: true,
      zIndex: 0
    },
    particles: {
      number: {
        value: 40,
        density: {
          enable: true,
          area: 800
        }
      },
      color: {
        value: "#ffffff"
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: { min: 0.1, max: 0.5 },
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.1,
          sync: false
        }
      },
      size: {
        value: { min: 5, max: 20 },
        animation: {
          enable: true,
          speed: 5,
          minimumValue: 5,
          sync: false
        }
      },
      move: {
        enable: true,
        speed: 1.5,
        direction: "top" as const,
        random: true,
        straight: false,
        outModes: "out" as const,
        bounce: false
      }
    },
    interactivity: {
      detectsOn: "canvas" as const,
      events: {
        onHover: {
          enable: true,
          mode: "bubble"
        },
        resize: true
      },
      modes: {
        bubble: {
          distance: 200,
          size: 25,
          duration: 2,
          opacity: 0.8
        }
      }
    },
    detectRetina: true
};

const MemoizedParticles = memo(() => {
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

  if (!init) {
    return null;
  }

  return (
      <Particles
        id="tsparticles-bubbles"
        particlesLoaded={particlesLoaded}
        options={bubbleOptions as any}
        className="absolute inset-0"
      />
  );
});
MemoizedParticles.displayName = 'MemoizedParticles';

export default function Template48({ data }: Template48Props) {
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
  } = useSaywithPlayer(data);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 20 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const textX = useTransform(smoothX, val => val * 0.1 * -1);
  const textY = useTransform(smoothY, val => val * 0.1 * -1);
  const mediaX = useTransform(smoothX, val => val * 0.2 * 1);
  const mediaY = useTransform(smoothY, val => val * 0.2 * 1);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = event;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const xPos = clientX - left;
    const yPos = clientY - top;
    const xPct = (xPos / width - 0.5) * 2;
    const yPct = (yPos / height - 0.5) * 2;
    x.set(xPct * 15);
    y.set(yPct * 15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const subtitleContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const subtitleWord = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={!userInteracted ? handleInitialInteraction : undefined}
    >
      <MemoizedParticles />
      
      {!useVideoAsAudioSource && <audio ref={audioRef} />}

      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center">
            
            <motion.div 
                className="pointer-events-auto w-48 h-48 md:w-64 md:h-64 rounded-xl overflow-hidden shadow-2xl bg-black/10 border-2 border-white/20 backdrop-blur-sm mx-auto cursor-pointer relative"
                style={{ x: mediaX, y: mediaY, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }}
            >
                {mediaUrl && (
                  <>
                    {isVideo ? (
                        <video
                            ref={videoRef}
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
                <AnimatePresence>
                    {!isPlaying && (
                         <motion.div 
                            className="absolute inset-0 flex items-center justify-center bg-black/30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                         >
                            <Play size={64} className="text-white/80" fill="white" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <motion.div
              className="mt-8 pointer-events-none"
              style={{ x: textX, y: textY, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
              <h1 className="font-headline text-3xl tracking-tight text-white/95 drop-shadow-lg md:text-4xl">
                {name}
              </h1>

              <div className="min-h-[56px] mt-2 max-w-md mx-auto text-center">
                  <motion.p
                    key={currentSubtitle}
                    variants={subtitleContainer}
                    initial="hidden"
                    animate="visible"
                    className="font-body text-lg text-white/80 drop-shadow-md md:text-xl whitespace-pre-wrap"
                  >
                      {currentSubtitle.split(" ").map((word, index) => (
                        <motion.span
                            key={index}
                            variants={subtitleWord}
                            className="inline-block mr-[0.25em]"
                        >
                          {word}
                        </motion.span>
                      ))}
                  </motion.p>
              </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
}
