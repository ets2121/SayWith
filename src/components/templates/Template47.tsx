"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Particles, { type Container, type Engine } from "@tsparticles/react";
import { loadFull } from "tsparticles"; 
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';

interface Template47Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

const heartShape = {
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
      type: 'char',
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

export default function Template47({ data }: Template47Props) {
  const { name, mediaUrl } = data;
  const {
    currentSubtitle,
    videoRef,
    audioRef,
    isVideo,
    useVideoAsAudioSource,
    handleInitialInteraction,
  } = useSaywithPlayer(data);

  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);


  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {},
    []
  );

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const textX = useTransform(x, [-100, 100], [-15, 15]);
  const textY = useTransform(y, [-100, 100], [-15, 15]);
  const mediaX = useTransform(x, [-100, 100], [15, -15]);
  const mediaY = useTransform(y, [-100, 100], [15, -15]);

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

  if (!init) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
        <p>Loading a surprise...</p>
      </div>
    );
  }

  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-background text-foreground"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleInitialInteraction}
    >
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={heartShape as any}
        className="absolute inset-0 z-0"
      />
      
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop />}

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <div className="text-center">
            
            <motion.div 
                className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl bg-black/10 border-2 border-white/20 backdrop-blur-sm mx-auto"
                style={{ x: mediaX, y: mediaY }}
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
            </motion.div>

            <motion.div
              className="mt-8"
              style={{ x: textX, y: textY, textShadow: '0 0 20px hsl(var(--primary))' }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
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
