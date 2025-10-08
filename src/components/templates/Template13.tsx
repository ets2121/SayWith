
"use client";

import { Play, Pause } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';

interface Template13Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template13({ data }: Template13Props) {
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
      className="w-full h-screen relative flex items-center justify-center p-4 md:p-8 font-sans bg-[#f4f4f0] text-gray-800 overflow-hidden"
      onClick={handleInitialInteraction}
    >
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline />}
      
      <div className="w-full max-w-4xl h-full md:h-auto md:max-h-[600px] flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden rounded-lg shadow-xl">
          {mediaUrl && (
            <>
              {isVideo ? (
                <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover video-poster-fallback" loop playsInline />
              ) : (
                <img src={mediaUrl} alt="Album Art" className="w-full h-full object-cover" />
              )}
            </>
          )}
           <div 
                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300"
                onClick={handlePlayPause}
            >
                <button className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm text-white flex items-center justify-center" aria-label="Play/Pause">
                    {isPlaying ? <Pause size={40} /> : <Play size={40} className="ml-2" />}
                </button>
            </div>
        </div>

        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-between items-start text-left py-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">{name}</h1>
            <p className="text-lg text-gray-500 mt-2">Saywith</p>
          </div>
          
          <div className="w-full my-8">
            <div className="h-16 text-left">
              {currentSubtitle.split('\n').map((line, index) => (
                <p key={index} className="text-xl font-light italic text-gray-600">{line}</p>
              ))}
            </div>
          </div>
          
          <div className="w-full">
             <div className="w-full h-1 bg-gray-300 rounded-full">
                <div className="h-1 bg-gray-800 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
