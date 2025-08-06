
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';
import Image from 'next/image';

interface Template24Props {
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

export default function Template24({ data }: Template24Props) {
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
      if (duration > 0) setProgress(currentTime / duration);
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

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 bg-[#0a0f1e] text-gray-200 overflow-hidden"
      style={{ fontFamily: "'Exo 2', sans-serif" }}
      onClick={handleInitialInteraction}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;700&display=swap');
        .orbital-progress {
          stroke-dasharray: 1068; /* circumference of circle with r=170 */
          stroke-dashoffset: ${1068 * (1 - progress)};
          transition: stroke-dashoffset 0.1s linear;
        }
      `}</style>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
      <audio ref={audioRef} src={audioUrl} loop playsInline />
      
      <div className="relative w-full max-w-sm flex flex-col items-center justify-center space-y-8 z-10">

        <div className="w-full text-center">
            <h3 className="text-3xl font-bold tracking-wider text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{name}</h3>
            <p className="text-lg text-gray-400 font-light mt-1">Saywith</p>
        </div>
        
        <div className="relative w-[300px] h-[300px] flex items-center justify-center">
            {/* Progress Ring */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 360">
                <circle cx="180" cy="180" r="170" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
                <circle cx="180" cy="180" r="170" stroke="url(#gradient)" strokeWidth="8" fill="none" strokeLinecap="round"
                    className="orbital-progress"
                    transform="rotate(-90 180 180)"
                />
                 <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Media Orb */}
            <div 
              className="relative w-[280px] h-[280px] rounded-full overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.4),_inset_0_0_20px_rgba(0,0,0,0.5)]"
              onClick={handlePlayPause}
              >
              {isVideo ? (
                  <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" muted loop autoPlay playsInline />
              ) : (
                  <Image src={mediaUrl} alt="Album Art" layout="fill" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  {isPlaying ? <Pause size={60} /> : <Play size={60} className="ml-2" />}
              </div>
            </div>
        </div>
        
        <div className="w-full text-center text-gray-300 font-light h-12 flex items-center justify-center">
          <p>
            {currentSubtitle.split('\n').map((line, index) => <span key={index} className="block">{line}</span>)}
          </p>
        </div>
      </div>
    </div>
  );
}
