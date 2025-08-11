
"use client";

import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { useState } from 'react';

interface Template26Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template26({ data }: Template26Props) {
  const { name, mediaUrl } = data;
  const [showMessage, setShowMessage] = useState(false);
  const {
    currentSubtitle,
    videoRef,
    audioRef,
    isVideo,
    useVideoAsAudioSource,
    handleInitialInteraction,
  } = useSaywithPlayer(data);

  const onInitialInteraction = (e: React.MouseEvent) => {
    setShowMessage(true);
    handleInitialInteraction(e);
  };

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 bg-gray-100 text-gray-800 overflow-hidden"
      style={{ fontFamily: "'Crimson Text', serif" }}
      onClick={!showMessage ? onInitialInteraction : undefined}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,700;1,400&display=swap');
      `}</style>
      {mediaUrl && (
        <>
          {isVideo ? (
            <video ref={videoRef} src={mediaUrl} className="absolute inset-0 w-full h-full object-cover filter blur-sm opacity-50" loop playsInline />
          ) : (
            <img src={mediaUrl} alt="background" className="absolute inset-0 w-full h-full object-cover filter blur-sm opacity-50" />
          )}
        </>
      )}
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} />}
      
      <div className="relative w-full max-w-2xl h-full flex flex-col items-center justify-center space-y-8 z-10 text-center">

        <div className={`transition-opacity duration-1000 ${showMessage ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-4xl font-bold tracking-wider text-gray-700">{name}</h1>
          <div className="mt-8 min-h-[120px]">
            {currentSubtitle.split('\n').map((line, index) => (
              <p key={index} className="text-2xl italic text-gray-600 leading-relaxed animate-fade-in" style={{animationDelay: `${index * 150}ms`}}>
                {line}
              </p>
            ))}
          </div>
        </div>
        
        {!showMessage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in">
              <p className="mb-4 text-lg">You have a message from {name}</p>
              <Button
                onClick={onInitialInteraction}
                variant="outline"
                className="bg-white/80 border-gray-300 text-gray-700 backdrop-blur-sm rounded-lg h-12 px-6 shadow-sm hover:bg-white transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <Mail className="mr-2 h-5 w-5" />
                Open Message
              </Button>
          </div>
        )}

      </div>
    </div>
  );
}
