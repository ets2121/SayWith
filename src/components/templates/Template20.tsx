
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { ThumbsDown, ThumbsUp, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import Image from 'next/image';
import { Slider } from '@/components/ui/slider';

interface Template20Props {
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


const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function Template20({ data }: Template20Props) {
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
      const parsedSubtitles = parseSrt(srtContent);
      setSubtitles(parsedSubtitles);
      setCurrentSubtitle(parsedSubtitles[0]?.text || ''); 
    } else {
        setCurrentSubtitle("Saywith");
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
            setDuration(duration);
        }

        const activeLine = subtitles.find(line => currentTime >= line.startTime && currentTime < line.endTime);
        
        if (srtContent) {
          const newSubtitle = activeLine ? activeLine.text : (currentSubtitle || "");
          if (newSubtitle !== currentSubtitle) {
            setCurrentSubtitle(newSubtitle);
          }
        }
    };

    const onEnded = () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        if (audio) {
          audio.currentTime = 0;
        }
        playMedia(); // Loop
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
  }, [subtitles, playMedia, srtContent, currentSubtitle]);

  const neonColor = 'text-cyan-400';
  const neonShadow = 'drop-shadow-[0_0_8px_rgba(0,255,255,0.7)]';
  const neonSliderThumb = "bg-cyan-400 border-cyan-300";
  const neonSliderTrack = "bg-cyan-400/30";
  const neonSliderRange = "bg-cyan-400";

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 font-sans text-white overflow-hidden bg-[#0a0a0a]"
      onClick={handleInitialInteraction}
    >
      {isVideo ? (
        <video src={mediaUrl} className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-125 opacity-30" muted loop autoPlay playsInline />
      ) : (
        <Image src={mediaUrl} alt="Background" layout="fill" className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-125 opacity-30" />
      )}
      
      <audio ref={audioRef} src={audioUrl} loop playsInline />
      
      <div className="relative w-full max-w-md h-full flex flex-col items-center justify-center py-8">
        <div className={`w-full aspect-square max-h-[350px] rounded-lg overflow-hidden shadow-2xl ${neonShadow}`}>
            {isVideo ? (
                <video src={mediaUrl} className="w-full h-full object-cover" muted loop autoPlay playsInline />
            ) : (
                <Image src={mediaUrl} alt="Album Art" width={384} height={384} className="w-full h-full object-cover" />
            )}
        </div>

        <div className="w-full mt-6 text-center">
            <h3 className={`text-2xl font-bold tracking-tight ${neonColor} ${neonShadow}`}>{name}</h3>
            <p className="text-base text-gray-300 font-light mt-1">Saywith</p>
            <div className="text-gray-300 font-light mt-2 h-10 flex items-center justify-center">
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
                className="w-full h-1.5"
                classNames={{
                    track: neonSliderTrack,
                    range: neonSliderRange,
                    thumb: neonSliderThumb
                }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>

        <div className="flex justify-between items-center mt-4 w-full px-2">
            <button className={`text-gray-400 hover:${neonColor} transition-colors`} aria-label="Dislike"><ThumbsDown size={24} /></button>
            <button onClick={(e) => { e.stopPropagation(); seek(-10); }} className={`text-gray-400 hover:${neonColor} transition-colors`} aria-label="Rewind"><SkipBack size={32} /></button>
            <button onClick={handlePlayPause} className={`w-20 h-20 rounded-full bg-cyan-400/20 border border-cyan-400 flex justify-center items-center ${neonColor} ${neonShadow}`} aria-label="Play/Pause">
                {isPlaying ? <Pause size={48} /> : <Play size={48} className="ml-1" />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); seek(10); }} className={`text-gray-400 hover:${neonColor} transition-colors`} aria-label="Fast Forward"><SkipForward size={32} /></button>
            <button className={`text-gray-400 hover:${neonColor} transition-colors`} aria-label="Like"><ThumbsUp size={24} /></button>
        </div>
      </div>
    </div>
  );
}
