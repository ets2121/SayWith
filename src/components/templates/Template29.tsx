
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import Image from 'next/image';

interface Template29Props {
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

export default function Template29({ data }: Template29Props) {
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
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 bg-gray-900 text-white overflow-hidden"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
      onClick={handleInitialInteraction}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-orange-500 opacity-80" />
      {audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={audioUrl} />}
      
      <div className="relative w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-8 z-10">
        <div className="w-full md:w-1/2 aspect-video max-w-md">
           {mediaUrl && (
             <>
               {isVideo ? (
                    <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover rounded-lg shadow-2xl" loop playsInline />
                ) : (
                    <Image src={mediaUrl} alt="background" width={600} height={400} className="w-full h-full object-cover rounded-lg shadow-2xl" />
                )}
             </>
           )}
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-lg font-semibold tracking-widest uppercase text-white/80">{name}</h2>
            <div className="min-h-[120px] mt-4">
                {currentSubtitle.split('\n').map((line, index) => (
                    <p key={index} className="text-4xl lg:text-5xl font-extrabold !leading-tight animate-fade-in-up" style={{animationDelay: `${index * 150}ms`}}>
                        {line}
                    </p>
                ))}
            </div>
        </div>

      </div>

        {!isPlaying && !userInteracted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in bg-black/30 backdrop-blur-sm">
              <p className="mb-4 text-lg font-semibold">A motivational message from {name}</p>
              <Button
                onClick={handleInitialInteraction}
                className="bg-yellow-400 text-gray-900 rounded-full h-16 px-8 text-lg font-bold shadow-lg hover:bg-yellow-300 transition-all duration-300 ease-in-out transform hover:scale-110"
              >
                <Zap className="mr-3 h-6 w-6" />
                Get Motivated
              </Button>
          </div>
        )}
    </div>
  );
}
