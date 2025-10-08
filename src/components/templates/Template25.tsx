
"use client";

import { Play, Pause, SkipBack, SkipForward, Power } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';

interface Template25Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template25({ data }: Template25Props) {
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

  const GlitchText = ({ text }: { text: string }) => (
    <div className="glitch-text" data-text={text}>
      {text}
    </div>
  );

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 bg-black text-[#f0f] overflow-hidden"
      style={{ fontFamily: "'Share Tech Mono', monospace" }}
      onClick={handleInitialInteraction}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        .glitch-text {
          position: relative;
          text-shadow: 0.05em 0 0 #0ff, -0.025em -0.05em 0 #ff0, 0.025em 0.05em 0 #0f0;
          animation: glitch 500ms infinite;
        }

        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0.8;
        }

        .glitch-text::before {
          animation: glitch 650ms infinite;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          transform: translate(-0.05em, -0.025em);
          color: #0ff;
        }

        .glitch-text::after {
          animation: glitch 350ms infinite;
          clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
          transform: translate(0.05em, 0.025em);
          color: #ff0;
        }

        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-0.05em, 0.05em); }
          40% { transform: translate(-0.05em, -0.05em); }
          60% { transform: translate(0.05em, 0.05em); }
          80% { transform: translate(0.05em, -0.05em); }
          100% { transform: translate(0); }
        }
      `}</style>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] opacity-5" />
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline />}
      
      <div className="relative w-full max-w-md flex flex-col items-center justify-center space-y-4 z-10 border-2 border-cyan-400/50 bg-black/50 p-6 shadow-[0_0_20px_#0ff]">
        <div className="w-full flex justify-between items-center">
            <h3 className="text-2xl font-bold tracking-widest"><GlitchText text={name} /></h3>
            <Power size={24} className="text-red-500 animate-pulse" />
        </div>
        
        <div className="w-full aspect-video relative overflow-hidden p-1 bg-cyan-900/30 border border-cyan-400/50">
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
        </div>

        <div className="w-full text-center text-cyan-300 font-normal h-12 flex items-center justify-center border-y border-cyan-400/50 py-2">
          <p>
            {currentSubtitle.split('\n').map((line, index) => <span key={index} className="block">{line}</span>)}
          </p>
        </div>

        <div className="w-full">
            <div className="w-full h-1 bg-fuchsia-900/50">
                <div className="h-full bg-fuchsia-500" style={{ width: `${progress}%`, boxShadow: '0 0 8px #f0f' }}></div>
            </div>
        </div>

        <div className="flex justify-evenly items-center w-full">
            <button onClick={(e) => { e.stopPropagation(); seek(-10); }} className="text-cyan-400 hover:text-white transition-colors" aria-label="Rewind"><SkipBack size={32} /></button>
            <button onClick={handlePlayPause} className="w-14 h-14 border-2 border-fuchsia-500 text-fuchsia-500 flex justify-center items-center shadow-[0_0_15px_#f0f] hover:bg-fuchsia-500/40 hover:text-white transition-colors" aria-label="Play/Pause">
                {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); seek(10); }} className="text-cyan-400 hover:text-white transition-colors" aria-label="Fast Forward"><SkipForward size={32} /></button>
        </div>
      </div>
    </div>
  );
}
