
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Heart } from 'lucide-react';

interface Template15Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

interface SrtLine {
  startTime: number;
  endTime: number;
  text: string;
}

const parseSrt = (srtText: string): SrtLine[] => {
    if (!srtText) return [];
    const lines = srtText.trim().split(/\r?\n/);
    const entries: SrtLine[] = [];
    let i = 0;
    while (i < lines.length) {
        if (lines[i] && lines[i].match(/^\d+$/)) {
            i++;
            if (!lines[i]) continue;
            const timeMatch = lines[i].match(/(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})/);
            if (timeMatch) {
                const [, h1, m1, s1, ms1, h2, m2, s2, ms2] = timeMatch.map(Number);
                const startTime = h1 * 3600 + m1 * 60 + s1 + ms1 / 1000;
                const endTime = h2 * 3600 + m2 * 60 + s2 + ms2 / 1000;
                i++;
                let text = '';
                while (i < lines.length && lines[i] && lines[i].trim() !== '') {
                    text += (text ? '\n' : '') + lines[i];
                    i++;
                }
                entries.push({ startTime, endTime, text });
            }
        }
        i++;
    }
    return entries;
};

export default function Template15({ data }: Template15Props) {
  const { mediaUrl, audioUrl, srtContent, name, mute } = data;
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitles, setSubtitles] = useState<SrtLine[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [userInteracted, setUserInteracted] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = mediaUrl?.includes('.mp4') || mediaUrl?.includes('.mov') || mediaUrl?.includes('video');
  const useVideoAsAudioSource = isVideo && mute === false;

  const playMedia = useCallback(() => {
    const audio = audioRef.current;
    const video = videoRef.current;
    let playPromise: Promise<void> | undefined;

    if (useVideoAsAudioSource && video) {
        playPromise = video.play();
    } else {
        if (video) video.play();
        if (audio) playPromise = audio.play();
    }
    
    if(playPromise){
      playPromise.then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error("Error playing media:", error);
        setIsPlaying(false);
      });
    }
  }, [useVideoAsAudioSource]);

  const pauseMedia = useCallback(() => {
    videoRef.current?.pause();
    if (!useVideoAsAudioSource) audioRef.current?.pause();
    setIsPlaying(false);
  }, [useVideoAsAudioSource]);

  const handleInitialInteraction = useCallback(() => {
    if (userInteracted) return;
    setUserInteracted(true);
    playMedia();
  }, [userInteracted, playMedia]);

  const handlePlayPause = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userInteracted) {
      handleInitialInteraction();
    } else if (isPlaying) {
      pauseMedia();
    } else {
      playMedia();
    }
  }, [isPlaying, playMedia, pauseMedia, userInteracted, handleInitialInteraction]);

  useEffect(() => {
    if (srtContent) {
      setSubtitles(parseSrt(srtContent));
    }
  }, [srtContent]);

  useEffect(() => {
    const video = videoRef.current;

    if(video) {
        video.loop = true;
        video.playsInline = true;
        video.muted = useVideoAsAudioSource ? false : (mute ?? true);
    }
    
    const audioSource = useVideoAsAudioSource ? videoRef.current : audioRef.current;
    if (!audioSource) return;

    const timeUpdateHandler = () => {
      const currentTime = audioSource.currentTime;
      const duration = audioSource.duration;
      if (duration > 0) {
        setProgress((currentTime / duration) * 100);
      }
      const activeLine = subtitles.find(line => currentTime >= line.startTime && currentTime < line.endTime);
      setCurrentSubtitle(activeLine ? activeLine.text : '');
    };

    const handleAudioEnd = () => {
      setIsPlaying(false);
      if (audioSource) { audioSource.currentTime = 0; }
      if (videoRef.current && !useVideoAsAudioSource) videoRef.current.currentTime = 0;
      playMedia();
    }

    audioSource.addEventListener('timeupdate', timeUpdateHandler);
    audioSource.addEventListener('ended', handleAudioEnd);

    return () => {
      if (audioSource) {
        audioSource.removeEventListener('timeupdate', timeUpdateHandler);
        audioSource.removeEventListener('ended', handleAudioEnd);
      }
    };
  }, [subtitles, playMedia, mute, useVideoAsAudioSource]);

  return (
    <div 
      className="w-full h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-red-200 via-rose-200 to-amber-100 font-sans overflow-hidden"
      onClick={handleInitialInteraction}
    >
      {audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={audioUrl} loop playsInline />}
      
      <div className="w-full max-w-md flex flex-col items-center justify-center text-center">
        {/* Heart-shaped media container */}
        <div 
            className="relative w-full aspect-square max-w-[350px] flex items-center justify-center"
            style={{ clipPath: 'url(#heart-clip)' }}
            onClick={handlePlayPause}
        >
          {mediaUrl && (
            <>
              {isVideo ? (
                <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" loop playsInline />
              ) : (
                <img src={mediaUrl} alt="Heart" className="w-full h-full object-cover" />
              )}
            </>
          )}
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Heart size={64} className={`transition-all duration-300 ${isPlaying ? 'fill-white text-white' : 'text-white'}`} />
          </div>
        </div>
        
        <div className="mt-8 text-center w-full">
           <h1 className="text-3xl font-bold text-rose-800">{name}</h1>
           <div className="h-14 mt-2">
              {currentSubtitle.split('\n').map((line, index) => (
                <p key={index} className="text-xl text-rose-700/80 leading-tight">{line}</p>
              ))}
            </div>
        </div>

         <div className="w-full max-w-xs mt-4">
            <div className="w-full h-1 bg-rose-200 rounded-full">
            <div className="h-1 bg-rose-400 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        </div>

      </div>
      
      {/* SVG clip-path definition */}
      <svg width="0" height="0">
        <defs>
          <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,1 C 0.5,1,0,0.7,0,0.3 A 0.25,0.25,0,0,1,0.5,0.3 A 0.25,0.25,0,0,1,1,0.3 C 1,0.7,0.5,1,0.5,1 Z" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}
