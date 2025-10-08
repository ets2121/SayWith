
"use client";

import { ThumbsDown, ThumbsUp, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { useRef, useEffect } from 'react';

interface Template17Props {
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

export default function Template17({ data }: Template17Props) {
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

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 font-sans text-white overflow-hidden bg-black"
      onClick={handleInitialInteraction}
    >
      {mediaUrl && (
        <div className="absolute inset-0 w-full h-full">
        {isVideo ? (
          <video ref={backgroundVideoRef} src={mediaUrl} className="w-full h-full object-cover filter blur-2xl scale-125 opacity-50" loop playsInline muted />
        ) : (
          <img src={mediaUrl} alt="Background" className="w-full h-full object-cover filter blur-2xl scale-125 opacity-50" />
        )}
         <div className={`video-cover ${isPlaying || !isVideo ? 'hidden' : ''}`} />
        </div>
      )}
      
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline />}
      
      <div className="relative w-full max-w-md h-full flex flex-col items-center justify-center py-8">
        <div className="relative w-full aspect-square max-h-[350px] rounded-lg overflow-hidden shadow-2xl">
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

        <div className="w-full mt-6 text-center">
            <h3 className="text-2xl font-bold tracking-tight">{name}</h3>
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
                className="w-full h-1.5"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>

        <div className="flex justify-between items-center mt-4 w-full px-2">
            <button className="text-gray-300 hover:text-white transition-colors" aria-label="Dislike"><ThumbsDown size={24} /></button>
            <button onClick={(e) => { e.stopPropagation(); seek(-10); }} className="text-gray-300 hover:text-white transition-colors" aria-label="Rewind"><SkipBack size={32} /></button>
            <button onClick={handlePlayPause} className="w-20 h-20 rounded-full bg-white flex justify-center items-center text-black" aria-label="Play/Pause">
                {isPlaying ? <Pause size={48} /> : <Play size={48} className="ml-1" />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); seek(10); }} className="text-gray-300 hover:text-white transition-colors" aria-label="Fast Forward"><SkipForward size={32} /></button>
            <button className="text-gray-300 hover:text-white transition-colors" aria-label="Like"><ThumbsUp size={24} /></button>
        </div>
      </div>
    </div>
  );
}
