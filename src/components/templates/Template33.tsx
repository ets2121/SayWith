
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Pause, Play } from 'lucide-react';

interface Template33Props {
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

export default function Template33({ data }: Template33Props) {
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

  const handleInitialInteraction = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
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
    >
      {mediaUrl && (
        <>
          {isVideo ? (
            <video ref={videoRef} src={mediaUrl} className="absolute inset-0 w-full h-full object-cover filter blur-md" loop playsInline />
          ) : (
            <Image src={mediaUrl} alt="background" layout="fill" className="absolute inset-0 w-full h-full object-cover filter blur-md" />
          )}
        </>
      )}
       <div className="absolute inset-0 bg-black/40"/>
      {audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={audioUrl} loop playsInline/>}
      
      <div className="relative w-full max-w-sm flex flex-col items-center justify-center space-y-4 animate-fade-in-up">
        <div className="w-full bg-white/10 backdrop-blur-md rounded-lg p-3 flex items-center gap-3">
            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                 {mediaUrl && (
                   <>
                     {isVideo ? (
                        <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" loop playsInline />
                    ) : (
                        <Image src={mediaUrl} alt="Album Art" width={64} height={64} className="w-full h-full object-cover" />
                    )}
                   </>
                 )}
            </div>
            <div className="flex-grow overflow-hidden">
                <p className="text-sm font-bold truncate">{name}</p>
                <p className="text-xs text-white/70 truncate">Saywith</p>
                <div className="w-full h-1 bg-white/30 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-white" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <button onClick={handleInitialInteraction} className="flex-shrink-0">
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
        </div>
        <div className="w-full text-center min-h-[56px]">
            {currentSubtitle.split('\n').map((line, index) => (
                <p key={index} className="text-xl font-medium drop-shadow-md">
                    {line}
                </p>
            ))}
        </div>
      </div>
    </div>
  );
}
