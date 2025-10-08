
"use client";

import { ThumbsDown, ThumbsUp, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { useRef, useEffect } from 'react';

interface Template20Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}


const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function Template20({ data }: Template20Props) {
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
    handleSeek,
  } = useSaywithPlayer(data);

  const backgroundVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const backgroundVideo = backgroundVideoRef.current;
    if (backgroundVideo) {
      if (isPlaying) {
        backgroundVideo.play().catch(console.error);
      } else {
        backgroundVideo.pause();
      }
    }
  }, [isPlaying]);

  const neonColor = 'text-cyan-400';
  const neonShadow = 'drop-shadow-[0_0_8px_rgba(0,255,255,0.7)]';
  
  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 font-sans text-white overflow-hidden bg-[#0a0a0a]"
      onClick={handleInitialInteraction}
    >
      <style jsx global>{`
        .neon-slider .bg-secondary {
          background-color: #083344;
        }
        .neon-slider .bg-primary {
          background-color: #06b6d4;
        }
        .neon-slider .border-primary {
           border-color: #06b6d4;
        }
        .neon-slider .ring-ring:focus-visible {
           --tw-ring-color: #06b6d4;
        }
      `}</style>
      {mediaUrl && (
        isVideo ? (
          <video ref={backgroundVideoRef} src={mediaUrl} className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-125 opacity-30 video-poster-fallback" loop playsInline muted />
        ) : (
          <img src={mediaUrl} alt="Background" className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-125 opacity-30" />
        )
      )}
      
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline />}
      
      <div className="relative w-full max-w-md h-full flex flex-col items-center justify-center py-8">
        <div className={`w-full aspect-square max-h-[350px] rounded-lg overflow-hidden shadow-2xl ${neonShadow}`}>
            {mediaUrl && (
              <>
                {isVideo ? (
                    <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover video-poster-fallback" loop playsInline />
                ) : (
                    <img src={mediaUrl} alt="Album Art" className="w-full h-full object-cover" />
                )}
              </>
            )}
        </div>

        <div className="w-full mt-6 text-center">
            <h3 className={`text-2xl font-bold tracking-tight ${neonColor} ${neonShadow}`}>{name}</h3>
            <p className="text-base text-gray-300 font-light mt-1">Saywith</p>
            <div className="text-gray-300 font-light mt-2 h-10 flex items-center justify-center">
              {currentSubtitle.split('\n').map((line, index) => <p key={index} className="text-sm">{line}</p>)}
            </div>
        </div>

        <div className="w-full mt-4">
            <Slider
                defaultValue={[0]}
                value={[progress]}
                onValueChange={handleSeek}
                max={100}
                step={1}
                className="w-full h-1.5 neon-slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>

        <div className="flex justify-between items-center mt-4 w-full px-2">
            <button className={`text-gray-400 hover:${neonColor} transition-colors`} aria-label="Dislike"><ThumbsDown size={24} /></button>
            <button onClick={(e) => { e.stopPropagation(); seek(-10); }} className={`text-gray-400 hover:${neonColor} transition-colors`} aria-label="Rewind"><SkipBack size={32} /></button>
            <button onClick={handlePlayPause} className={`w-20 h-20 rounded-full bg-cyan-400/20 border border-cyan-400 flex justify-center items-center ${neonColor} ${neonShadow}`} aria-label="Play/Pause">
                {isPlaying ? <Pause size={48} /> : <Play size={48} className="ml-1" />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); seek(10); }} className={`text-gray-400 hover:${neonColor} transition-colors`} aria-label="Fast Forward"><SkipForward size={32} /></button>
            <button className={`text-gray-400 hover:${neonColor} transition-colors`} aria-label="Like"><ThumbsUp size={24} /></button>
        </div>
      </div>
    </div>
  );
}
