
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';
import Image from 'next/image';

interface Template14Props {
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

export default function Template14({ data }: Template14Props) {
  const { mediaUrl, audioUrl, srtContent, name, mute } = data;
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitles, setSubtitles] = useState<SrtLine[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [userInteracted, setUserInteracted] = useState(false);
  
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

  useEffect(() => {
    if (srtContent) {
      setSubtitles(parseSrt(srtContent));
    }
  }, [srtContent]);

  useEffect(() => {
    const audio = audioRef.current;
    const video = videoRef.current;
    if(video) {
        video.loop = true;
        video.playsInline = true;
        video.muted = mute ?? true;
        if(audio && !video.muted){
            audio.muted = true;
        }
    }

    if (!audio) return;

    const timeUpdateHandler = () => {
      const currentTime = audio.currentTime;
      const activeLine = subtitles.find(line => currentTime >= line.startTime && currentTime < line.endTime);
      setCurrentSubtitle(activeLine ? activeLine.text : '');
    };

    const handleAudioEnd = () => {
      setIsPlaying(false);
      if (audio) { audio.currentTime = 0; }
      if (videoRef.current) videoRef.current.currentTime = 0;
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
      className="w-full h-screen flex items-center justify-center p-4 bg-[#fdf6e3] font-serif overflow-hidden"
      style={{ fontFamily: "'Caveat', cursive" }}
      onClick={handleInitialInteraction}
    >
      <audio ref={audioRef} src={audioUrl} loop playsInline />
      
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Polaroid container */}
        <div className="bg-white p-4 pb-16 rounded-sm shadow-xl transform -rotate-3">
          <div className="relative w-[300px] h-[300px] bg-gray-200">
            {mediaUrl && (
              <>
                {isVideo ? (
                  <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" loop playsInline />
                ) : (
                  <Image src={mediaUrl} alt="Polaroid" layout="fill" className="w-full h-full object-cover" />
                )}
              </>
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
        <div className="mt-6 text-center w-full">
           <h1 className="text-3xl text-gray-700">{name}</h1>
           <div className="h-16 mt-2">
              {currentSubtitle.split('\n').map((line, index) => (
                <p key={index} className="text-2xl text-gray-500 leading-tight">{line}</p>
              ))}
            </div>
        </div>
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');
      `}</style>
    </div>
  );
}
