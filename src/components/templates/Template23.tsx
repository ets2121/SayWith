
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Rewind, FastForward } from 'lucide-react';
import Image from 'next/image';

interface Template23Props {
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

const futuristicFont = "'Orbitron', sans-serif";

export default function Template23({ data }: Template23Props) {
  const { mediaUrl, audioUrl, srtContent, name, mute } = data;
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitles, setSubtitles] = useState<SrtLine[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [userInteracted, setUserInteracted] = useState(false);
  const [progress, setProgress] = useState(0);

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

  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.muted = mute ?? true;
    }
  }, [mute]);

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
      if (videoRef.current) videoRef.current.currentTime = 0;
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

  const glowStyle = {
    textShadow: '0 0 8px rgba(0, 255, 255, 0.7), 0 0 12px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3)',
  };

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 bg-black text-cyan-300 overflow-hidden"
      style={{ fontFamily: futuristicFont, background: 'radial-gradient(circle, #001f3f 0%, #000 70%)' }}
      onClick={handleInitialInteraction}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
      `}</style>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')] opacity-10" />
      <audio ref={audioRef} src={audioUrl} loop playsInline />
      
      <div className="relative w-full max-w-sm flex flex-col items-center justify-center space-y-6 z-10">
        <div 
          className="w-full aspect-square max-w-[320px] rounded-lg overflow-hidden p-1"
          style={{ 
            background: 'rgba(0, 100, 100, 0.1)',
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.3), 0 0 25px rgba(0, 255, 255, 0.2), inset 0 0 10px rgba(0, 255, 255, 0.2)',
            border: '1px solid rgba(0, 255, 255, 0.3)',
          }}
        >
            {isVideo ? (
                <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover rounded-md" muted loop autoPlay playsInline />
            ) : (
                <Image src={mediaUrl} alt="Album Art" width={384} height={384} className="w-full h-full object-cover rounded-md" />
            )}
        </div>

        <div className="w-full text-center">
            <h3 className="text-2xl font-bold tracking-wider" style={glowStyle}>{name}</h3>
            <p className="text-sm text-cyan-400 font-light mt-1 uppercase" style={{...glowStyle, textShadow: glowStyle.textShadow.replace(/255/g, '200')}}>Saywith</p>
        </div>
        
        <div className="w-full text-center text-cyan-300 font-normal h-12 flex items-center justify-center">
          <p style={{ textShadow: '0 0 5px rgba(0, 255, 255, 0.5)'}}>
            {currentSubtitle.split('\n').map((line, index) => <span key={index} className="block">{line}</span>)}
          </p>
        </div>

        <div className="w-full">
            <div className="w-full h-1.5 bg-cyan-900/50 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400" style={{ width: `${progress}%`, boxShadow: '0 0 8px rgba(0, 255, 255, 0.7)' }}></div>
            </div>
        </div>

        <div className="flex justify-evenly items-center w-full px-6">
            <button onClick={(e) => { e.stopPropagation(); seek(-10); }} className="text-cyan-400 hover:text-white transition-all duration-300" style={glowStyle} aria-label="Rewind"><Rewind size={32} /></button>
            <button onClick={handlePlayPause} className="w-16 h-16 rounded-full bg-cyan-400/20 border-2 border-cyan-400 text-cyan-300 flex justify-center items-center shadow-[0_0_15px_rgba(0,255,255,0.5)] hover:bg-cyan-400/40 hover:text-white transition-all duration-300" aria-label="Play/Pause">
                {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); seek(10); }} className="text-cyan-400 hover:text-white transition-all duration-300" style={glowStyle} aria-label="Fast Forward"><FastForward size={32} /></button>
        </div>
      </div>
    </div>
  );
}
