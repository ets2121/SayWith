
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Power } from 'lucide-react';
import Image from 'next/image';

interface Template25Props {
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

export default function Template25({ data }: Template25Props) {
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
    Promise.all([audioPromise, videoPromise]).then(() => setIsPlaying(true)).catch(e => console.error(e));
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
    if (!userInteracted) handleInitialInteraction();
    else if (isPlaying) pauseMedia();
    else playMedia();
  }, [isPlaying, playMedia, pauseMedia, userInteracted, handleInitialInteraction]);
  
  const seek = (delta: number) => {
    if (audioRef.current) {
      const newTime = audioRef.current.currentTime + delta;
      audioRef.current.currentTime = Math.max(0, Math.min(newTime, audioRef.current.duration || 0));
    }
  }

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = mute ?? true;
  }, [mute]);

  useEffect(() => {
    if (srtContent) setSubtitles(parseSrt(srtContent));
  }, [srtContent]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
      if (duration > 0) setProgress((currentTime / duration) * 100);
      const activeLine = subtitles.find(line => currentTime >= line.startTime && currentTime < line.endTime);
      setCurrentSubtitle(activeLine ? activeLine.text : '');
    };

    const onEnded = () => {
      setIsPlaying(false);
      if (audio) audio.currentTime = 0;
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

  const GlitchText = ({ text }: { text: string }) => (
    <div className="glitch-text" data-text={text}>
      {text}
    </div>
  );

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 bg-black text-[#f0f] overflow-hidden"
      style={{ fontFamily: "'Share Tech Mono', monospace" }}
      onClick={handleInitialInteraction}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        .glitch-text {
          position: relative;
          text-shadow: 0.05em 0 0 #0ff, -0.025em -0.05em 0 #ff0, 0.025em 0.05em 0 #0f0;
          animation: glitch 500ms infinite;
        }

        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0.8;
        }

        .glitch-text::before {
          animation: glitch 650ms infinite;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          transform: translate(-0.05em, -0.025em);
          color: #0ff;
        }

        .glitch-text::after {
          animation: glitch 350ms infinite;
          clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
          transform: translate(0.05em, 0.025em);
          color: #ff0;
        }

        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-0.05em, 0.05em); }
          40% { transform: translate(-0.05em, -0.05em); }
          60% { transform: translate(0.05em, 0.05em); }
          80% { transform: translate(0.05em, -0.05em); }
          100% { transform: translate(0); }
        }
      `}</style>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] opacity-5" />
      <audio ref={audioRef} src={audioUrl} loop playsInline />
      
      <div className="relative w-full max-w-md flex flex-col items-center justify-center space-y-4 z-10 border-2 border-cyan-400/50 bg-black/50 p-6 shadow-[0_0_20px_#0ff]">
        <div className="w-full flex justify-between items-center">
            <h3 className="text-2xl font-bold tracking-widest"><GlitchText text={name} /></h3>
            <Power size={24} className="text-red-500 animate-pulse" />
        </div>
        
        <div className="w-full aspect-video relative overflow-hidden p-1 bg-cyan-900/30 border border-cyan-400/50">
          {isVideo ? (
            <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" muted loop autoPlay playsInline />
          ) : (
            <Image src={mediaUrl} alt="Album Art" layout="fill" className="w-full h-full object-cover" />
          )}
        </div>

        <div className="w-full text-center text-cyan-300 font-normal h-12 flex items-center justify-center border-y border-cyan-400/50 py-2">
          <p>
            {currentSubtitle.split('\n').map((line, index) => <span key={index} className="block">{line}</span>)}
          </p>
        </div>

        <div className="w-full">
            <div className="w-full h-1 bg-fuchsia-900/50">
                <div className="h-full bg-fuchsia-500" style={{ width: `${progress}%`, boxShadow: '0 0 8px #f0f' }}></div>
            </div>
        </div>

        <div className="flex justify-evenly items-center w-full">
            <button onClick={(e) => { e.stopPropagation(); seek(-10); }} className="text-cyan-400 hover:text-white transition-colors" aria-label="Rewind"><SkipBack size={32} /></button>
            <button onClick={handlePlayPause} className="w-14 h-14 border-2 border-fuchsia-500 text-fuchsia-500 flex justify-center items-center shadow-[0_0_15px_#f0f] hover:bg-fuchsia-500/40 hover:text-white transition-colors" aria-label="Play/Pause">
                {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); seek(10); }} className="text-cyan-400 hover:text-white transition-colors" aria-label="Fast Forward"><SkipForward size={32} /></button>
        </div>
      </div>
    </div>
  );
}
