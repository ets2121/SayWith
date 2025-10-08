
"use client";

import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface Template42Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template42({ data }: Template42Props) {
  const { name, mediaUrl } = data;
  const {
    currentSubtitle,
    videoRef,
    audioRef,
    isVideo,
    isPlaying,
    useVideoAsAudioSource,
    handleInitialInteraction,
    handlePlayPause,
  } = useSaywithPlayer(data);

  const backgroundVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const backgroundVideo = backgroundVideoRef.current;
    if (backgroundVideo) {
      if (isPlaying) {
        backgroundVideo.play().catch(console.error);
      } else {
        backgroundVideo.pause();
      }
    }
  }, [isPlaying]);

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div
      className="relative h-screen w-screen overflow-hidden font-sans bg-pink-900 text-white"
      onClick={handleInitialInteraction}
    >
      {mediaUrl && (
        isVideo ? (
          <video
            ref={backgroundVideoRef}
            src={mediaUrl}
            playsInline
            loop
            muted
            className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-125 opacity-50"
          />
        ) : (
          <img
            src={mediaUrl}
            alt="background"
            className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-125 opacity-50"
          />
        )
      )}
      <div className="absolute inset-0 bg-black/30" />
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop />}

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center">
        <div 
            className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl bg-black/30 border-2 border-white/50 backdrop-blur-sm"
            onClick={(e) => { e.stopPropagation(); handlePlayPause(); }}
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
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-6 drop-shadow-lg">{name}</h1>
        
        <div className="min-h-[56px] mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSubtitle}
              variants={subtitleVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="drop-shadow-md"
            >
              {currentSubtitle.split('\n').map((line, index) => (
                  <p key={index} className="text-xl md:text-2xl text-white/90">
                      {line}
                  </p>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
