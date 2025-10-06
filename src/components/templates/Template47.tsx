
"use client";

import React, { useState, useEffect, memo, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { Play } from 'lucide-react';
import Particles, { type Container, type Engine } from "@tsparticles/react";
import { loadFull } from "tsparticles"; 
import { initParticlesEngine } from '@tsparticles/react';


interface Template47Props {
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
    const [stars] = useState(() => Array.from({ length: 150 }, (_, i) => <Star key={i} />));
    return (
        <div className="absolute inset-0 z-0">
            {stars}
        </div>
    );
});
TwinklingStars.displayName = 'TwinklingStars';

const MemoizedParticles = memo(({ name }: { name: string }) => {
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

  const heartShapeOptions = {
    fullScreen: {
      enable: true,
      zIndex: 20
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
        value: ['#ff595e', '#ffca3a', '#ff9f1c', '#f77f00', '#d62828'],
      },
      shape: {
        type: 'char' as const,
        options: {
          char: {
            value: ['❤', '💖', '💕', `I love you ${name}`, 'I miss you', 'Always', 'Forever', name],
            font: 'Dancing Script',
            style: '',
            weight: '700',
            fill: true,
          },
        }
      },
      opacity: {
        value: { min: 0.7, max: 1 },
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.5,
          sync: false,
        },
      },
      size: {
        value: { min: 16, max: 24 },
        animation: {
          enable: true,
          speed: 3,
          minimumValue: 10,
          sync: false,
        },
      },
      move: {
        enable: true,
        speed: 1.5,
        direction: 'bottom' as const,
        random: false,
        straight: false,
        outModes: 'out' as const,
        bounce: false,
      },
       links: {
        enable: false,
      },
      collisions: {
        enable: false,
      },
       draw: (context: CanvasRenderingContext2D, particle: any) => {
        context.save();
        context.font = `${particle.shape.options.char.weight} ${particle.size.value}px "${particle.shape.options.char.font}"`;
        context.fillStyle = particle.color.value as string;
        context.shadowColor = particle.color.value as string;
        context.shadowBlur = 10;
        context.fillText(particle.shape.options.char.value, 0, 0);
        context.restore();
      }
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

  if (!init) {
    return null;
  }

  return (
      <Particles
        id="tsparticles-hearts"
        particlesLoaded={particlesLoaded}
        options={heartShapeOptions as any}
        className="absolute inset-0"
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

  const subtitleVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };
  
  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-background text-foreground"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={!userInteracted ? handleInitialInteraction : undefined}
    >
      <TwinklingStars />
      <MemoizedParticles name={name} />
      
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop />}

      <div className="z-10 flex items-center justify-center h-full">
        <div className="text-center">
            
            <motion.div 
                className="pointer-events-auto w-64 h-40 md:w-80 md:h-52 rounded-full overflow-hidden shadow-2xl bg-black/10 border-2 border-white/20 backdrop-blur-sm mx-auto cursor-pointer relative"
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

              <div className="min-h-[56px] mt-2 max-w-md mx-auto text-center">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentSubtitle}
                      variants={subtitleVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="font-body text-lg text-foreground/70 drop-shadow-md md:text-xl whitespace-pre-wrap"
                    >
                      {currentSubtitle}
                    </motion.p>
                  </AnimatePresence>
              </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
}
