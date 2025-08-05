
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Template1Props {
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

export default function Template1({ data }: Template1Props) {
  const { mediaUrl, audioUrl, srtContent, name, mute } = data;
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitles, setSubtitles] = useState<SrtLine[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [userInteracted, setUserInteracted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const isVideo = mediaUrl?.includes('.mp4') || mediaUrl?.includes('.mov') || mediaUrl?.includes('video');

  useEffect(() => {
    if (srtContent) {
      try {
        const parsedSubtitles = parseSrt(srtContent);
        setSubtitles(parsedSubtitles);
      } catch (error) {
        console.error("Failed to parse SRT data", error);
        setCurrentSubtitle("Could not load subtitles.");
      }
    }
  }, [srtContent]);

  const playMedia = useCallback(() => {
    if (!audioRef.current) return;
    
    const audioPromise = audioRef.current.play();
    const videoPromise = isVideo ? videoRef.current?.play() : Promise.resolve();
    
    if (audioPromise !== undefined) {
      Promise.all([audioPromise, videoPromise]).then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error("Error playing media:", error);
        // If autoplay fails, we'll wait for user interaction.
        setIsPlaying(false);
      });
    }
  }, [isVideo]);

  const pauseMedia = useCallback(() => {
    audioRef.current?.pause();
    if (isVideo) videoRef.current?.pause();
    setIsPlaying(false);
  }, [isVideo]);
  
  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseMedia();
    } else {
      playMedia();
    }
  }, [isPlaying, playMedia, pauseMedia]);

  const handleInitialInteraction = useCallback(() => {
    if (userInteracted) return;
    setUserInteracted(true);
    playMedia();
  }, [userInteracted, playMedia]);


  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const onVisChange = () => {
      if (document.hidden) {
        pauseMedia();
      } else if (isPlaying && userInteracted) {
        playMedia();
      }
    }
    document.addEventListener("visibilitychange", onVisChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisChange)
    }
  }, [pauseMedia, playMedia, isPlaying, userInteracted]);

  useEffect(() => {
    const video = videoRef.current;
    if(video) {
        video.muted = mute ?? false;
        video.loop = true;
        video.autoplay = true;
    }
  }, [mute]);


  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !subtitles.length) return;

    const timeUpdateHandler = () => {
        const currentTime = audio.currentTime;
        const activeLine = subtitles.find(line => currentTime >= line.startTime && currentTime < line.endTime);
        
        const newSubtitle = activeLine ? activeLine.text : '';

        setCurrentSubtitle(current => current === newSubtitle ? current : newSubtitle);
    };

    const handleAudioEnd = () => {
        setCurrentSubtitle('');
        setIsPlaying(false);
        if (audio) {
          audio.currentTime = 0;
        }
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
        }
        playMedia();
    }

    audio.addEventListener('timeupdate', timeUpdateHandler);
    audio.addEventListener('ended', handleAudioEnd);

    return () => {
        if (audio) {
          audio.removeEventListener('timeupdate', timeUpdateHandler);
          audio.removeEventListener('ended', handleAudioEnd);
        }
    };
  }, [subtitles, playMedia]);

  return (
    <div className="relative h-screen w-screen overflow-hidden font-sans" onClick={handleInitialInteraction}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10" />
      {isVideo ? (
        <video
          ref={videoRef}
          src={mediaUrl}
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <img
          src={mediaUrl}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <audio ref={audioRef} src={audioUrl} loop />

      <div className="relative z-20 flex flex-col h-full text-white pointer-events-none">
        <header className="text-center pt-8 animate-fade-in-down">
          <p className="font-headline text-lg font-semibold text-gray-200/95">{name}</p>
          <p className="text-xs font-light tracking-wider opacity-80">Saywith</p>
        </header>

        <main className="flex-grow flex items-center justify-center">
            <div className="text-center px-4">
                {!userInteracted && !isPlaying && (
                  <p className="text-sm font-light mb-4 animate-fade-in">Click anywhere to play</p>
                )}
                {currentSubtitle.split('\n').map((line, index) => (
                    <p key={`${currentSubtitle}-${index}`} className="text-xl md:text-2xl font-serif font-extralight drop-shadow-md animate-fade-in" style={{animationDelay: `${index * 150}ms`}}>
                        {line}
                    </p>
                ))}
            </div>
        </main>

        <footer className="pb-8 flex justify-center animate-fade-in-up pointer-events-auto">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handlePlayPause();
            }}
            variant="outline"
            size="icon"
            className="bg-black/20 text-white border-white/80 backdrop-blur-sm rounded-full h-12 w-12 hover:bg-white/20 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1"/>}
          </Button>
        </footer>
      </div>
    </div>
  );
}
