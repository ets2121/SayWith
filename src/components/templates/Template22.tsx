
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Share2, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { Slider } from '@/components/ui/slider';

interface Template22Props {
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

export default function Template22({ data }: Template22Props) {
  const { mediaUrl, audioUrl, srtContent, name, mute } = data;
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitles, setSubtitles] = useState<SrtLine[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [userInteracted, setUserInteracted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVideo = mediaUrl?.includes('.mp4') || mediaUrl?.includes('.mov') || mediaUrl?.includes('video');
  
  const playMedia = useCallback(() => {
    const audio = audioRef.current;
    const video = videoRef.current;
    if (!audio) return;
    const audioPromise = audio.play();
    const videoPromise = isVideo && video ? video.play() : Promise.resolve();
    
    Promise.all([audioPromise, videoPromise]).then(() => {
      setIsPlaying(true);
    }).catch(error => {
      console.error("Error playing media:", error);
      setIsPlaying(false);
    });
  }, [isVideo]);

  const pauseMedia = useCallback(() => {
    if (audioRef.current) audioRef.current.pause();
    if (videoRef.current) videoRef.current.pause();
    setIsPlaying(false);
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
    if (videoRef.current) {
        videoRef.current.muted = mute ?? true;
    }
  }, [mute]);

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
        if (audio) audio.currentTime = 0;
        if (videoRef.current) videoRef.current.currentTime = 0;
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
  }, [subtitles, playMedia, srtContent, currentSubtitle]);

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 font-sans bg-gradient-to-b from-[#2c2c2c] to-[#121212] text-white overflow-hidden"
      onClick={handleInitialInteraction}
    >
      <audio ref={audioRef} src={audioUrl} loop playsInline />
      
      <div className="relative w-full max-w-sm flex flex-col items-center justify-center space-y-5">
        <div className="w-full aspect-square max-w-[340px] rounded-lg overflow-hidden shadow-2xl">
            {isVideo ? (
                <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" muted loop autoPlay playsInline />
            ) : (
                <Image src={mediaUrl} alt="Album Art" width={340} height={340} className="w-full h-full object-cover" />
            )}
        </div>

        <div className="w-full text-center">
            <h3 className="text-2xl font-bold tracking-tight">{name}</h3>
            <p className="text-base text-gray-400 font-light mt-1">Saywith</p>
        </div>
        
        <div className="w-full text-center text-gray-300 font-normal h-12 flex items-center justify-center">
          <p>
            {currentSubtitle.split('\n').map((line, index) => <span key={index} className="block">{line}</span>)}
          </p>
        </div>

        <div className="w-full">
            <Slider
                defaultValue={[0]}
                value={[progress]}
                onValueChange={handleSeek}
                max={100}
                step={1}
                className="w-full h-1.5"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>

        <div className="flex justify-between items-center w-full px-4">
            <button className="text-gray-400 hover:text-white transition-colors" aria-label="Comment"><MessageSquare size={22} /></button>
            <button onClick={(e) => { e.stopPropagation(); seek(-10); }} className="text-gray-300 hover:text-white transition-colors" aria-label="Rewind"><SkipBack size={30} fill="currentColor" /></button>
            <button onClick={handlePlayPause} className="w-16 h-16 rounded-full bg-blue-500 flex justify-center items-center text-white shadow-lg hover:bg-blue-600 transition-colors" aria-label="Play/Pause">
                {isPlaying ? <Pause size={32} fill="currentColor"/> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); seek(10); }} className="text-gray-300 hover:text-white transition-colors" aria-label="Fast Forward"><SkipForward size={30} fill="currentColor" /></button>
            <button className="text-gray-400 hover:text-white transition-colors" aria-label="Share"><Share2 size={22} /></button>
        </div>
      </div>
    </div>
  );
}
