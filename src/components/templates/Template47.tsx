
"use client";

import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import Particles, { type Container, type Engine } from "@tsparticles/react";
import { loadFull } from "tsparticles"; 
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { initParticlesEngine } from '@tsparticles/react';
import { Play } from 'lucide-react';

interface Template47Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

const heartShapeOptions = {
  fullScreen: {
    enable: true,
    zIndex: 0
  },
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        area: 800,
      },
    },
    color: {
      value: ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'],
    },
    shape: {
      type: 'char' as const,
      options: {
        char: {
          value: ['❤', '💖', '💕'],
          font: 'Verdana',
          style: '',
          weight: '400',
          fill: true,
        },
      }
    },
    opacity: {
      value: { min: 0.5, max: 1 },
      animation: {
        enable: true,
        speed: 1,
        minimumValue: 0.1,
        sync: false,
      },
    },
    size: {
      value: { min: 10, max: 25 },
      animation: {
        enable: true,
        speed: 4,
        minimumValue: 10,
        sync: false,
      },
    },
    move: {
      enable: true,
      speed: 2,
      direction: 'bottom' as const,
      random: false,
      straight: false,
      outModes: 'out' as const,
      bounce: false,
    },
  },
  interactivity: {
    detectsOn: 'canvas' as const,
    events: {
      onHover: {
        enable: true,
        mode: 'repulse',
      },
      onClick: {
        enable: true,
        mode: 'push',
      },
      resize: true,
    },
    modes: {
      repulse: {
        distance: 100,
        duration: 0.4,
      },
      push: {
        quantity: 4,
      },
    },
  },
  detectRetina: true,
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
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={heartShapeOptions as any}
        className="absolute inset-0 z-0"
      />
  );
});
MemoizedParticles.displayName = 'MemoizedParticles';


export default function Template47({ data }: Template47Props) {
  const { name, mediaUrl } = data;
  const {
    isPlaying,
    currentSubtitle,
    videoRef,
    audioRef,
    isVideo,
    useVideoAsAudioSource,
    handleInitialInteraction,
    handlePlayPause,
  } = useSaywithPlayer(data);


  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 20 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const textX = useTransform(smoothX, (val) => val * 0.2 * -15);
  const textY = useTransform(smoothY, (val) => val * 0.2 * -15);
  const mediaX = useTransform(smoothX, (val) => val * 0.2 * 15);
  const mediaY = useTransform(smoothY, (val) => val * 0.2 * 15);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
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
  
  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-background text-foreground"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleInitialInteraction}
    >
      <MemoizedParticles />
      
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop />}

      <div className="z-10 flex items-center justify-center h-full">
        <div className="text-center">
            
            <motion.div 
                className="pointer-events-auto w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl bg-black/10 border-2 border-white/20 backdrop-blur-sm mx-auto cursor-pointer relative"
                style={{ x: mediaX, y: mediaY }}
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
              style={{ x: textX, y: textY, textShadow: '0 0 20px hsl(var(--primary))' }}
            >
              <h1 className="font-headline text-3xl tracking-tight text-foreground/90 drop-shadow-lg md:text-4xl">
                {name}
              </h1>

              <div className="min-h-[56px] mt-2">
                 {currentSubtitle.split('\n').map((line, index) => (
                      <p key={index} className="font-body text-lg text-foreground/70 drop-shadow-md md:text-xl">
                          {line}
                      </p>
                  ))}
              </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
}
