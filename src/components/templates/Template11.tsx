
"use client";

import { Play, Pause, FastForward, Rewind } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';

interface Template11Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function Template11({ data }: Template11Props) {
  const { name, mediaUrl } = data;
  const {
    isPlaying,
    currentSubtitle,
    progress,
    currentTime,
    duration,
    videoRef,
    audioRef,
    isVideo,
    useVideoAsAudioSource,
    handleInitialInteraction,
    handlePlayPause,
    seek,
  } = useSaywithPlayer(data);

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 font-sans bg-[#4a3a2a] overflow-hidden"
      style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/wood-pattern.png)' }}
      onClick={handleInitialInteraction}
    >
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline />}
        
      <div className="relative w-full max-w-sm h-full flex flex-col items-center justify-center py-8">
        <div className="w-full aspect-square max-w-[300px] relative flex items-center justify-center">
            <div className={`w-full h-full bg-black rounded-full flex items-center justify-center transition-transform duration-1000 ease-linear ${isPlaying ? 'animate-spin-slow' : ''}`}
                 style={{
                    boxShadow: '0 0 0 10px #222, 0 0 0 12px #444',
                    backgroundImage: 'repeating-radial-gradient(circle, #222, #222 1px, #111 1px, #111 2px)'
                }}>
                <div className="w-32 h-32 rounded-full overflow-hidden">
                    {mediaUrl && (
                      <>
                        {isVideo ? (
                          <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" loop playsInline/>
                        ) : (
                          <img src={mediaUrl} alt="Album Art" className="w-full h-full object-cover" />
                        )}
                      </>
                    )}
                </div>
            </div>
            <div className={`absolute top-2 -right-10 w-4 h-28 bg-gray-300 rounded-full transition-transform duration-500 ease-in-out origin-top-right ${isPlaying ? 'rotate-[25deg]' : 'rotate-0'}`}>
                <div className="w-6 h-6 bg-gray-400 rounded-full absolute -bottom-2 -left-1"></div>
            </div>
        </div>

        <div className="w-full mt-8 p-4 bg-[#e3dcd2] rounded-lg shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]">
          <div className="text-center">
              <h3 className="text-xl font-bold text-[#4a3a2a]">{name}</h3>
              <p className="text-sm text-gray-600 font-mono h-12 flex items-center justify-center">
                {currentSubtitle.split('\n').map((line, index) => <span key={index} className="block">{line}</span>)}
              </p>
          </div>

          <div className="w-full mt-4">
              <div className="h-2 bg-gray-400 rounded-full overflow-hidden relative">
                <div className="h-full bg-[#4a3a2a]" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
              </div>
          </div>

          <div className="flex justify-evenly items-center mt-4">
              <button onClick={(e) => { e.stopPropagation(); seek(-5); }} className="text-gray-700 hover:text-black transition-colors" aria-label="Rewind"><Rewind size={28} /></button>
              <button onClick={handlePlayPause} className="w-14 h-14 rounded-full bg-gray-700 flex justify-center items-center text-white shadow-md hover:bg-black transition-colors" aria-label="Play/Pause">
                  {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); seek(5); }} className="text-gray-700 hover:text-black transition-colors" aria-label="Fast Forward"><FastForward size={28} /></button>
          </div>
        </div>
      </div>
       <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
}
