
"use client";

import { Play, Pause } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface Template45Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template45({ data }: Template45Props) {
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
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div
      className="relative h-screen w-screen overflow-hidden font-sans bg-black flex items-center justify-center p-4"
      onClick={handleInitialInteraction}
    >
      {/* Background Media */}
      {mediaUrl && (
        <div className="absolute inset-0 w-full h-full">
        {isVideo ? (
          <video
            ref={backgroundVideoRef}
            src={mediaUrl}
            playsInline
            loop
            muted
            className="w-full h-full object-cover filter blur-lg scale-110"
          />
        ) : (
          <img
            src={mediaUrl}
            alt="background"
            className="w-full h-full object-cover filter blur-lg scale-110"
          />
        )}
        <div className={`video-cover ${isPlaying || !isVideo ? 'hidden' : ''}`} />
        </div>
      )}
      <div className="absolute inset-0 bg-black/30" />
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop />}

      {/* Glassmorphism Card */}
      <motion.div 
        className="relative w-full max-w-sm h-auto bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Media Display */}
        <div className="relative w-full aspect-[4/5]">
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
             <div className={`video-cover ${isPlaying || !isVideo ? 'hidden' : ''}`} />
        </div>
        
        {/* Content Area */}
        <div className="p-5 text-white">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-xl font-bold">{name}</h1>
                    <p className="text-sm text-white/70">Saywith</p>
                </div>
                 <button 
                    onClick={(e) => { e.stopPropagation(); handlePlayPause(); }} 
                    className="w-12 h-12 flex-shrink-0 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                </button>
            </div>
           
           {/* Subtitles */}
            <div className="min-h-[56px] my-4 text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSubtitle}
                  variants={subtitleVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {currentSubtitle.split('\n').map((line, index) => (
                      <p key={index} className="text-base font-medium">
                          {line}
                      </p>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
