
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface Template28Props {
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

export default function Template28({ data }: Template28Props) {
  const { mediaUrl, audioUrl, srtContent, name, mute } = data;
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitles, setSubtitles] = useState<SrtLine[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [userInteracted, setUserInteracted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = mediaUrl?.includes('.mp4') || mediaUrl?.includes('.mov') || mediaUrl?.includes('video');
  const useVideoAsAudioSource = isVideo && mute === false;

  const playMedia = useCallback(() => {
    const audio = audioRef.current;
    const video = videoRef.current;
    let playPromise: Promise<void> | undefined;

    if (useVideoAsAudioSource && video) {
        playPromise = video.play();
    } else {
        if (video) video.play();
        if (audio) playPromise = audio.play();
    }

    if(playPromise){
        playPromise.then(() => {
        setIsPlaying(true);
        }).catch(e => console.error(e));
    }
  }, [useVideoAsAudioSource]);

  const handleInitialInteraction = useCallback(() => {
    if (userInteracted) return;
    setUserInteracted(true);
    playMedia();
  }, [userInteracted, playMedia]);

  useEffect(() => {
    const video = videoRef.current;
    if(video) {
        video.loop = true;
        video.playsInline = true;
        video.muted = useVideoAsAudioSource ? false : (mute ?? true);
    }
  }, [mute, useVideoAsAudioSource]);

  useEffect(() => {
    if (srtContent) setSubtitles(parseSrt(srtContent));
  }, [srtContent]);

  useEffect(() => {
    const audioSource = useVideoAsAudioSource ? videoRef.current : audioRef.current;
    if (!audioSource) return;

    const onTimeUpdate = () => {
      const currentTime = audioSource.currentTime;
      const activeLine = subtitles.find(line => currentTime >= line.startTime && currentTime < line.endTime);
      setCurrentSubtitle(activeLine ? activeLine.text : '');
    };

    const onEnded = () => {
      setIsPlaying(false);
      if (audioSource) audioSource.currentTime = 0;
      if (videoRef.current && !useVideoAsAudioSource) videoRef.current.currentTime = 0;
    }
    
    audioSource.addEventListener('timeupdate', onTimeUpdate);
    audioSource.addEventListener('ended', onEnded);

    return () => {
      if (audioSource) {
        audioSource.removeEventListener('timeupdate', onTimeUpdate);
        audioSource.removeEventListener('ended', onEnded);
      }
    };
  }, [subtitles, playMedia, useVideoAsAudioSource]);

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 bg-slate-800 text-white overflow-hidden"
      onClick={handleInitialInteraction}
    >
        <style jsx global>{`
        .rain-effect::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: url(https://www.transparenttextures.com/patterns/subtle-zebra-3d.png);
            background-size: auto;
            animation: rain 0.4s linear infinite;
            opacity: 0.2;
            pointer-events: none;
        }
        @keyframes rain {
            0% { background-position: 0% 0%; }
            100% { background-position: 20% 20%; }
        }
        `}</style>
      {mediaUrl && (
        <>
          {isVideo ? (
            <video ref={videoRef} src={mediaUrl} className="absolute inset-0 w-full h-full object-cover filter grayscale" loop playsInline />
          ) : (
            <img src={mediaUrl} alt="background" className="absolute inset-0 w-full h-full object-cover filter grayscale" />
          )}
        </>
      )}
      <div className="absolute inset-0 bg-black/50 rain-effect" />
      {audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={audioUrl} />}
      
      <div className="relative w-full max-w-2xl h-full flex flex-col items-center justify-center space-y-8 z-10 text-center">

        <div className="min-h-[150px]">
            {currentSubtitle.split('\n').map((line, index) => (
              <p key={index} className="text-3xl font-light leading-relaxed animate-fade-in" style={{animationDelay: `${index * 300}ms`}}>
                {line}
              </p>
            ))}
        </div>
        
        {!isPlaying && !userInteracted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in">
              <p className="mb-4 text-lg">A message from {name}</p>
              <Button
                onClick={handleInitialInteraction}
                variant="outline"
                size="icon"
                className="bg-black/10 text-white border-white/50 backdrop-blur-sm rounded-full h-16 w-16 hover:bg-white/10 transition-all duration-300"
              >
                <Play className="h-6 w-6 ml-1" />
              </Button>
          </div>
        )}
      </div>
    </div>
  );
}
