
"use client";

import { Button } from '@/components/ui/button';
import { Feather } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { useState } from 'react';

interface Template27Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template27({ data }: Template27Props) {
  const { name, mediaUrl } = data;
  const [isRevealed, setIsRevealed] = useState(false);
  const {
    currentSubtitle,
    videoRef,
    audioRef,
    isVideo,
    useVideoAsAudioSource,
    handleInitialInteraction,
  } = useSaywithPlayer(data);

  const onInitialInteraction = (e: React.MouseEvent) => {
    setIsRevealed(true);
    handleInitialInteraction(e);
  };

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 bg-[#fdf6e3] text-gray-800 overflow-hidden"
      style={{ 
        fontFamily: "'Dancing Script', cursive",
        backgroundImage: 'url(https://www.transparenttextures.com/patterns/old-paper.png)'
      }}
      onClick={!isRevealed ? onInitialInteraction : undefined}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
      `}</style>
      {mediaUrl && (
        <>
          {isVideo ? (
            <video ref={videoRef} src={mediaUrl} className="absolute inset-0 w-full h-full object-cover filter blur-md opacity-20 video-poster-fallback" loop playsInline />
          ) : (
            <img src={mediaUrl} alt="background" className="absolute inset-0 w-full h-full object-cover filter blur-md opacity-20" />
          )}
        </>
      )}
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} />}
      
      <div className="relative w-full max-w-2xl h-full flex flex-col items-center justify-center space-y-8 z-10 text-center">

        <div className={`transition-opacity duration-1000 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-5xl font-bold text-gray-700/80">{name}</h1>
          <div className="mt-8 min-h-[150px]">
            {currentSubtitle.split('\n').map((line, index) => (
              <p key={index} className="text-3xl text-gray-600/90 leading-relaxed animate-fade-in" style={{animationDelay: `${index * 200}ms`}}>
                {line}
              </p>
            ))}
          </div>
        </div>
        
        {!isRevealed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in">
              <p className="mb-4 text-2xl" style={{fontFamily: "'Crimson Text', serif"}}>A letter for you from {name}</p>
              <Button
                onClick={onInitialInteraction}
                variant="outline"
                className="bg-transparent border-gray-400/50 text-gray-600 backdrop-blur-sm rounded-lg h-14 px-8 shadow-sm hover:bg-black/5 hover:border-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <Feather className="mr-3 h-6 w-6" />
                Unseal Letter
              </Button>
          </div>
        )}

      </div>
    </div>
  );
}
