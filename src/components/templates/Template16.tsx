
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import Image from 'next/image';

interface Template16Props {
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

export default function Template16({ data }: Template16Props) {
  const { mediaUrl, audioUrl, srtContent, name, mute } = data;
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitles, setSubtitles] = useState<SrtLine[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [userInteracted, setUserInteracted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = mediaUrl?.includes('.mp4') || mediaUrl?.includes('.mov') || mediaUrl?.includes('video');

  const playMedia = useCallback(() => {
    if (!audioRef.current) return;
    const audioPromise = audioRef.current.play();
    const videoPromise = isVideo ? videoRef.current?.play() : Promise.resolve();
    
    Promise.all([audioPromise, videoPromise]).then(() => {
      setIsPlaying(true);
    }).catch(error => {
      console.error("Error playing media:", error);
      setIsPlaying(false);
    });
  }, [isVideo]);

  const pauseMedia = useCallback(() => {
    audioRef.current?.pause();
    if (isVideo) videoRef.current?.pause();
    setIsPlaying(false);
  }, [isVideo]);

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
    
    if (videoRef.current) {
        videoRef.current.muted = mute ?? false;
        videoRef.current.loop = true;
        videoRef.current.autoplay = true;
    }

    const timeUpdateHandler = () => {
      const currentTime = audio.currentTime;
      const activeLine = subtitles.find(line => currentTime >= line.startTime && currentTime < line.endTime);
      setCurrentSubtitle(activeLine ? activeLine.text : '');
    };

    const handleAudioEnd = () => {
      setIsPlaying(false);
      if (audio) { audio.currentTime = 0; }
      playMedia();
    }

    audio.addEventListener('timeupdate', timeUpdateHandler);
    audio.addEventListener('ended', handleAudioEnd);

    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', timeUpdateHandler);
        audio.removeEventListener('ended', handleAudioEnd);
      }
    };
  }, [subtitles, playMedia, mute]);

  return (
    <div 
      className="w-full h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-100 to-pink-200"
      style={{ fontFamily: "'Great Vibes', cursive" }}
      onClick={handleInitialInteraction}
    >
      <audio ref={audioRef} src={audioUrl} loop playsInline />
      
      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-sm shadow-2xl rounded-lg flex flex-col md:flex-row items-center p-6">
        
        {/* Media Container */}
        <div className="w-full md:w-1/2 p-2 border-4 border-white rounded-md shadow-lg">
            <div className="relative w-full aspect-square">
                {isVideo ? (
                <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover rounded" muted loop autoPlay playsInline />
                ) : (
                <Image src={mediaUrl} alt="Romantic Memory" layout="fill" className="w-full h-full object-cover rounded" />
                )}
                <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    onClick={handlePlayPause}
                >
                    <button className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm text-white flex items-center justify-center" aria-label="Play/Pause">
                        {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                    </button>
                </div>
            </div>
        </div>
        
        {/* Text Area */}
        <div className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-8 text-center md:text-left">
           <h1 className="text-5xl text-rose-800/80">{name}</h1>
           <div className="h-24 mt-4 text-3xl text-rose-600/70 leading-snug flex items-center justify-center md:justify-start">
              <div className="w-full">
                {currentSubtitle.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
              </div>
            </div>
            <div className="mt-4 flex justify-center md:justify-end items-center gap-2 text-rose-400">
                <p className="font-sans text-xs">With Love</p>
                <Heart size={16} className="fill-current" />
            </div>
        </div>
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
      `}</style>
    </div>
  );
}
