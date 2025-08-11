
"use client";

import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';

interface Template29Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template29({ data }: Template29Props) {
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
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 bg-gray-900 text-white overflow-hidden"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
      onClick={handleInitialInteraction}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-orange-500 opacity-80" />
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} />}
      
      <div className="relative w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-8 z-10">
        <div className="w-full md:w-1/2 aspect-video max-w-md">
           {mediaUrl && (
             <>
               {isVideo ? (
                    <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover rounded-lg shadow-2xl" loop playsInline />
                ) : (
                    <img src={mediaUrl} alt="background" className="w-full h-full object-cover rounded-lg shadow-2xl" />
                )}
             </>
           )}
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-lg font-semibold tracking-widest uppercase text-white/80">{name}</h2>
            <div className="min-h-[120px] mt-4">
                {currentSubtitle.split('\n').map((line, index) => (
                    <p key={index} className="text-4xl lg:text-5xl font-extrabold !leading-tight animate-fade-in-up" style={{animationDelay: `${index * 150}ms`}}>
                        {line}
                    </p>
                ))}
            </div>
        </div>
      </div>

        {!isPlaying && !userInteracted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in bg-black/30 backdrop-blur-sm">
              <p className="mb-4 text-lg font-semibold">A motivational message from {name}</p>
              <Button
                onClick={handleInitialInteraction}
                className="bg-yellow-400 text-gray-900 rounded-full h-16 px-8 text-lg font-bold shadow-lg hover:bg-yellow-300 transition-all duration-300 ease-in-out transform hover:scale-110"
              >
                <Zap className="mr-3 h-6 w-6" />
                Get Motivated
              </Button>
          </div>
        )}
    </div>
  );
}
