
"use client";

import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { type SaywithData } from '@/app/fr/[id]/page';

interface Template1Props {
  data: SaywithData;
}

export default function Template1({ data }: Template1Props) {
  const { 
    name,
    mediaUrl,
  } = data;
  
  const {
    isPlaying,
    currentSubtitle,
    userInteracted,
    videoRef,
    audioRef,
    isVideo,
    useVideoAsAudioSource,
    handleInitialInteraction,
    handlePlayPause,
  } = useSaywithPlayer(data);

  return (
    <div className="relative h-screen w-screen overflow-hidden font-sans" onClick={handleInitialInteraction}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10" />
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
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop />}

      <div className="relative z-20 flex flex-col h-full text-white pointer-events-none">
        <header className="text-center pt-8 animate-fade-in-down">
          <p className="font-headline text-lg font-semibold text-gray-200/95">{name}</p>
          <p className="text-xs font-light tracking-wider opacity-80">Saywith</p>
        </header>

        <main className="flex-grow flex items-center justify-center">
            <div className="text-center px-4">
                {!userInteracted && !isPlaying && (
                  <p className="text-sm font-light mb-4 animate-fade-in">Click anywhere to play</p>
                )}
                {currentSubtitle.split('\n').map((line, index) => (
                    <p key={`${currentSubtitle}-${index}`} className="text-xl md:text-2xl font-serif font-extralight drop-shadow-md animate-fade-in" style={{animationDelay: `${index * 150}ms`}}>
                        {line}
                    </p>
                ))}
            </div>
        </main>

        <footer className="pb-8 flex justify-center animate-fade-in-up pointer-events-auto">
          <Button
            onClick={handlePlayPause}
            variant="outline"
            size="icon"
            className="bg-black/20 text-white border-white/80 backdrop-blur-sm rounded-full h-12 w-12 hover:bg-white/20 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1"/>}
          </Button>
        </footer>
      </div>
    </div>
  );
}
