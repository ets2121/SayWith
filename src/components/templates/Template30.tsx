
"use client";

import { Button } from '@/components/ui/button';
import { Mic, Laugh } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';

interface Template30Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template30({ data }: Template30Props) {
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
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 bg-black text-white overflow-hidden"
      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      onClick={handleInitialInteraction}
    >
        <style jsx global>{`
            @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
            .brick-wall {
                background-color: #4a2d27;
                background-image: linear-gradient(335deg, #b0492f 23px, transparent 23px),
                                  linear-gradient(155deg, #b0492f 23px, transparent 23px),
                                  linear-gradient(335deg, #b0492f 23px, transparent 23px),
                                  linear-gradient(155deg, #b0492f 23px, transparent 23px);
                background-size: 58px 58px;
                background-position: 0px 2px, 4px 35px, 29px 31px, 34px 6px;
            }
        `}</style>
      <div className="absolute inset-0 brick-wall opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} />}
      
      <div className="relative w-full max-w-lg flex flex-col items-center justify-center space-y-6 z-10 text-center">
        <div className="w-full max-w-sm aspect-video bg-black border-4 border-gray-700 rounded-md p-2 shadow-2xl">
           {mediaUrl && (
             <>
               {isVideo ? (
                    <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" loop playsInline />
                ) : (
                    <img src={mediaUrl} alt="media" className="w-full h-full object-cover" />
                )}
             </>
           )}
        </div>
        <div className="min-h-[80px]">
            {currentSubtitle.split('\n').map((line, index) => (
                <p key={index} className="text-4xl tracking-wider text-yellow-300 drop-shadow-lg animate-fade-in" style={{animationDelay: `${index * 150}ms`}}>
                    {line}
                </p>
            ))}
        </div>

        <div className="flex items-center gap-4 text-white/70">
            <Mic size={32} />
            <h1 className="text-4xl tracking-wider">{name}</h1>
        </div>

        {!isPlaying && !userInteracted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in bg-black/60 backdrop-blur-sm">
              <p className="mb-4 text-2xl tracking-wider">Joke time with {name}!</p>
              <Button
                onClick={handleInitialInteraction}
                className="bg-red-600 text-white rounded-md h-14 px-8 text-xl tracking-wider shadow-lg hover:bg-red-500 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <Laugh className="mr-3 h-6 w-6" />
                Tell Me The Joke
              </Button>
          </div>
        )}
      </div>
    </div>
  );
}
