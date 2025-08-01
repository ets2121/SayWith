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
  const { mediaUrl, audioUrl, srtContent, name } = data;
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitles, setSubtitles] = useState<SrtLine[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const userHasInteracted = useRef(false);

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

  const playMedia = useCallback(async () => {
    try {
      await audioRef.current?.play();
      if(isVideo) await videoRef.current?.play();
      setIsPlaying(true);
    } catch (e) {
      console.error("Media play failed", e);
      setIsPlaying(false); // If play fails, set state to paused
    }
  }, [isVideo]);

  const pauseMedia = useCallback(() => {
    audioRef.current?.pause();
    if(isVideo) videoRef.current?.pause();
    setIsPlaying(false);
  }, [isVideo]);

  const handlePlayPause = useCallback(() => {
    userHasInteracted.current = true;
    if (isPlaying) {
      pauseMedia();
    } else {
      playMedia();
    }
  }, [isPlaying, playMedia, pauseMedia]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isPlaying) {
            pauseMedia();
        }
      } else {
        if (userHasInteracted.current && !isPlaying) {
            playMedia();
        }
      }
    };
    
    const tryAutoplay = async () => {
        try {
            if (audioRef.current) audioRef.current.muted = true;
            if (videoRef.current) videoRef.current.muted = true;

            await playMedia();
            
            setTimeout(() => {
                if (audioRef.current) audioRef.current.muted = false;
                if (videoRef.current) videoRef.current.muted = false;
                userHasInteracted.current = true;
            }, 100);

        } catch (error) {
            console.log("Autoplay was prevented. Waiting for user interaction.");
            pauseMedia(); // Ensure we are in a paused state if autoplay fails
        }
    };

    // Only try to autoplay once on mount.
    // The play/pause button will handle user interaction after that.
    tryAutoplay();
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playMedia, pauseMedia]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !subtitles.length) return;

    const timeUpdateHandler = () => {
        const currentTime = audio.currentTime;
        const activeLine = subtitles.find(line => currentTime >= line.startTime && currentTime < line.endTime);
        
        const newSubtitle = activeLine ? activeLine.text : '';

        if (newSubtitle !== currentSubtitle) {
            setCurrentSubtitle(newSubtitle);
        }
    };

    const handleAudioEnd = () => {
        setCurrentSubtitle('');
    }

    audio.addEventListener('timeupdate', timeUpdateHandler);
    audio.addEventListener('ended', handleAudioEnd);

    return () => {
        if (audio) {
          audio.removeEventListener('timeupdate', timeUpdateHandler);
          audio.removeEventListener('ended', handleAudioEnd);
        }
    };
  }, [subtitles, currentSubtitle]);

  return (
    <div className="relative h-screen w-screen overflow-hidden font-sans">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-10" />
      {isVideo ? (
        <video
          ref={videoRef}
          src={mediaUrl}
          loop
          muted
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

      <div className="relative z-20 flex flex-col h-full text-white">
        <header className="text-center pt-8 animate-fade-in-down">
          <p className="text-xs font-extralight tracking-wider opacity-90">{name}</p>
          <p className="font-headline text-sm font-semibold text-gray-200/90">Saywith</p>
        </header>

        <main className="flex-grow flex items-center justify-center">
            <div className="text-center px-4">
                {currentSubtitle.split('\n').map((line, index) => (
                    <p key={`${currentSubtitle}-${index}`} className="text-2xl md:text-3xl font-serif font-light drop-shadow-md animate-fade-in" style={{animationDelay: `${index * 150}ms`}}>
                        {line}
                    </p>
                ))}
            </div>
        </main>

        <footer className="pb-8 flex justify-center animate-fade-in-up">
          <Button
            onClick={handlePlayPause}
            variant="outline"
            size="icon"
            className="bg-transparent text-white border-white/80 rounded-full h-12 w-12 hover:bg-white/20 transition-all duration-300 ease-in-out transform hover:scale-110"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1"/>}
          </Button>
        </footer>
      </div>
    </div>
  );
}
