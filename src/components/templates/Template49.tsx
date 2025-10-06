
"use client";

import React, { useState, useEffect, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { Play } from 'lucide-react';
import Particles, { type Container, type Engine } from "@tsparticles/react";
import { loadFull } from "tsparticles"; 
import { initParticlesEngine } from '@tsparticles/react';

interface Template49Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

const RosePetalParticles = memo(() => {
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
      zIndex: 1
    },
    particles: {
      number: {
        value: 40,
        density: {
          enable: true,
          area: 800,
        },
      },
      color: {
        value: ['#D81B60', '#F472B6', '#FBBF24', '#8B5CF6', '#EC4899', '#f08080', '#e9967a'],
      },
      shape: {
        type: 'char' as const,
        options: {
            char: {
                value: ['🌸', '💮', '💖', '🤍', '🌷', '🌹', '💐'],
                font: 'sans-serif',
                style: '',
                weight: '400'
            }
        }
      },
      opacity: {
        value: { min: 0.5, max: 0.9 },
      },
      size: {
        value: { min: 10, max: 20 },
      },
      move: {
        enable: true,
        speed: 1,
        direction: 'bottom' as const,
        straight: false,
        outModes: 'out' as const,
        bounce: false,
        attract: {
            enable: false,
            rotate: {x: 600, y: 1200}
        }
      },
      rotate: {
          value: { min: 0, max: 360 },
          direction: 'random' as const,
          animation: {
              enable: true,
              speed: 5
          }
      }
    },
    detectRetina: true,
  };

  if (!init) {
    return null;
  }

  return (
      <Particles
        id="tsparticles-wedding"
        particlesLoaded={particlesLoaded}
        options={particleOptions as any}
        className="absolute inset-0"
      />
  );
});
RosePetalParticles.displayName = 'RosePetalParticles';

export default function Template49({ data }: Template49Props) {
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

  const subtitleVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.4, ease: 'easeIn' } },
  };
  
  return (
    <motion.div
      className="relative h-screen w-full overflow-hidden text-gray-700"
      style={{
        fontFamily: "'Crimson Text', serif",
        backgroundColor: '#FBF9F6',
        backgroundImage: 'url(https://www.transparenttextures.com/patterns/paper-fibers.png)'
      }}
      onClick={!userInteracted ? handleInitialInteraction : undefined}
      initial="initial"
      animate="animate"
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,700;1,400&family=Great+Vibes&display=swap');
      `}</style>
      
      <RosePetalParticles />
      
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop />}

      <div className="z-10 flex flex-col items-center justify-center h-full p-4">
        <motion.div 
            className="pointer-events-auto w-64 h-80 md:w-72 md:h-96 bg-white rounded-lg overflow-hidden shadow-2xl border-4 border-white cursor-pointer relative"
            onClick={(e) => {
              e.stopPropagation();
              handlePlayPause();
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.2, duration: 0.6, ease: 'easeOut' } }}
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
                        className="absolute inset-0 flex items-center justify-center bg-black/20"
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
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.6, ease: 'easeOut' } }}
        >
            <h1 className="text-5xl md:text-6xl text-rose-800/80" style={{fontFamily: "'Great Vibes', cursive"}}>
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
                    className="text-lg md:text-xl text-gray-600/90 whitespace-pre-wrap"
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
