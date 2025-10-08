
"use client";

import { Heart } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';

interface Template15Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template15({ data }: Template15Props) {
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

  return (
    <div 
      className="w-full h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-red-200 via-rose-200 to-amber-100 font-sans overflow-hidden"
      onClick={handleInitialInteraction}
    >
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline />}
      
      <div className="w-full max-w-md flex flex-col items-center justify-center text-center">
        <div 
            className="relative w-full aspect-square max-w-[350px] flex items-center justify-center video-poster-fallback"
            style={{ clipPath: 'url(#heart-clip)' }}
            onClick={handlePlayPause}
        >
          {mediaUrl && (
            <>
              {isVideo ? (
                <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" loop playsInline />
              ) : (
                <img src={mediaUrl} alt="Heart" className="w-full h-full object-cover" />
              )}
            </>
          )}
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Heart size={64} className={`transition-all duration-300 ${isPlaying ? 'fill-white text-white' : 'text-white'}`} />
          </div>
        </div>
        
        <div className="mt-8 text-center w-full">
           <h1 className="text-3xl font-bold text-rose-800">{name}</h1>
           <div className="h-14 mt-2">
              {currentSubtitle.split('\n').map((line, index) => (
                <p key={index} className="text-xl text-rose-700/80 leading-tight">{line}</p>
              ))}
            </div>
        </div>

         <div className="w-full max-w-xs mt-4">
            <div className="w-full h-1 bg-rose-200 rounded-full">
            <div className="h-1 bg-rose-400 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        </div>

      </div>
      
      <svg width="0" height="0">
        <defs>
          <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,1 C 0.5,1,0,0.7,0,0.3 A 0.25,0.25,0,0,1,0.5,0.3 A 0.25,0.25,0,0,1,1,0.3 C 1,0.7,0.5,1,0.5,1 Z" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}
