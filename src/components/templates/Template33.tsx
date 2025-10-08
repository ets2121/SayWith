
"use client";

import { Pause, Play } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { useRef, useEffect } from 'react';

interface Template33Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template33({ data }: Template33Props) {
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
        <>
          {isVideo ? (
            <video ref={backgroundVideoRef} src={mediaUrl} className="absolute inset-0 w-full h-full object-cover filter blur-md video-poster-fallback" loop playsInline muted />
          ) : (
            <img src={mediaUrl} alt="background" className="absolute inset-0 w-full h-full object-cover filter blur-md" />
          )}
        </>
      )}
       <div className="absolute inset-0 bg-black/40"/>
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline/>}
      
      <div className="relative w-full max-w-sm flex flex-col items-center justify-center space-y-4 animate-fade-in-up">
        <div className="w-full bg-white/10 backdrop-blur-md rounded-lg p-3 flex items-center gap-3">
            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                 {mediaUrl && (
                   <>
                     {isVideo ? (
                        <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover video-poster-fallback" loop playsInline />
                    ) : (
                        <img src={mediaUrl} alt="Album Art" className="w-full h-full object-cover" />
                    )}
                   </>
                 )}
            </div>
            <div className="flex-grow overflow-hidden">
                <p className="text-sm font-bold truncate">{name}</p>
                <p className="text-xs text-white/70 truncate">Saywith</p>
                <div className="w-full h-1 bg-white/30 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-white" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <button onClick={handlePlayPause} className="flex-shrink-0">
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
        </div>
        <div className="w-full text-center min-h-[56px]">
            {currentSubtitle.split('\n').map((line, index) => (
                <p key={index} className="text-xl font-medium drop-shadow-md">
                    {line}
                </p>
            ))}
        </div>
      </div>
    </div>
  );
}
