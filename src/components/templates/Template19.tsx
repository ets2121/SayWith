
"use client";

import { ThumbsDown, ThumbsUp, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';

interface Template19Props {
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

export default function Template19({ data }: Template19Props) {
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

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-end p-4 font-sans text-white bg-black overflow-hidden"
      onClick={handleInitialInteraction}
    >
      {mediaUrl && (
        <div className="absolute inset-0 w-full h-full">
          {isVideo ? (
            <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" loop playsInline />
          ) : (
            <img src={mediaUrl} alt="Background" className="w-full h-full object-cover" />
          )}
           <div className={`video-cover ${isPlaying || !isVideo ? 'hidden' : ''}`} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline />}
      
      <div className="relative w-full max-w-lg flex flex-col items-center justify-center pb-8 z-10">
        
        <div className="w-full mt-6 text-center">
            <h3 className="text-3xl font-bold tracking-tight">{name}</h3>
            <p className="text-lg text-gray-300 font-light mt-1">Saywith</p>
            <div className="text-gray-300 font-light mt-4 h-10 flex items-center justify-center">
              {currentSubtitle.split('\n').map((line, index) => <p key={index} className="text-base">{line}</p>)}
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
            <button onClick={handlePlayPause} className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex justify-center items-center text-white" aria-label="Play/Pause">
                {isPlaying ? <Pause size={48} /> : <Play size={48} className="ml-1" />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); seek(10); }} className="text-gray-300 hover:text-white transition-colors" aria-label="Fast Forward"><SkipForward size={32} /></button>
            <button className="text-gray-300 hover:text-white transition-colors" aria-label="Like"><ThumbsUp size={24} /></button>
        </div>
      </div>
    </div>
  );
}
