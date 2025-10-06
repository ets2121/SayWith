
"use client";

import React, { useState, useEffect, memo } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
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

const Star = () => {
    const size = Math.random() * 2 + 1;
    const duration = Math.random() * 2 + 1.5;
    const delay = Math.random() * 2;
    const top = `${Math.random() * 100}%`;
    const left = `${Math.random() * 100}%`;

    return (
        <motion.div
            className="absolute rounded-full bg-white"
            style={{
                width: size,
                height: size,
                top,
                left,
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


export default function Template46({ data }: Template46Props) {
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
  
  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-background text-foreground"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={!userInteracted ? handleInitialInteraction : undefined}
    >
      <TwinklingStars />
      
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
