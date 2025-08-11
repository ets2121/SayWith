
"use client";

import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';

interface Template12Props {
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

export default function Template12({ data }: Template12Props) {
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
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 font-sans bg-gradient-to-br from-yellow-200 via-pink-300 to-blue-400 overflow-hidden"
      onClick={handleInitialInteraction}
    >
        {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline />}
        
        <div className="relative w-full max-w-xs flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-2xl">
          <div className="w-full aspect-square rounded-lg overflow-hidden shadow-lg">
              {mediaUrl && (
                <>
                  {isVideo ? (
                      <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" loop playsInline />
                  ) : (
                      <img src={mediaUrl} alt="Album Art" className="w-full h-full object-cover" />
                  )}
                </>
              )}
          </div>

          <div className="w-full mt-6 text-center">
              <h3 className="text-2xl font-bold text-gray-800">{name}</h3>
              <div className="text-gray-500 font-light mt-2 h-10 flex items-center justify-center">
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
                  className="w-full h-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
              </div>
          </div>

          <div className="flex justify-between items-center mt-4 w-full px-4">
              <button onClick={(e) => { e.stopPropagation(); seek(-5); }} className="text-gray-500 hover:text-gray-800 transition-colors" aria-label="Rewind"><SkipBack size={24} /></button>
              <button onClick={handlePlayPause} className="w-16 h-16 rounded-full bg-pink-500 flex justify-center items-center text-white shadow-lg hover:bg-pink-600 transition-all scale-100 hover:scale-105" aria-label="Play/Pause">
                  {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); seek(5); }} className="text-gray-500 hover:text-gray-800 transition-colors" aria-label="Fast Forward"><SkipForward size={24} /></button>
          </div>
        </div>
    </div>
  );
}
