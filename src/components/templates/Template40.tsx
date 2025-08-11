
"use client";

import { Pause, Play } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';

interface Template40Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template40({ data }: Template40Props) {
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
      className="w-full h-screen relative flex flex-col items-center justify-center p-8 bg-black text-white overflow-hidden"
    >
      {mediaUrl && (
        <>
          {isVideo ? (
            <video ref={videoRef} src={mediaUrl} className="absolute inset-0 w-full h-full object-cover" loop playsInline />
          ) : (
            <img src={mediaUrl} alt="background" className="absolute inset-0 w-full h-full object-cover" />
          )}
        </>
      )}
       <div className="absolute inset-0 bg-black/50"/>
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline/>}
      
      <div className="relative w-full h-full flex flex-col items-center justify-center animate-fade-in">
        <div className="flex-grow flex items-center justify-center w-full">
            <div className="text-center">
                {currentSubtitle.split('\n').map((line, index) => (
                    <p key={index} className="text-3xl font-bold drop-shadow-lg leading-tight">
                        {line}
                    </p>
                ))}
            </div>
        </div>

        <div className="w-full flex-shrink-0 flex items-center justify-center">
          <div className="bg-black/40 backdrop-blur-sm rounded-full p-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                   {mediaUrl && (
                     <>
                       {isVideo ? (
                          <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" loop playsInline />
                      ) : (
                          <img src={mediaUrl} alt="Album Art" className="w-full h-full object-cover" />
                      )}
                     </>
                   )}
              </div>
              <div className="overflow-hidden pr-2">
                  <p className="text-sm font-bold truncate">{name}</p>
              </div>
              <button onClick={handlePlayPause} className="flex-shrink-0 bg-white/20 rounded-full p-2">
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
