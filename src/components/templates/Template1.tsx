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

  const playMedia = useCallback(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (audio) {
      const audioPromise = audio.play();
      if (audioPromise !== undefined) {
        audioPromise.then(() => setIsPlaying(true)).catch(e => {
            console.error("Audio play failed", e);
            setIsPlaying(false);
        });
      }
    }
    if (video) {
        const videoPromise = video.play();
        if (videoPromise !== undefined) {
            videoPromise.catch(e => console.error("Video play failed", e));
        }
    }
  }, []);

  const pauseMedia = useCallback(() => {
    videoRef.current?.pause();
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

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
            // Muted autoplay is usually allowed
            if (videoRef.current) videoRef.current.muted = true;
            if (audioRef.current) audioRef.current.muted = true;

            if (videoRef.current) await videoRef.current.play();
            if (audioRef.current) await audioRef.current.play();
            
            // Unmute after a short delay
            setTimeout(() => {
                if (videoRef.current) videoRef.current.muted = false;
                if (audioRef.current) audioRef.current.muted = false;
                userHasInteracted.current = true;
                setIsPlaying(true);
            }, 100);

        } catch (error) {
            console.log("Autoplay was prevented. Waiting for user interaction.");
            setIsPlaying(false);
        }
    };

    tryAutoplay();
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [playMedia, pauseMedia, isPlaying]);

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

    audio.addEventListener('timeupdate', timeUpdateHandler);
    return () => {
        if (audio) {
          audio.removeEventListener('timeupdate', timeUpdateHandler);
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
          <p className="text-sm font-extralight tracking-wider">{name}</p>
          <p className="font-headline text-base font-semibold text-gray-200">Saywith</p>
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
