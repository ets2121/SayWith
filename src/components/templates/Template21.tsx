
"use client";

import { Play, Pause, SkipBack, SkipForward, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { Slider } from '@/components/ui/slider';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';

interface Template21Props {
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

export default function Template21({ data }: Template21Props) {
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
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 font-sans bg-gray-100 overflow-hidden"
      onClick={handleInitialInteraction}
    >
      {mediaUrl && (
        <>
          {isVideo ? (
            <video ref={videoRef} src={mediaUrl} className="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-125 opacity-30" loop playsInline />
          ) : (
            <Image src={mediaUrl} alt="Background" layout="fill" className="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-125 opacity-30" />
          )}
        </>
      )}
      
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline />}
      
      <div className="relative w-full max-w-sm flex flex-col items-center justify-center space-y-6">
        <div className="w-full aspect-square max-w-[320px] rounded-lg overflow-hidden shadow-lg">
            {mediaUrl && (
              <>
                {isVideo ? (
                    <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" loop playsInline />
                ) : (
                    <Image src={mediaUrl} alt="Album Art" width={384} height={384} className="w-full h-full object-cover" />
                )}
              </>
            )}
        </div>

        <div className="w-full text-center">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">{name}</h3>
            <p className="text-lg text-red-500 font-light mt-1">Saywith</p>
        </div>
        
        <div className="w-full text-center text-gray-500 font-medium h-12 flex items-center justify-center">
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
            <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>-{formatTime(duration - currentTime)}</span>
            </div>
        </div>

        <div className="flex justify-between items-center w-full px-6">
            <button onClick={(e) => { e.stopPropagation(); seek(-10); }} className="text-gray-700 hover:text-black transition-colors" aria-label="Rewind"><SkipBack size={32} fill="currentColor" /></button>
            <button onClick={handlePlayPause} className="w-20 h-20 rounded-full bg-gray-100 shadow-md flex justify-center items-center text-gray-800" aria-label="Play/Pause">
                {isPlaying ? <Pause size={40} fill="currentColor"/> : <Play size={40} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); seek(10); }} className="text-gray-700 hover:text-black transition-colors" aria-label="Fast Forward"><SkipForward size={32} fill="currentColor" /></button>
        </div>
      </div>
    </div>
  );
}
