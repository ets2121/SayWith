
"use client";

import { Play, Pause, Heart } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';

interface Template16Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template16({ data }: Template16Props) {
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
      className="w-full h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-100 to-pink-200 overflow-hidden"
      style={{ fontFamily: "'Great Vibes', cursive" }}
      onClick={handleInitialInteraction}
    >
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline />}
      
      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-sm shadow-2xl rounded-lg flex flex-col md:flex-row items-center p-6">
        
        <div className="w-full md:w-1/2 p-2 border-4 border-white rounded-md shadow-lg">
            <div className="relative w-full aspect-square">
                {mediaUrl && (
                  <>
                    {isVideo ? (
                    <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover rounded" loop playsInline />
                    ) : (
                    <img src={mediaUrl} alt="Romantic Memory" className="w-full h-full object-cover rounded" />
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
        
        <div className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-8 text-center md:text-left">
           <h1 className="text-5xl text-rose-800/80">{name}</h1>
           <div className="h-24 mt-4 text-3xl text-rose-600/70 leading-snug flex items-center justify-center md:justify-start">
              <div className="w-full">
                {currentSubtitle.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
              </div>
            </div>
            <div className="mt-4 flex justify-center md:justify-end items-center gap-2 text-rose-400">
                <p className="font-sans text-xs">With Love</p>
                <Heart size={16} className="fill-current" />
            </div>
        </div>
      </div>
    </div>
  );
}
