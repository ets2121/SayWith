
"use client";

import React, { useState, useEffect, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { Play, Pause, Music } from 'lucide-react';
import Particles, { type Container, type Engine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import { initParticlesEngine } from '@tsparticles/react';


interface Template41Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template41({ data }: Template41Props) {
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
    progress,
  } = useSaywithPlayer(data);

  const [backgroundVideoRef, setBackgroundVideoRef] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (backgroundVideoRef) {
      if (isPlaying) {
        backgroundVideoRef.play().catch(console.error);
      } else {
        backgroundVideoRef.pause();
      }
    }
  }, [isPlaying, backgroundVideoRef]);

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div
      className="relative h-screen w-screen overflow-hidden font-sans bg-gray-900 text-white flex flex-col items-center justify-center p-4"
      onClick={handleInitialInteraction}
    >
      {/* Background Media */}
      {mediaUrl && (
        <div className="absolute inset-0 w-full h-full">
        {isVideo ? (
          <video
            ref={setBackgroundVideoRef}
            src={mediaUrl}
            playsInline
            loop
            muted
            className="w-full h-full object-cover filter blur-2xl scale-125 opacity-50"
          />
        ) : (
          <img
            src={mediaUrl}
            alt="background"
            className="w-full h-full object-cover filter blur-2xl scale-125 opacity-50"
          />
        )}
        <div className={`video-cover ${isPlaying || !isVideo ? 'hidden' : ''}`} />
        </div>
      )}
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop />}

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center space-y-6">
        {/* Media Display */}
        <div className="relative w-full aspect-square max-h-[350px] rounded-2xl overflow-hidden shadow-2xl bg-black/30">
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
           <div className={`video-cover ${isPlaying || !isVideo ? 'hidden' : ''} rounded-2xl`} />
        </div>

        {/* Info & Subtitles */}
        <div className="w-full text-center">
            <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
            <p className="text-sm text-gray-400 mt-1">Saywith</p>
            <div className="min-h-[56px] mt-4 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSubtitle}
                  variants={subtitleVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {currentSubtitle.split('\n').map((line, index) => (
                      <p key={index} className="text-lg text-gray-200">
                          {line}
                      </p>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
        </div>

        {/* Controls */}
        <div className="w-full bg-black/30 backdrop-blur-md p-3 rounded-xl flex items-center gap-4">
            <button onClick={handlePlayPause} className="p-2">
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <div className="flex-grow">
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
             <Music size={20} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}
