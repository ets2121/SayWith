
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import Image from 'next/image';
import { Slider } from '@/components/ui/slider';

interface Template12Props {
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

const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function Template12({ data }: Template12Props) {
  const { mediaUrl, audioUrl, srtContent, name } = data;
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitles, setSubtitles] = useState<SrtLine[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [userInteracted, setUserInteracted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
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

  const seek = (delta: number) => {
    if (audioRef.current) {
      const newTime = audioRef.current.currentTime + delta;
      audioRef.current.currentTime = Math.max(0, Math.min(newTime, audioRef.current.duration || 0));
    }
  }

  const handleSeek = (value: number[]) => {
    if (audioRef.current && audioRef.current.duration) {
      const newTime = (value[0] / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  }

  useEffect(() => {
    if (srtContent) {
      setSubtitles(parseSrt(srtContent));
    }
  }, [srtContent]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => {
        const currentTime = audio.currentTime;
        const duration = audio.duration;
        if (duration > 0) {
            setProgress((currentTime / duration) * 100);
            setCurrentTime(currentTime);
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
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
        if (audio) {
          audio.removeEventListener('timeupdate', onTimeUpdate);
          audio.removeEventListener('loadedmetadata', onLoadedMetadata);
          audio.removeEventListener('ended', onEnded);
        }
    };
  }, [subtitles, playMedia]);

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 font-sans bg-gradient-to-br from-yellow-200 via-pink-300 to-blue-400 overflow-hidden"
      onClick={handleInitialInteraction}
    >
        <audio ref={audioRef} src={audioUrl} loop playsInline />
        
        <div className="relative w-full max-w-xs flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-2xl">
          <div className="w-full aspect-square rounded-lg overflow-hidden shadow-lg">
              {isVideo ? (
                  <video src={mediaUrl} className="w-full h-full object-cover" muted loop autoPlay playsInline />
              ) : (
                  <Image src={mediaUrl} alt="Album Art" width={300} height={300} className="w-full h-full object-cover" />
              )}
          </div>

          <div className="w-full mt-6 text-center">
              <h3 className="text-2xl font-bold text-gray-800">{name}</h3>
              <div className="text-gray-500 font-light mt-2 h-10 flex items-center justify-center">
                {currentSubtitle.split('\n').map((line, index) => <p key={index} className="text-sm">{line}</p>)}
              </div>
          </div>

          <div className="w-full mt-4">
              <Slider
                  defaultValue={[0]}
                  value={[progress]}
                  onValueChange={handleSeek}
                  max={100}
                  step={1}
                  className="w-full h-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
              </div>
          </div>

          <div className="flex justify-between items-center mt-4 w-full px-4">
              <button onClick={(e) => { e.stopPropagation(); seek(-5); }} className="text-gray-500 hover:text-gray-800 transition-colors" aria-label="Rewind"><SkipBack size={24} /></button>
              <button onClick={handlePlayPause} className="w-16 h-16 rounded-full bg-pink-500 flex justify-center items-center text-white shadow-lg hover:bg-pink-600 transition-all scale-100 hover:scale-105" aria-label="Play/Pause">
                  {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); seek(5); }} className="text-gray-500 hover:text-gray-800 transition-colors" aria-label="Fast Forward"><SkipForward size={24} /></button>
          </div>
        </div>
    </div>
  );
}
