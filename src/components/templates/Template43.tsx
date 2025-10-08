
"use client";

import { Play, Pause } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { motion, AnimatePresence } from 'framer-motion';

interface Template43Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template43({ data }: Template43Props) {
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

  const subtitleVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <div
      className="relative h-screen w-screen overflow-hidden font-sans bg-black text-white flex flex-col"
      onClick={handleInitialInteraction}
    >
      {/* Background Media */}
      {mediaUrl && (
        <>
          {isVideo ? (
            <video
              ref={videoRef}
              src={mediaUrl}
              playsInline
              loop
              className="absolute inset-0 w-full h-full object-cover video-poster-fallback"
            />
          ) : (
            <img
              src={mediaUrl}
              alt="background"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/50" />
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop />}

      <div className="relative z-10 flex-grow flex flex-col items-center justify-center p-4">
        {/* Play/Pause button in center */}
         {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="bg-black/30 backdrop-blur-sm rounded-full p-4"
                >
                    <Play size={48} />
                </motion.div>
            </div>
         )}
        
        {/* Subtitles */}
        <div className="min-h-[84px] text-center">
            <AnimatePresence mode="wait">
            <motion.div
                key={currentSubtitle}
                variants={subtitleVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3, ease: "circOut" }}
                className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg"
            >
                {currentSubtitle.split('\n').map((line, index) => (
                    <p key={index} className="text-2xl font-semibold leading-tight">
                        {line}
                    </p>
                ))}
            </motion.div>
            </AnimatePresence>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="relative z-10 p-4 w-full">
         <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700">
                {mediaUrl && !isVideo && <img src={mediaUrl} alt={name} className="w-full h-full object-cover"/>}
             </div>
             <p className="font-bold">{name}</p>
         </div>
         <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-white" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
}
