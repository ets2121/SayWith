
"use client";

import { Play, Pause, Rewind, FastForward } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';

interface Template23Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template23({ data }: Template23Props) {
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
    seek,
  } = useSaywithPlayer(data);

  const glowStyle = {
    textShadow: '0 0 8px rgba(0, 255, 255, 0.7), 0 0 12px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3)',
  };

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 bg-black text-cyan-300 overflow-hidden font-['Orbitron',_sans-serif]"
      style={{ background: 'radial-gradient(circle, #001f3f 0%, #000 70%)' }}
      onClick={handleInitialInteraction}
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')] opacity-10" />
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline />}
      
      <div className="relative w-full max-w-sm flex flex-col items-center justify-center space-y-6 z-10">
        <div 
          className="w-full aspect-square max-w-[320px] rounded-lg overflow-hidden p-1"
          style={{ 
            background: 'rgba(0, 100, 100, 0.1)',
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.3), 0 0 25px rgba(0, 255, 255, 0.2), inset 0 0 10px rgba(0, 255, 255, 0.2)',
            border: '1px solid rgba(0, 255, 255, 0.3)',
          }}
        >
            {mediaUrl && (
              <>
                {isVideo ? (
                    <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover rounded-md" loop playsInline />
                ) : (
                    <img src={mediaUrl} alt="Album Art" className="w-full h-full object-cover rounded-md" />
                )}
              </>
            )}
        </div>

        <div className="w-full text-center">
            <h3 className="text-2xl font-bold tracking-wider" style={glowStyle}>{name}</h3>
            <p className="text-sm text-cyan-400 font-light mt-1 uppercase" style={{...glowStyle, textShadow: glowStyle.textShadow.replace(/255/g, '200')}}>Saywith</p>
        </div>
        
        <div className="w-full text-center text-cyan-300 font-normal h-12 flex items-center justify-center">
          <p style={{ textShadow: '0 0 5px rgba(0, 255, 255, 0.5)'}}>
            {currentSubtitle.split('\n').map((line, index) => <span key={index} className="block">{line}</span>)}
          </p>
        </div>

        <div className="w-full">
            <div className="w-full h-1.5 bg-cyan-900/50 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400" style={{ width: `${progress}%`, boxShadow: '0 0 8px rgba(0, 255, 255, 0.7)' }}></div>
            </div>
        </div>

        <div className="flex justify-evenly items-center w-full px-6">
            <button onClick={(e) => { e.stopPropagation(); seek(-10); }} className="text-cyan-400 hover:text-white transition-all duration-300" style={glowStyle} aria-label="Rewind"><Rewind size={32} /></button>
            <button onClick={handlePlayPause} className="w-16 h-16 rounded-full bg-cyan-400/20 border-2 border-cyan-400 text-cyan-300 flex justify-center items-center shadow-[0_0_15px_rgba(0,255,255,0.5)] hover:bg-cyan-400/40 hover:text-white transition-all duration-300" aria-label="Play/Pause">
                {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); seek(10); }} className="text-cyan-400 hover:text-white transition-all duration-300" style={glowStyle} aria-label="Fast Forward"><FastForward size={32} /></button>
        </div>
      </div>
    </div>
  );
}
