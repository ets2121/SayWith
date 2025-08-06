
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

interface Template32Props {
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

export default function Template32({ data }: Template32Props) {
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
      onClick={handleInitialInteraction}
    >
       {mediaUrl && (
         <>
           {isVideo ? (
            <video ref={videoRef} src={mediaUrl} className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-110" loop playsInline />
          ) : (
            <Image src={mediaUrl} alt="background" layout="fill" className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-110" />
          )}
         </>
       )}
      {audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={audioUrl} loop playsInline/>}
      
      <div className="relative w-full max-w-sm h-4/5 flex flex-col justify-center items-center">
        <div className="relative w-full h-full">
            {mediaUrl && (
              <>
                {isVideo ? (
                    <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover rounded-2xl shadow-2xl" loop playsInline />
                ) : (
                    <Image src={mediaUrl} alt="background" layout="fill" className="w-full h-full object-cover rounded-2xl shadow-2xl" />
                )}
              </>
            )}
             {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl pointer-events-none">
                    <Play size={64} className="text-white/80" fill="white"/>
                </div>
            )}
        </div>


        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-4/5 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-1 rounded-2xl shadow-lg transform rotate-[-5deg]">
          <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                    {mediaUrl && <Image src={mediaUrl} alt="avatar" width={24} height={24} className="w-full h-full object-cover"/>}
                </div>
                <p className="text-xs font-bold">{name}</p>
            </div>
            <div className="min-h-[48px] text-center">
                {currentSubtitle.split('\n').map((line, index) => (
                    <p key={index} className="text-lg font-bold animate-fade-in">
                        {line}
                    </p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
