
"use client";

import { Pause, Play } from 'lucide-react';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { useRef, useEffect } from 'react';

interface Template39Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

export default function Template39({ data }: Template39Props) {
  const { name, mediaUrl } = data;
  const {
    isPlaying,
    currentSubtitle,
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
    } else if (mainVideo) { // Handle case where only main video exists
        if (isPlaying) mainVideo.play().catch(console.error);
        else mainVideo.pause();
    }
  }, [isPlaying, videoRef]);

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-end p-8 bg-black text-white overflow-hidden"
      onClick={handleInitialInteraction}
    >
      {mediaUrl && (
        <>
          {isVideo ? (
            <video ref={videoRef} src={mediaUrl} className="absolute inset-0 w-full h-full object-cover video-poster-fallback" loop playsInline />
          ) : (
            <img src={mediaUrl} alt="background" className="absolute inset-0 w-full h-full object-cover" />
          )}
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"/>
      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop playsInline/>}
      
      <div className="relative w-full flex flex-col items-center justify-center space-y-6 z-10">
        <div className="w-full text-center min-h-[120px] flex flex-col justify-center">
            {currentSubtitle.split('\n').map((line, index) => (
              <p key={index} className="text-3xl font-bold drop-shadow-lg leading-tight animate-fade-in-up">
                  {line}
              </p>
            ))}
        </div>
        <div className="w-full max-w-sm bg-black/40 backdrop-blur-md rounded-full p-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                 {mediaUrl && (
                   <>
                     {isVideo ? (
                        <video ref={smallVideoRef} src={mediaUrl} className="w-full h-full object-cover video-poster-fallback" loop playsInline muted />
                    ) : (
                        <img src={mediaUrl} alt="Album Art" className="w-full h-full object-cover" />
                    )}
                   </>
                 )}
            </div>
            <div className="flex-grow overflow-hidden pr-2">
                <p className="text-sm font-bold truncate">{name}</p>
            </div>
            <button onClick={handlePlayPause} className="flex-shrink-0 bg-white/20 rounded-full p-2">
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
        </div>
      </div>
    </div>
  );
}
