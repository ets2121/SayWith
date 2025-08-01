"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Template1Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtUrl: string;
    name: string;
  };
}

interface SrtLine {
  startTime: number;
  endTime: number;
  text: string;
}

const parseSrt = (srtText: string): SrtLine[] => {
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
  const { mediaUrl, audioUrl, srtUrl, name } = data;
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitles, setSubtitles] = useState<SrtLine[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const isVideo = mediaUrl?.includes('.mp4') || mediaUrl?.includes('.mov') || mediaUrl?.includes('video');

  useEffect(() => {
    const fetchSrt = async () => {
      if (!srtUrl) return;
      try {
        const response = await fetch(srtUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const parsedSubtitles = parseSrt(text);
        setSubtitles(parsedSubtitles);
      } catch (error) {
        console.error("Failed to fetch or parse SRT file", error);
        setCurrentSubtitle("Could not load subtitles.");
      }
    };
    fetchSrt();
  }, [srtUrl]);


  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (audio) { // Main control is audio
        if (isPlaying) {
            video?.pause();
            audio.pause();
        } else {
            video?.play().catch(e => console.error("Video play failed", e));
            audio.play().catch(e => console.error("Audio play failed", e));
        }
        setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;

    const handleVisibilityChange = () => {
      if (document.hidden && isPlaying) {
        video?.pause();
        audio?.pause();
        setIsPlaying(false);
      }
    };

    const handleAudioEnd = () => {
        setIsPlaying(false);
        if(video){
            video.currentTime = 0;
            video.pause();
        }
        if(audio){
            audio.currentTime = 0;
        }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    audio?.addEventListener('ended', handleAudioEnd);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      audio?.removeEventListener('ended', handleAudioEnd);
    };
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !subtitles.length) return;

    const timeUpdateHandler = () => {
        const currentTime = audio.currentTime;
        const activeLine = subtitles.find(line => currentTime >= line.startTime && currentTime < line.endTime);
        setCurrentSubtitle(activeLine ? activeLine.text : '');
    };

    audio.addEventListener('timeupdate', timeUpdateHandler);
    return () => {
        audio.removeEventListener('timeupdate', timeUpdateHandler);
    };
  }, [subtitles, isPlaying]);

  return (
    <div className="relative h-screen w-screen overflow-hidden font-sans">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-10" />
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
      <audio ref={audioRef} src={audioUrl} />

      <div className="relative z-20 flex flex-col h-full text-white">
        <header className="text-center pt-8">
          <p className="text-lg font-light tracking-wider">{name}</p>
          <p className="font-headline text-xl font-bold text-gray-200">Saywith</p>
        </header>

        <main className="flex-grow flex items-center justify-center">
            <div className="text-center px-4">
                {currentSubtitle.split('\n').map((line, index) => (
                    <p key={index} className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold drop-shadow-lg animate-fade-in" style={{animationDelay: `${index * 150}ms`}}>
                        {line}
                    </p>
                ))}
            </div>
        </main>

        <footer className="pb-8 flex justify-center">
          <Button
            onClick={handlePlayPause}
            variant="outline"
            size="icon"
            className="bg-transparent text-white border-white rounded-full h-16 w-16 hover:bg-white/20"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1"/>}
          </Button>
        </footer>
      </div>
    </div>
  );
}
