
"use client";

import { Play } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';

interface Template32Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template32({ data }: Template32Props) {
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
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 bg-black text-white overflow-hidden"
      onClick={handleInitialInteraction}
    >
       {mediaUrl && (
         <>
           {isVideo ? (
            <video ref={videoRef} src={mediaUrl} className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-110" loop playsInline />
          ) : (
            <img src={mediaUrl} alt="background" className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-110" />
          )}
         </>
       )}
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline/>}
      
      <div className="relative w-full max-w-sm h-4/5 flex flex-col justify-center items-center">
        <div className="relative w-full h-full">
            {mediaUrl && (
              <>
                {isVideo ? (
                    <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover rounded-2xl shadow-2xl" loop playsInline />
                ) : (
                    <img src={mediaUrl} alt="background" className="w-full h-full object-cover rounded-2xl shadow-2xl" />
                )}
              </>
            )}
             {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl pointer-events-none">
                    <Play size={64} className="text-white/80" fill="white"/>
                </div>
            )}
        </div>


        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-4/5 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-1 rounded-2xl shadow-lg transform rotate-[-5deg]">
          <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                    {mediaUrl && <img src={mediaUrl} alt="avatar" className="w-full h-full object-cover"/>}
                </div>
                <p className="text-xs font-bold">{name}</p>
            </div>
            <div className="min-h-[48px] text-center">
                {currentSubtitle.split('\n').map((line, index) => (
                    <p key={index} className="text-lg font-bold animate-fade-in">
                        {line}
                    </p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
