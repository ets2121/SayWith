
"use client";

import { Play, Pause } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';

interface Template14Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template14({ data }: Template14Props) {
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
  } = useSaywithPlayer(data);

  return (
    <div 
      className="w-full h-screen flex items-center justify-center p-4 bg-[#fdf6e3] font-serif overflow-hidden"
      style={{ fontFamily: "'Caveat', cursive" }}
      onClick={handleInitialInteraction}
    >
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline />}
      
      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="bg-white p-4 pb-16 rounded-sm shadow-xl transform -rotate-3">
          <div className="relative w-[300px] h-[300px] bg-gray-200">
            {mediaUrl && (
              <>
                {isVideo ? (
                  <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover video-poster-fallback" loop playsInline />
                ) : (
                  <img src={mediaUrl} alt="Polaroid" className="w-full h-full object-cover" />
                )}
              </>
            )}
             <div 
                className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                onClick={handlePlayPause}
            >
                <button className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm text-white flex items-center justify-center" aria-label="Play/Pause">
                    {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                </button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center w-full">
           <h1 className="text-3xl text-gray-700">{name}</h1>
           <div className="h-16 mt-2">
              {currentSubtitle.split('\n').map((line, index) => (
                <p key={index} className="text-2xl text-gray-500 leading-tight">{line}</p>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
}
