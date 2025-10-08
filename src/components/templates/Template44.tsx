
"use client";

import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { motion, AnimatePresence } from 'framer-motion';

interface Template44Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template44({ data }: Template44Props) {
  const {
    currentSubtitle,
    videoRef,
    audioRef,
    isVideo,
    useVideoAsAudioSource,
    handleInitialInteraction,
    progress,
  } = useSaywithPlayer(data);

  const subtitleVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div
      className="relative h-screen w-screen overflow-hidden font-sans bg-black text-white flex flex-col"
      onClick={handleInitialInteraction}
    >
      {/* Main Media */}
      {data.mediaUrl && (
        <>
          {isVideo ? (
            <video
              ref={videoRef}
              src={data.mediaUrl}
              playsInline
              loop
              className="absolute inset-0 w-full h-full object-cover video-poster-fallback"
            />
          ) : (
            <img
              src={data.mediaUrl}
              alt="background"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </>
      )}
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop />}

      {/* Letterbox Effect */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        {/* Top bar */}
        <div className="h-[15vh] bg-black"></div>
        {/* Bottom bar */}
        <div className="h-[15vh] bg-black flex flex-col justify-end">
            <div className="w-full h-0.5 bg-white/20">
                <div className="h-full bg-white" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
            </div>
        </div>
      </div>
      
      {/* Subtitles */}
      <div className="absolute inset-0 flex items-center justify-center text-center p-4">
        <div className="min-h-[84px] text-center">
            <AnimatePresence mode="wait">
            <motion.div
                key={currentSubtitle}
                variants={subtitleVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                {currentSubtitle.split('\n').map((line, index) => (
                    <p key={index} className="text-2xl md:text-3xl font-semibold leading-tight drop-shadow-lg">
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
