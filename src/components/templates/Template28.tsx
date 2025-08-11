
"use client";

import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';

interface Template28Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template28({ data }: Template28Props) {
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
  } = useSaywithPlayer(data);

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 bg-slate-800 text-white overflow-hidden"
      onClick={handleInitialInteraction}
    >
        <style jsx global>{`
        .rain-effect::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: url(https://www.transparenttextures.com/patterns/subtle-zebra-3d.png);
            background-size: auto;
            animation: rain 0.4s linear infinite;
            opacity: 0.2;
            pointer-events: none;
        }
        @keyframes rain {
            0% { background-position: 0% 0%; }
            100% { background-position: 20% 20%; }
        }
        `}</style>
      {mediaUrl && (
        <>
          {isVideo ? (
            <video ref={videoRef} src={mediaUrl} className="absolute inset-0 w-full h-full object-cover filter grayscale" loop playsInline />
          ) : (
            <img src={mediaUrl} alt="background" className="absolute inset-0 w-full h-full object-cover filter grayscale" />
          )}
        </>
      )}
      <div className="absolute inset-0 bg-black/50 rain-effect" />
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} />}
      
      <div className="relative w-full max-w-2xl h-full flex flex-col items-center justify-center space-y-8 z-10 text-center">

        <div className="min-h-[150px]">
            {currentSubtitle.split('\n').map((line, index) => (
              <p key={index} className="text-3xl font-light leading-relaxed animate-fade-in" style={{animationDelay: `${index * 300}ms`}}>
                {line}
              </p>
            ))}
        </div>
        
        {!isPlaying && !userInteracted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in">
              <p className="mb-4 text-lg">A message from {name}</p>
              <Button
                onClick={handleInitialInteraction}
                variant="outline"
                size="icon"
                className="bg-black/10 text-white border-white/50 backdrop-blur-sm rounded-full h-16 w-16 hover:bg-white/10 transition-all duration-300"
              >
                <Play className="h-6 w-6 ml-1" />
              </Button>
          </div>
        )}
      </div>
    </div>
  );
}
