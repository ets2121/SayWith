
"use client";

import Image from 'next/image';
import { Play } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';

interface Template34Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template34({ data }: Template34Props) {
  const { name, mediaUrl } = data;
  const {
    isPlaying,
    currentSubtitle,
    videoRef,
    audioRef,
    isVideo,
    useVideoAsAudioSource,
    handleInitialInteraction,
  } = useSaywithPlayer(data);

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 bg-yellow-50 text-gray-800 overflow-hidden"
      onClick={handleInitialInteraction}
    >
        <style jsx global>{`
            @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
        `}</style>

       {mediaUrl && (
         <>
           {isVideo ? (
            <video ref={videoRef} src={mediaUrl} className="absolute inset-0 w-full h-full object-cover opacity-30" loop playsInline />
          ) : (
            <Image src={mediaUrl} alt="background" layout="fill" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          )}
         </>
       )}
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline/>}
      
      <div className="relative w-full max-w-xs flex flex-col items-center justify-center animate-fade-in">
        <div className="bg-white p-4 pb-16 rounded-sm shadow-xl transform rotate-3">
            <div className="relative w-[250px] h-[250px] bg-gray-200">
                {mediaUrl && (
                  <>
                    {isVideo ? (
                        <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" loop playsInline />
                    ) : (
                        <Image src={mediaUrl} alt="Polaroid" layout="fill" className="w-full h-full object-cover" />
                    )}
                  </>
                )}
                 {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                        <Play size={48} className="text-white/80" fill="white" />
                    </div>
                )}
            </div>
        </div>

        <div className="mt-8 text-center w-full transform -rotate-2">
            <h1 className="text-2xl text-gray-700" style={{fontFamily: "'Special Elite', cursive"}}>{name}</h1>
            <div className="h-14 mt-2 min-h-[56px]">
                {currentSubtitle.split('\n').map((line, index) => (
                    <p key={index} className="text-lg text-gray-600 leading-tight" style={{fontFamily: "'Special Elite', cursive"}}>{line}</p>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
