
"use client";

import { Pause, Play } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { type SaywithData } from '@/app/fr/[id]/page';

interface Template6Props {
  data: SaywithData;
}

export default function Template6({ data }: Template6Props) {
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

  return (
    <div 
      className="w-full h-screen bg-gradient-to-b from-zinc-900 to-zinc-700 flex flex-col items-center justify-center p-4 font-body overflow-hidden"
      onClick={handleInitialInteraction}
    >
        {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline />}
        <div className="w-full max-w-sm h-full flex flex-col items-center justify-center">

            <div className="text-lg font-thin text-lime-400 w-full text-center">{name}</div>
            
            <div className="relative mt-4 w-full aspect-square max-h-[350px] rounded-lg overflow-hidden">
                {mediaUrl && (
                  <>
                    {isVideo ? (
                        <video ref={videoRef} src={mediaUrl} className="w-full h-full object-contain" loop playsInline />
                    ) : (
                        <img src={mediaUrl} alt="background" className="w-full h-full object-contain" />
                    )}
                  </>
                )}
                 <div className={`video-cover ${isPlaying || !isVideo ? 'hidden' : ''}`} />
            </div>

            <div className="mt-6 text-sm font-thin text-lime-400 w-full text-center h-10 flex items-center justify-center px-4">
                <div className="h-full">
                  {currentSubtitle.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                  ))}
                </div>
            </div>
            
            <div className="mt-4 w-full max-w-[200px] flex-shrink-0">
                <p className="text-xs text-lime-400 mb-2">you are my favorite song</p>
                <div className="relative w-full h-0.5 bg-lime-400">
                    <div 
                        className="absolute top-[-3px] w-2 h-2 rounded-full bg-lime-400"
                        style={{ left: `${progress}%`}}
                    ></div>
                </div>
                <div className="flex justify-center gap-5 mt-2.5">
                    <div className="h-10 flex items-center">
                        <button onClick={(e) => { e.stopPropagation(); seek(-5); }} className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[20px] border-r-lime-400" aria-label="Rewind"></button>
                    </div>
                    <button onClick={handlePlayPause} className="w-10 h-10 rounded-full bg-lime-400 flex justify-center items-center text-black" aria-label="Play/Pause">
                        {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                    </button>
                    <div className="h-10 flex items-center">
                        <button onClick={(e) => { e.stopPropagation(); seek(5); }} className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[20px] border-l-lime-400" aria-label="Fast Forward"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
