
"use client";

import { Play } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';

interface Template31Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template31({ data }: Template31Props) {
  const { name, mediaUrl } = data;
  const {
    isPlaying,
    currentSubtitle,
    progress,
    videoRef,
    audioRef,
    isVideo,
    useVideoAsAudioSource,
    handleInitialInteraction,
  } = useSaywithPlayer(data);

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 bg-black text-white overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
      onClick={handleInitialInteraction}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
      `}</style>
      
      {mediaUrl && (
        <div className="absolute inset-0 w-full h-full">
          {isVideo ? (
            <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" loop playsInline />
          ) : (
            <img src={mediaUrl} alt="background" className="w-full h-full object-cover" />
          )}
          <div className={`video-cover ${isPlaying || !isVideo ? 'hidden' : ''}`} />
        </div>
      )}
      <div className="absolute inset-0 bg-black/20" />
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline/>}
      
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <Play size={64} className="text-white/70" fill="white" />
        </div>
      )}
      
      <div className="relative w-full h-full flex flex-col justify-between p-4 z-10">
        <div className="w-full">
            <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex items-center gap-2 mt-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                    {mediaUrl && <img src={mediaUrl} alt="avatar" className="w-full h-full object-cover"/>}
                </div>
                <p className="text-sm font-bold">{name}</p>
                <p className="text-sm text-white/70">Saywith</p>
            </div>
        </div>

        <div className="w-full text-center">
            {currentSubtitle.split('\n').map((line, index) => (
                <p key={index} className="text-2xl font-bold bg-black/40 backdrop-blur-sm px-4 py-2 rounded-md inline animate-fade-in" style={{animationDelay: `${index * 150}ms`, WebkitBoxDecorationBreak: 'clone'}}>
                    {line}
                </p>
            ))}
        </div>
        
        <div className="w-full h-12" />
      </div>
    </div>
  );
}
