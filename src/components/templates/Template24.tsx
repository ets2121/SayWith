
"use client";

import { Play, Pause } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';

interface Template24Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template24({ data }: Template24Props) {
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
    handlePlayPause,
  } = useSaywithPlayer(data);

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 bg-[#0a0f1e] text-gray-200 overflow-hidden"
      style={{ fontFamily: "'Exo 2', sans-serif" }}
      onClick={handleInitialInteraction}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;700&display=swap');
        .orbital-progress {
          stroke-dasharray: 1068; /* circumference of circle with r=170 */
          stroke-dashoffset: ${1068 * (1 - (progress/100))};
          transition: stroke-dashoffset 0.1s linear;
        }
      `}</style>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline />}
      
      <div className="relative w-full max-w-sm flex flex-col items-center justify-center space-y-8 z-10">

        <div className="w-full text-center">
            <h3 className="text-3xl font-bold tracking-wider text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{name}</h3>
            <p className="text-lg text-gray-400 font-light mt-1">Saywith</p>
        </div>
        
        <div className="relative w-[300px] h-[300px] flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 360">
                <circle cx="180" cy="180" r="170" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
                <circle cx="180" cy="180" r="170" stroke="url(#gradient)" strokeWidth="8" fill="none" strokeLinecap="round"
                    className="orbital-progress"
                    transform="rotate(-90 180 180)"
                />
                 <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                </defs>
            </svg>

            <div 
              className="relative w-[280px] h-[280px] rounded-full overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.4),_inset_0_0_20px_rgba(0,0,0,0.5)]"
              onClick={handlePlayPause}
              >
              {mediaUrl && (
                <>
                  {isVideo ? (
                      <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" loop playsInline />
                  ) : (
                      <img src={mediaUrl} alt="Album Art" className="w-full h-full object-cover" />
                  )}
                </>
              )}
               <div className={`video-cover ${isPlaying || !isVideo ? 'hidden' : ''}`} />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  {isPlaying ? <Pause size={60} /> : <Play size={60} className="ml-2" />}
              </div>
            </div>
        </div>
        
        <div className="w-full text-center text-gray-300 font-light h-12 flex items-center justify-center">
          <p>
            {currentSubtitle.split('\n').map((line, index) => <span key={index} className="block">{line}</span>)}
          </p>
        </div>
      </div>
    </div>
  );
}
