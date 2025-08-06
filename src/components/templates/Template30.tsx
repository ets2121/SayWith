
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Laugh } from 'lucide-react';
import Image from 'next/image';

interface Template30Props {
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

export default function Template30({ data }: Template30Props) {
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
    }).catch(e => console.error(e));
  }, [isVideo]);

  const handleInitialInteraction = useCallback(() => {
    if (userInteracted) return;
    setUserInteracted(true);
    playMedia();
  }, [userInteracted, playMedia]);

  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if(video) {
        video.loop = true;
        video.playsInline = true;
        video.muted = mute ?? true;
        if(audio && !video.muted){
            audio.muted = true;
        }
    }
  }, [mute]);

  useEffect(() => {
    if (srtContent) setSubtitles(parseSrt(srtContent));
  }, [srtContent]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      const currentTime = audio.currentTime;
      const activeLine = subtitles.find(line => currentTime >= line.startTime && currentTime < line.endTime);
      setCurrentSubtitle(activeLine ? activeLine.text : '');
    };

    const onEnded = () => {
      setIsPlaying(false);
      if (audio) audio.currentTime = 0;
      if (videoRef.current) videoRef.current.currentTime = 0;
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
      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      onClick={handleInitialInteraction}
    >
        <style jsx global>{`
            @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
            .brick-wall {
                background-color: #4a2d27;
                background-image: linear-gradient(335deg, #b0492f 23px, transparent 23px),
                                  linear-gradient(155deg, #b0492f 23px, transparent 23px),
                                  linear-gradient(335deg, #b0492f 23px, transparent 23px),
                                  linear-gradient(155deg, #b0492f 23px, transparent 23px);
                background-size: 58px 58px;
                background-position: 0px 2px, 4px 35px, 29px 31px, 34px 6px;
            }
        `}</style>
      <div className="absolute inset-0 brick-wall opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      <audio ref={audioRef} src={audioUrl} />
      
      <div className="relative w-full max-w-lg flex flex-col items-center justify-center space-y-6 z-10 text-center">
        <div className="w-full max-w-sm aspect-video bg-black border-4 border-gray-700 rounded-md p-2 shadow-2xl">
           {mediaUrl && (
             <>
               {isVideo ? (
                    <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" loop playsInline />
                ) : (
                    <Image src={mediaUrl} alt="media" width={400} height={225} className="w-full h-full object-cover" />
                )}
             </>
           )}
        </div>
        <div className="min-h-[80px]">
            {currentSubtitle.split('\n').map((line, index) => (
                <p key={index} className="text-4xl tracking-wider text-yellow-300 drop-shadow-lg animate-fade-in" style={{animationDelay: `${index * 150}ms`}}>
                    {line}
                </p>
            ))}
        </div>

        <div className="flex items-center gap-4 text-white/70">
            <Mic size={32} />
            <h1 className="text-4xl tracking-wider">{name}</h1>
        </div>

        {!isPlaying && !userInteracted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in bg-black/60 backdrop-blur-sm">
              <p className="mb-4 text-2xl tracking-wider">Joke time with {name}!</p>
              <Button
                onClick={handleInitialInteraction}
                className="bg-red-600 text-white rounded-md h-14 px-8 text-xl tracking-wider shadow-lg hover:bg-red-500 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <Laugh className="mr-3 h-6 w-6" />
                Tell Me The Joke
              </Button>
          </div>
        )}
      </div>
    </div>
  );
}
