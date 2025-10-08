
"use client";

import React, { useState, useEffect, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { Play } from 'lucide-react';
import Particles, { type Container, type Engine } from "@tsparticles/react";
import { loadFull } from "tsparticles"; 
import { initParticlesEngine } from '@tsparticles/react';


interface Template48Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

const Star = () => {
    const size = Math.random() * 2 + 1;
    const duration = Math.random() * 2 + 1.5;
    const delay = Math.random() * 2;

    return (
        <motion.div
            className="absolute rounded-full bg-white"
            style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: size,
                height: size,
                boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)'
            }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
                duration,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut',
                delay,
            }}
        />
    );
};

const TwinklingStars = memo(() => {
    const [stars] = useState(() => Array.from({ length: 100 }, (_, i) => <Star key={i} />));
    return (
        <div className="absolute inset-0 z-0">
            {stars}
        </div>
    );
});
TwinklingStars.displayName = 'TwinklingStars';

const DigitalRainParticles = memo(() => {
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
      zIndex: 20
    },
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          area: 800,
        },
      },
      color: {
        value: ['#00ffff', '#ff00ff', '#ffffff'],
      },
      shape: {
        type: 'circle' as const,
      },
      opacity: {
        value: { min: 0.3, max: 0.8 },
      },
      size: {
        value: { min: 1, max: 3 },
      },
      move: {
        enable: true,
        speed: 1,
        direction: 'bottom' as const,
        straight: true,
        outModes: 'out' as const,
      },
       links: {
        enable: false,
      },
      collisions: {
        enable: false,
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'repulse',
        },
      },
      modes: {
        repulse: {
          distance: 50,
          duration: 0.4,
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
        id="tsparticles-digital-rain"
        particlesLoaded={particlesLoaded}
        options={particleOptions as any}
        className="absolute inset-0"
      />
  );
});
DigitalRainParticles.displayName = 'DigitalRainParticles';


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

  const GlitchText = ({ text }: { text: string }) => (
    <div className="glitch-text" data-text={text}>
      {text}
    </div>
  );

  const subtitleVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3, ease: 'easeIn' } },
  };
  
  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-background text-foreground font-mono"
      onClick={!userInteracted ? handleInitialInteraction : undefined}
      style={{ fontFamily: "'Share Tech Mono', monospace" }}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        .glitch-text {
          position: relative;
          text-shadow: 0.05em 0 0 rgba(0,255,255,0.7), -0.025em -0.05em 0 rgba(255,0,255,0.7), 0.025em 0.05em 0 rgba(0,255,0,0.7);
          animation: glitch 700ms infinite;
        }

        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0.8;
          background: var(--background);
        }

        .glitch-text::before {
          animation: glitch 850ms infinite;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          transform: translate(-0.05em, -0.025em);
          color: #0ff;
        }

        .glitch-text::after {
          animation: glitch 550ms infinite;
          clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
          transform: translate(0.05em, 0.025em);
          color: #f0f;
        }

        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-0.05em, 0.05em); }
          40% { transform: translate(-0.05em, -0.05em); }
          60% { transform: translate(0.05em, 0.05em); }
          80% { transform: translate(0.05em, -0.05em); }
          100% { transform: translate(0); }
        }
      `}</style>
      <TwinklingStars />
      <DigitalRainParticles />
      
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop />}

      <div className="z-30 flex items-center justify-center h-full">
        <div className="text-center">
            
            <motion.div 
                className="pointer-events-auto w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-2xl bg-black/10 border-2 border-cyan-400/50 backdrop-blur-sm mx-auto cursor-pointer relative"
                 style={{
                    boxShadow: '0 0 15px rgba(0, 255, 255, 0.3), 0 0 25px rgba(0, 255, 255, 0.2)',
                 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
            >
                {mediaUrl && (
                    <>
                    {isVideo ? (
                        <video
                        ref={videoRef}
                        src={mediaUrl}
                        playsInline
                        loop
                        className="w-full h-full object-cover video-poster-fallback"
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
                <motion.div 
                    className="absolute inset-0 flex items-center justify-center bg-black/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isPlaying ? 0 : 1 }}
                    exit={{ opacity: 0 }}
                >
                    <Play size={64} className="text-white/80" fill="white" />
                </motion.div>
            </motion.div>

            <motion.div
              className="mt-8 pointer-events-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            >
              <h1 className="text-3xl tracking-wider text-cyan-300 drop-shadow-lg md:text-4xl" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.7)'}}>
                {name}
              </h1>

              <div className="min-h-[56px] mt-2 max-w-md mx-auto text-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSubtitle}
                      variants={subtitleVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="text-lg text-fuchsia-300 drop-shadow-md md:text-xl"
                    >
                        <GlitchText text={currentSubtitle} />
                    </motion.div>
                  </AnimatePresence>
              </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
}
