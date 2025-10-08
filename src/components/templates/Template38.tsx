
"use client";

import { Pause, Play } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { useRef, useEffect } from 'react';

interface Template38Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template38({ data }: Template38Props) {
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
  } = useSaywithPlayer(data);

  const smallVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mainVideo = videoRef.current;
    const smallVideo = smallVideoRef.current;
    if (mainVideo && smallVideo) {
      if (isPlaying) {
        mainVideo.play().catch(console.error);
        smallVideo.play().catch(console.error);
      } else {
        mainVideo.pause();
        smallVideo.pause();
      }
    } else if (mainVideo) { // Handle case where only main video exists (e.g. background is an image)
        if (isPlaying) mainVideo.play().catch(console.error);
        else mainVideo.pause();
    }
  }, [isPlaying, videoRef]);

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 bg-black text-white overflow-hidden"
      onClick={handleInitialInteraction}
    >
      {mediaUrl && (
        <div className="absolute inset-0 w-full h-full">
          {isVideo ? (
            <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" loop playsInline />
          ) : (
            <img src={mediaUrl} alt="background" className="w-full h-full object-cover" />
          )}
          <div className={`video-cover ${isPlaying || !isVideo ? 'hidden' : ''}`} />
        </div>
      )}
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline/>}
      
      <div className="relative w-full max-w-sm flex flex-col items-center justify-center space-y-4 animate-fade-in-up">
        <div className="w-full bg-white/10 backdrop-blur-xl rounded-lg p-3 flex items-center gap-3 border border-white/20">
            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                 {mediaUrl && (
                   <>
                     {isVideo ? (
                        <video ref={smallVideoRef} src={mediaUrl} className="w-full h-full object-cover" loop playsInline muted />
                    ) : (
                        <img src={mediaUrl} alt="Album Art" className="w-full h-full object-cover" />
                    )}
                   </>
                 )}
                 <div className={`video-cover ${isPlaying || !isVideo ? 'hidden' : ''} rounded-md`} />
            </div>
            <div className="flex-grow overflow-hidden">
                <p className="text-sm font-bold truncate">{name}</p>
                <p className="text-xs text-white/70 truncate">Saywith</p>
                <div className="w-full h-1 bg-white/30 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-white" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <button onClick={handlePlayPause} className="flex-shrink-0">
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
        </div>
        <div className="w-full text-center min-h-[56px] px-2 py-1 bg-black/20 backdrop-blur-md rounded-md">
            {currentSubtitle.split('\n').map((line, index) => (
                <p key={index} className="text-xl font-medium drop-shadow-md">
                    {line}
                </p>
            ))}
        </div>
      </div>
    </div>
  );
}
