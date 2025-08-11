
"use client";

import { Play, Pause, Repeat, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';

interface Template10Props {
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

export default function Template10({ data }: Template10Props) {
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
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 font-sans text-white overflow-hidden"
      onClick={handleInitialInteraction}
    >
      {mediaUrl && (
        <>
          {isVideo ? (
            <video ref={videoRef} src={mediaUrl} className="absolute inset-0 w-full h-full object-cover filter blur-lg scale-110" loop playsInline />
          ) : (
            <img src={mediaUrl} alt="Background" className="absolute inset-0 w-full h-full object-cover filter blur-lg scale-110" />
          )}
        </>
      )}
      
        {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline />}
        
        <div className="relative w-full max-w-sm h-full flex flex-col items-center justify-between py-12 bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl">
          <div className="w-full text-center">
              <p className="text-xs uppercase text-gray-300">Playing from your library</p>
              <div className="mt-1 h-14 flex items-center justify-center">
                <p className="text-white text-base font-normal">
                  {currentSubtitle.split('\n').map((line, index) => <span key={index} className="block">{line}</span>)}
                </p>
              </div>
          </div>
          
          <div className="w-10/12 aspect-[4/5] max-h-[400px] rounded-lg overflow-hidden shadow-2xl">
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

          <div className="w-10/12">
              <div className="w-full text-left">
                  <h3 className="text-2xl font-bold">{name}</h3>
                  <p className="text-base text-gray-300 font-light">Saywith</p>
              </div>

              <div className="w-full mt-4">
                  <Slider
                      defaultValue={[0]}
                      value={[progress]}
                      onValueChange={handleSeek}
                      max={100}
                      step={1}
                      className="w-full h-1"
                  />
                  <div className="flex justify-between text-xs text-gray-300 mt-1">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                  </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                  <button className="text-gray-300 hover:text-white transition-colors" aria-label="Shuffle"><Shuffle size={20} /></button>
                  <button onClick={(e) => { e.stopPropagation(); seek(-5); }} className="text-gray-300 hover:text-white transition-colors" aria-label="Rewind"><SkipBack size={28} /></button>
                  <button onClick={handlePlayPause} className="w-16 h-16 rounded-full bg-white flex justify-center items-center text-black" aria-label="Play/Pause">
                      {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); seek(5); }} className="text-gray-300 hover:text-white transition-colors" aria-label="Fast Forward"><SkipForward size={28} /></button>
                  <button className="text-green-500 hover:text-green-400 transition-colors" aria-label="Repeat"><Repeat size={20} /></button>
              </div>
          </div>
        </div>
    </div>
  );
}
