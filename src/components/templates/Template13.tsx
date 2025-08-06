
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';
import Image from 'next/image';

interface Template13Props {
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

export default function Template13({ data }: Template13Props) {
  const { mediaUrl, audioUrl, srtContent, name } = data;
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitles, setSubtitles] = useState<SrtLine[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [userInteracted, setUserInteracted] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const isVideo = mediaUrl?.includes('.mp4') || mediaUrl?.includes('.mov') || mediaUrl?.includes('video');

  const playMedia = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error("Play failed", e));
  }, []);

  const pauseMedia = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);
  
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
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
        const currentTime = audio.currentTime;
        const duration = audio.duration;
        if (duration > 0) {
            setProgress((currentTime / duration) * 100);
        }
        const activeLine = subtitles.find(line => currentTime >= line.startTime && currentTime < line.endTime);
        setCurrentSubtitle(activeLine ? activeLine.text : '');
    };

    const onEnded = () => {
        setIsPlaying(false);
        if (audio) { audio.currentTime = 0; }
        playMedia();
    }
    
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', onTimeUpdate);
        audio.removeEventListener('ended', onEnded);
      }
    };
  }, [subtitles, playMedia]);

  return (
    <div 
      className="w-full h-screen relative flex items-center justify-center p-4 md:p-8 font-sans bg-[#f4f4f0] text-gray-800 overflow-hidden"
      onClick={handleInitialInteraction}
    >
      <audio ref={audioRef} src={audioUrl} loop playsInline />
      
      <div className="w-full max-w-4xl h-full md:h-auto md:max-h-[600px] flex flex-col md:flex-row items-center gap-8">
        {/* Media Player */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden rounded-lg shadow-xl">
          {isVideo ? (
            <video src={mediaUrl} className="w-full h-full object-cover" muted loop autoPlay playsInline />
          ) : (
            <Image src={mediaUrl} alt="Album Art" layout="fill" className="w-full h-full object-cover" />
          )}
           <div 
                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300"
                onClick={handlePlayPause}
            >
                <button className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm text-white flex items-center justify-center" aria-label="Play/Pause">
                    {isPlaying ? <Pause size={40} /> : <Play size={40} className="ml-2" />}
                </button>
            </div>
        </div>

        {/* Text and Controls */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-between items-start text-left py-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">{name}</h1>
            <p className="text-lg text-gray-500 mt-2">Saywith</p>
          </div>
          
          <div className="w-full my-8">
            <div className="h-16 text-left">
              {currentSubtitle.split('\n').map((line, index) => (
                <p key={index} className="text-xl font-light italic text-gray-600">{line}</p>
              ))}
            </div>
          </div>
          
          <div className="w-full">
             <div className="w-full h-1 bg-gray-300 rounded-full">
                <div className="h-1 bg-gray-800 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
