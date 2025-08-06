
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Feather } from 'lucide-react';

interface Template27Props {
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

export default function Template27({ data }: Template27Props) {
  const { mediaUrl, audioUrl, srtContent, name, mute } = data;
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitles, setSubtitles] = useState<SrtLine[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [userInteracted, setUserInteracted] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = mediaUrl?.includes('.mp4') || mediaUrl?.includes('.mov') || mediaUrl?.includes('video');

  const playMedia = useCallback(() => {
    if (!audioRef.current) return;
    const audioPromise = audioRef.current.play();
    const videoPromise = isVideo ? videoRef.current?.play() : Promise.resolve();
    Promise.all([audioPromise, videoPromise]).then(() => {
      setIsPlaying(true);
      setIsRevealed(true);
    }).catch(e => console.error(e));
  }, [isVideo]);

  const handleInitialInteraction = useCallback(() => {
    if (userInteracted) return;
    setUserInteracted(true);
    playMedia();
  }, [userInteracted, playMedia]);

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
      const activeLine = subtitles.find(line => currentTime >= line.startTime && currentTime < line.endTime);
      setCurrentSubtitle(activeLine ? activeLine.text : '');
    };

    const onEnded = () => {
      setIsPlaying(false);
      setIsRevealed(false);
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
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 bg-[#fdf6e3] text-gray-800 overflow-hidden"
      style={{ 
        fontFamily: "'Dancing Script', cursive",
        backgroundImage: 'url(https://www.transparenttextures.com/patterns/old-paper.png)'
      }}
      onClick={!userInteracted ? handleInitialInteraction : undefined}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
      `}</style>
      {isVideo ? (
        <video ref={videoRef} src={mediaUrl} className="absolute inset-0 w-full h-full object-cover filter blur-md opacity-20" muted loop autoPlay playsInline />
      ) : (
        <img src={mediaUrl} alt="background" className="absolute inset-0 w-full h-full object-cover filter blur-md opacity-20" />
      )}
      <audio ref={audioRef} src={audioUrl} />
      
      <div className="relative w-full max-w-2xl h-full flex flex-col items-center justify-center space-y-8 z-10 text-center">

        <div className={`transition-opacity duration-1000 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-5xl font-bold text-gray-700/80">{name}</h1>
          <div className="mt-8 min-h-[150px]">
            {currentSubtitle.split('\n').map((line, index) => (
              <p key={index} className="text-3xl text-gray-600/90 leading-relaxed animate-fade-in" style={{animationDelay: `${index * 200}ms`}}>
                {line}
              </p>
            ))}
          </div>
        </div>
        
        {!isRevealed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in">
              <p className="mb-4 text-2xl" style={{fontFamily: "'Crimson Text', serif"}}>A letter for you from {name}</p>
              <Button
                onClick={handleInitialInteraction}
                variant="outline"
                className="bg-transparent border-gray-400/50 text-gray-600 backdrop-blur-sm rounded-lg h-14 px-8 shadow-sm hover:bg-black/5 hover:border-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <Feather className="mr-3 h-6 w-6" />
                Unseal Letter
              </Button>
          </div>
        )}

      </div>
    </div>
  );
}
