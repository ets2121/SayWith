
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Repeat, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import Image from 'next/image';
import { Slider } from '@/components/ui/slider';

interface Template10Props {
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


const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function Template10({ data }: Template10Props) {
  const { mediaUrl, audioUrl, srtContent, name, mute } = data;
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitles, setSubtitles] = useState<SrtLine[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [userInteracted, setUserInteracted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVideo = mediaUrl?.includes('.mp4') || mediaUrl?.includes('.mov') || mediaUrl?.includes('video');
  const useVideoAsAudioSource = isVideo && mute === false;

  const playMedia = useCallback(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    let playPromise: Promise<void> | undefined;

    if (useVideoAsAudioSource && video) {
      playPromise = video.play();
    } else {
      if(video) video.play();
      if(audio) playPromise = audio.play();
    }
    
    if (playPromise !== undefined) {
      playPromise.then(() => setIsPlaying(true)).catch(e => console.error("Play failed", e));
    } else if (isVideo) {
      setIsPlaying(true);
    }
  }, [useVideoAsAudioSource, isVideo]);

  const pauseMedia = useCallback(() => {
    videoRef.current?.pause();
    if (!useVideoAsAudioSource) audioRef.current?.pause();
    setIsPlaying(false);
  }, [useVideoAsAudioSource]);
  
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

  const seek = (delta: number) => {
    const audioSource = useVideoAsAudioSource ? videoRef.current : audioRef.current;
    if (audioSource) {
      const newTime = audioSource.currentTime + delta;
      audioSource.currentTime = Math.max(0, Math.min(newTime, audioSource.duration || 0));
    }
  }

  const handleSeek = (value: number[]) => {
    const audioSource = useVideoAsAudioSource ? videoRef.current : audioRef.current;
    if (audioSource && audioSource.duration) {
      const newTime = (value[0] / 100) * audioSource.duration;
      audioSource.currentTime = newTime;
      setProgress(value[0]);
    }
  }

  useEffect(() => {
    const video = videoRef.current;
    if(video) {
        video.loop = true;
        video.playsInline = true;
        video.muted = useVideoAsAudioSource ? false : (mute ?? true);
    }
  }, [mute, useVideoAsAudioSource]);

  useEffect(() => {
    if (srtContent) {
      const parsedSubtitles = parseSrt(srtContent);
      setSubtitles(parsedSubtitles);
      setCurrentSubtitle(parsedSubtitles[0]?.text || ''); 
    } else {
        setCurrentSubtitle("Saywith");
    }
  }, [srtContent]);

  useEffect(() => {
    const audioSource = useVideoAsAudioSource ? videoRef.current : audioRef.current;
    if (!audioSource) return;

    const onLoadedMetadata = () => setDuration(audioSource.duration);
    const onTimeUpdate = () => {
        const currentTimeValue = audioSource.currentTime;
        const durationValue = audioSource.duration;
        if (durationValue > 0) {
            setProgress((currentTimeValue / durationValue) * 100);
            setCurrentTime(currentTimeValue);
            setDuration(durationValue);
        }

        const activeLine = subtitles.find(line => currentTimeValue >= line.startTime && currentTimeValue < line.endTime);
        
        if (srtContent) {
          const newSubtitle = activeLine ? activeLine.text : (currentSubtitle || "");
          if (newSubtitle !== currentSubtitle) {
            setCurrentSubtitle(newSubtitle);
          }
        }
    };

    const onEnded = () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        if (audioSource) {
          audioSource.currentTime = 0;
        }
        if (videoRef.current && !useVideoAsAudioSource) {
          videoRef.current.currentTime = 0;
        }
        playMedia(); // Loop
    }
    
    audioSource.addEventListener('timeupdate', onTimeUpdate);
    audioSource.addEventListener('loadedmetadata', onLoadedMetadata);
    audioSource.addEventListener('ended', onEnded);

    return () => {
        if (audioSource) {
          audioSource.removeEventListener('timeupdate', onTimeUpdate);
          audioSource.removeEventListener('loadedmetadata', onLoadedMetadata);
          audioSource.removeEventListener('ended', onEnded);
        }
    };
  }, [subtitles, playMedia, srtContent, currentSubtitle, useVideoAsAudioSource]);

  return (
    <div 
      className="w-full h-screen relative flex flex-col items-center justify-center p-4 font-sans text-white overflow-hidden"
      onClick={handleInitialInteraction}
    >
      {mediaUrl && (
        <>
          {isVideo ? (
            <video ref={videoRef} src={mediaUrl} className="absolute inset-0 w-full h-full object-cover filter blur-lg scale-110" loop playsInline />
          ) : (
            <Image src={mediaUrl} alt="Background" layout="fill" className="absolute inset-0 w-full h-full object-cover filter blur-lg scale-110" />
          )}
        </>
      )}
      
        {audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={audioUrl} loop playsInline />}
        
        <div className="relative w-full max-w-sm h-full flex flex-col items-center justify-between py-12 bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl">
          <div className="w-full text-center">
              <p className="text-xs uppercase text-gray-300">Playing from your library</p>
              <div className="mt-1 h-14 flex items-center justify-center">
                <p className="text-white text-base font-normal">
                  {currentSubtitle.split('\n').map((line, index) => <span key={index} className="block">{line}</span>)}
                </p>
              </div>
          </div>
          
          <div className="w-10/12 aspect-[4/5] max-h-[400px] rounded-lg overflow-hidden shadow-2xl">
              {mediaUrl && (
                <>
                  {isVideo ? (
                      <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" loop playsInline />
                  ) : (
                      <Image src={mediaUrl} alt="Album Art" width={350} height={438} className="w-full h-full object-cover" />
                  )}
                </>
              )}
          </div>

          <div className="w-10/12">
              <div className="w-full text-left">
                  <h3 className="text-2xl font-bold">{name}</h3>
                  <p className="text-base text-gray-300 font-light">Saywith</p>
              </div>

              <div className="w-full mt-4">
                  <Slider
                      defaultValue={[0]}
                      value={[progress]}
                      onValueChange={handleSeek}
                      max={100}
                      step={1}
                      className="w-full h-1"
                  />
                  <div className="flex justify-between text-xs text-gray-300 mt-1">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                  </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                  <button className="text-gray-300 hover:text-white transition-colors" aria-label="Shuffle"><Shuffle size={20} /></button>
                  <button onClick={(e) => { e.stopPropagation(); seek(-5); }} className="text-gray-300 hover:text-white transition-colors" aria-label="Rewind"><SkipBack size={28} /></button>
                  <button onClick={handlePlayPause} className="w-16 h-16 rounded-full bg-white flex justify-center items-center text-black" aria-label="Play/Pause">
                      {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); seek(5); }} className="text-gray-300 hover:text-white transition-colors" aria-label="Fast Forward"><SkipForward size={28} /></button>
                  <button className="text-green-500 hover:text-green-400 transition-colors" aria-label="Repeat"><Repeat size={20} /></button>
              </div>
          </div>
        </div>
    </div>
  );
}
