
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

interface Template35Props {
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

export default function Template35({ data }: Template35Props) {
  const { mediaUrl, audioUrl, srtContent, name, mute } = data;
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitles, setSubtitles] = useState<SrtLine[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [userInteracted, setUserInteracted] = useState(false);
  const [progress, setProgress] = useState(0);

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
        playPromise.then(() => setIsPlaying(true)).catch(e => console.error(e));
    }
  }, [useVideoAsAudioSource]);

  const pauseMedia = useCallback(() => {
    videoRef.current?.pause();
    if (!useVideoAsAudioSource) audioRef.current?.pause();
    setIsPlaying(false);
  }, [useVideoAsAudioSource]);

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
      const duration = audioSource.duration;
      if (duration > 0) setProgress((currentTime / duration) * 100);
      const activeLine = subtitles.find(line => currentTime >= line.startTime && currentTime < line.endTime);
      setCurrentSubtitle(activeLine ? activeLine.text : '');
    };

    const onEnded = () => {
      setIsPlaying(false);
      if (audioSource) audioSource.currentTime = 0;
      if (videoRef.current && !useVideoAsAudioSource) videoRef.current.currentTime = 0;
      playMedia();
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
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 bg-black text-white overflow-hidden"
      style={{ fontFamily: "'Anton', sans-serif" }}
      onClick={handleInitialInteraction}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
      `}</style>
      
      {mediaUrl && (
        <>
          {isVideo ? (
            <video ref={videoRef} src={mediaUrl} className="absolute inset-0 w-full h-full object-cover" loop playsInline />
          ) : (
            <Image src={mediaUrl} alt="background" layout="fill" className="absolute inset-0 w-full h-full object-cover" />
          )}
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/80" />
      {audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={audioUrl} loop playsInline/>}
      
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <Play size={80} className="text-white/70" fill="white" />
        </div>
      )}

      <div className="relative w-full h-full flex flex-col justify-between p-4 z-10">
        <div className="w-full">
            <p className="text-lg font-bold tracking-wider">{name}</p>
        </div>

        <div className="w-full text-center flex-grow flex items-center justify-center">
            {currentSubtitle.split('\n').map((line, index) => (
                <p key={index} className="text-6xl md:text-8xl uppercase leading-none tracking-tight text-white drop-shadow-2xl animate-fade-in-up" style={{animationDelay: `${index * 150}ms`}}>
                    {line}
                </p>
            ))}
        </div>
        
        <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
             <div className="h-full bg-white transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
}
