
"use client";

import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { type SaywithData } from '@/app/fr/[id]/page';

interface Template2Props {
  data: SaywithData;
}

export default function Template2({ data }: Template2Props) {
  const { name, mediaUrl } = data;
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
    thumbnail,
  } = useSaywithPlayer(data);

  const BlurredMediaComponent = isVideo ? 'video' : 'img';
  const blurredMediaProps = {
      ...(isVideo ? { ref: videoRef, poster: thumbnail } : {}),
      src: mediaUrl,
      playsInline: isVideo ? true : undefined,
      loop: isVideo ? true : undefined,
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden font-sans bg-black" onClick={handleInitialInteraction}>
      {mediaUrl && (
        <BlurredMediaComponent
          {...blurredMediaProps}
          className="absolute inset-0 w-full h-full object-cover filter blur-md scale-110"
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop />}

      <div className="relative z-20 flex flex-col h-full items-center justify-center p-4">
        
        <div className="relative w-full max-w-md h-[65vh] max-h-[500px] flex flex-col items-center justify-center text-white">
            <div className="relative w-full h-full border-2 border-white rounded-lg overflow-hidden shadow-2xl">
                 {mediaUrl && (
                  isVideo ? (
                    <video ref={videoRef} src={mediaUrl} poster={thumbnail} className="w-full h-full object-cover" playsInline loop />
                  ) : (
                    <img src={mediaUrl} alt="media" className="w-full h-full object-cover" />
                  )
                 )}
                 <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 backdrop-blur-sm text-center">
                    <p className="font-serif text-xs tracking-wider text-white">{name}</p>
                </div>
            </div>
            
            {!userInteracted && !isPlaying && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-fade-in pointer-events-none">
                    <p className="text-xs font-light tracking-wider opacity-80">Click anywhere to play</p>
                </div>
            )}
        </div>
        
        <div className="text-center mt-6 h-16 z-30">
            {currentSubtitle.split('\n').map((line, index) => (
                <p key={`${currentSubtitle}-${index}`} className="font-serif text-lg text-white font-light tracking-wide leading-tight animate-fade-in" style={{animationDelay: `${index * 200}ms`}}>
                    {line}
                </p>
            ))}
        </div>

        <div className="absolute bottom-6 right-6 pointer-events-auto">
            <Button
                onClick={handlePlayPause}
                variant="outline"
                size="icon"
                className="bg-black/20 text-white border-white/80 backdrop-blur-sm rounded-full h-12 w-12 hover:bg-white/20 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1"/>}
            </Button>
        </div>
      </div>
    </div>
  );
}
