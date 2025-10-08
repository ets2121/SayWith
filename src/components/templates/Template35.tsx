
"use client";

import { Play } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';

interface Template35Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template35({ data }: Template35Props) {
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
  } = useSaywithPlayer(data);

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 bg-black text-white overflow-hidden"
      style={{ fontFamily: "'Anton', sans-serif" }}
      onClick={handleInitialInteraction}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
      `}</style>
      
      {mediaUrl && (
        <div className="absolute inset-0 w-full h-full">
          {isVideo ? (
            <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" loop playsInline />
          ) : (
            <img src={mediaUrl} alt="background" className="w-full h-full object-cover" />
          )}
          <div className={`video-cover ${isPlaying || !isVideo ? 'hidden' : ''}`} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/80" />
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline/>}
      
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <Play size={80} className="text-white/70" fill="white" />
        </div>
      )}

      <div className="relative w-full h-full flex flex-col justify-between p-4 z-10">
        <div className="w-full">
            <p className="text-lg font-bold tracking-wider">{name}</p>
        </div>

        <div className="w-full text-center flex-grow flex items-center justify-center">
            {currentSubtitle.split('\n').map((line, index) => (
                <p key={index} className="text-6xl md:text-8xl uppercase leading-none tracking-tight text-white drop-shadow-2xl animate-fade-in-up" style={{animationDelay: `${index * 150}ms`}}>
                    {line}
                </p>
            ))}
        </div>
        
        <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
             <div className="h-full bg-white transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
}
