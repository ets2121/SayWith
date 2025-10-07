
"use client";

import { Pause, Play } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { type SaywithData } from '@/app/fr/[id]/page';

interface Template8Props {
  data: SaywithData;
}

export default function Template8({ data }: Template8Props) {
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
      className="w-full h-screen bg-gradient-to-b from-red-500 to-orange-500 flex flex-col items-center justify-center p-4 font-body overflow-hidden"
      onClick={handleInitialInteraction}
    >
        {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline />}
        <div className="w-full max-w-sm h-full flex flex-col items-center justify-center">

            <div className="text-lg font-thin text-black w-full text-center">{name}</div>
            
            <div className="mt-4 w-full aspect-square max-h-[350px] rounded-lg overflow-hidden">
                {mediaUrl && (
                  <>
                    {isVideo ? (
                        <video ref={videoRef} src={mediaUrl} className="w-full h-full object-contain" loop playsInline />
                    ) : (
                        <img src={mediaUrl} alt="background" className="w-full h-full object-contain" />
                    )}
                  </>
                )}
            </div>

            <div className="mt-6 text-sm font-thin text-black w-full text-center h-10 flex items-center justify-center px-4">
                <div className="h-full">
                  {currentSubtitle.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                  ))}
                </div>
            </div>
            
            <div className="mt-4 w-full max-w-[200px] flex-shrink-0">
                <p className="text-xs text-black mb-2">you are my favorite song</p>
                <div className="relative w-full h-0.5 bg-black">
                    <div 
                        className="absolute top-[-3px] w-2 h-2 rounded-full bg-black"
                        style={{ left: `${progress}%`}}
                    ></div>
                </div>
                <div className="flex justify-center gap-5 mt-2.5">
                    <div className="h-10 flex items-center">
                        <button onClick={(e) => { e.stopPropagation(); seek(-5); }} className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[20px] border-r-black" aria-label="Rewind"></button>
                    </div>
                    <button onClick={handlePlayPause} className="w-10 h-10 rounded-full bg-black flex justify-center items-center text-white" aria-label="Play/Pause">
                        {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                    </button>
                    <div className="h-10 flex items-center">
                        <button onClick={(e) => { e.stopPropagation(); seek(5); }} className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[20px] border-l-black" aria-label="Fast Forward"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
