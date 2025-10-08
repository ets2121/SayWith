
"use client";

import { Pause, Play } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { useRef, useEffect } from 'react';

interface Template37Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template37({ data }: Template37Props) {
  const { name, mediaUrl } = data;
  const {
    isPlaying,
    currentSubtitle,
    progress,
    videoRef,
    audioRef,
    isVideo,
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

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 bg-black text-white overflow-hidden"
      onClick={handleInitialInteraction}
    >
      {mediaUrl && (
        <div className="absolute inset-0 w-full h-full">
        {isVideo ? (
          <video ref={backgroundVideoRef} src={mediaUrl} className="w-full h-full object-cover filter blur-lg" loop playsInline muted />
        ) : (
          <img src={mediaUrl} alt="background" className="w-full h-full object-cover filter blur-lg" />
        )}
         <div className={`video-cover ${isPlaying || !isVideo ? 'hidden' : ''}`} />
        </div>
      )}
       <div className="absolute inset-0 bg-black/50"/>
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline/>}
      
      <div className="relative w-full max-w-sm flex flex-col items-center justify-center space-y-4 animate-fade-in-up">
        <div className="w-full bg-gradient-to-br from-gray-800/80 to-gray-900/70 backdrop-blur-lg rounded-lg p-3 flex items-center gap-3 border border-white/10 shadow-lg">
            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                 {mediaUrl && (
                   <>
                     {isVideo ? (
                        <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" loop playsInline />
                    ) : (
                        <img src={mediaUrl} alt="Album Art" className="w-full h-full object-cover" />
                    )}
                   </>
                 )}
                 <div className={`video-cover ${isPlaying || !isVideo ? 'hidden' : ''} rounded-md`} />
            </div>
            <div className="flex-grow overflow-hidden">
                <p className="text-sm font-bold truncate text-white">{name}</p>
                <p className="text-xs text-gray-400 truncate">Saywith</p>
                <div className="w-full h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-pink-500" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <button onClick={handlePlayPause} className="flex-shrink-0 text-white">
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
        </div>
        <div className="w-full text-center min-h-[56px]">
            {currentSubtitle.split('\n').map((line, index) => (
                <p key={index} className="text-xl font-medium text-pink-300 drop-shadow-md">
                    {line}
                </p>
            ))}
        </div>
      </div>
    </div>
  );
}
