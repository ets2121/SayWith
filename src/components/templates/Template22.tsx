
"use client";

import { Play, Pause, SkipBack, SkipForward, Share2, MessageSquare } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';

interface Template22Props {
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

export default function Template22({ data }: Template22Props) {
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
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 font-sans bg-gradient-to-b from-[#2c2c2c] to-[#121212] text-white overflow-hidden"
      onClick={handleInitialInteraction}
    >
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline />}
      
      <div className="relative w-full max-w-sm flex flex-col items-center justify-center space-y-5">
        <div className="w-full aspect-square max-w-[340px] rounded-lg overflow-hidden shadow-2xl">
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

        <div className="w-full text-center">
            <h3 className="text-2xl font-bold tracking-tight">{name}</h3>
            <p className="text-base text-gray-400 font-light mt-1">Saywith</p>
        </div>
        
        <div className="w-full text-center text-gray-300 font-normal h-12 flex items-center justify-center">
          <p>
            {currentSubtitle.split('\n').map((line, index) => <span key={index} className="block">{line}</span>)}
          </p>
        </div>

        <div className="w-full">
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

        <div className="flex justify-between items-center w-full px-4">
            <button className="text-gray-400 hover:text-white transition-colors" aria-label="Comment"><MessageSquare size={22} /></button>
            <button onClick={(e) => { e.stopPropagation(); seek(-10); }} className="text-gray-300 hover:text-white transition-colors" aria-label="Rewind"><SkipBack size={30} fill="currentColor" /></button>
            <button onClick={handlePlayPause} className="w-16 h-16 rounded-full bg-blue-500 flex justify-center items-center text-white shadow-lg hover:bg-blue-600 transition-colors" aria-label="Play/Pause">
                {isPlaying ? <Pause size={32} fill="currentColor"/> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); seek(10); }} className="text-gray-300 hover:text-white transition-colors" aria-label="Fast Forward"><SkipForward size={30} fill="currentColor" /></button>
            <button className="text-gray-400 hover:text-white transition-colors" aria-label="Share"><Share2 size={22} /></button>
        </div>
      </div>
    </div>
  );
}
