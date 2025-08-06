
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface Template31Props {
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

export default function Template31({ data }: Template31Props) {
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
    if (!audioRef.current) return;
    const audioPromise = audioRef.current.play();
    const videoPromise = isVideo ? videoRef.current?.play() : Promise.resolve();
    Promise.all([audioPromise, videoPromise]).then(() => setIsPlaying(true)).catch(e => console.error(e));
  }, [isVideo]);

  const pauseMedia = useCallback(() => {
    audioRef.current?.pause();
    if (isVideo) videoRef.current?.pause();
    setIsPlaying(false);
  }, [isVideo]);

  const handleInitialInteraction = useCallback(() => {
    if (userInteracted) {
        if (isPlaying) pauseMedia();
        else playMedia();
    } else {
        setUserInteracted(true);
        playMedia();
    }
  }, [userInteracted, playMedia, isPlaying, pauseMedia]);
  
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

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 bg-black text-white overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
      onClick={handleInitialInteraction}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
      `}</style>
      
      {isVideo ? (
        <video ref={videoRef} src={mediaUrl} className="absolute inset-0 w-full h-full object-cover" muted loop autoPlay playsInline />
      ) : (
        <Image src={mediaUrl} alt="background" layout="fill" className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-black/20" />
      <audio ref={audioRef} src={audioUrl} loop playsInline/>
      
      <div className="relative w-full h-full flex flex-col justify-between p-4 z-10">
        <div className="w-full">
            <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex items-center gap-2 mt-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image src={mediaUrl} alt="avatar" width={32} height={32} className="w-full h-full object-cover"/>
                </div>
                <p className="text-sm font-bold">{name}</p>
                <p className="text-sm text-white/70">Saywith</p>
            </div>
        </div>

        <div className="w-full text-center">
            {currentSubtitle.split('\n').map((line, index) => (
                <p key={index} className="text-2xl font-bold bg-black/40 backdrop-blur-sm px-4 py-2 rounded-md inline animate-fade-in" style={{animationDelay: `${index * 150}ms`, WebkitBoxDecorationBreak: 'clone'}}>
                    {line}
                </p>
            ))}
        </div>
        
        <div className="w-full h-12" />
      </div>
    </div>
  );
}
