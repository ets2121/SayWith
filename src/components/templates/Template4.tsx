
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Rewind, FastForward, Pause, Play } from 'lucide-react';
import Image from 'next/image';

interface Template4Props {
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

export default function Template4({ data }: Template4Props) {
  const { mediaUrl, audioUrl, srtContent, name } = data;
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitles, setSubtitles] = useState<SrtLine[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [userInteracted, setUserInteracted] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVideo = mediaUrl?.includes('.mp4') || mediaUrl?.includes('.mov') || mediaUrl?.includes('video');

  useEffect(() => {
    if (srtContent) {
        try {
            const parsedSubtitles = parseSrt(srtContent);
            setSubtitles(parsedSubtitles);
        } catch (error) {
            console.error("Failed to parse SRT data", error);
        }
    } else {
        setCurrentSubtitle("YOU ARE MY FAVORITE SONG");
    }
  }, [srtContent]);

  const playMedia = useCallback(() => {
    if (!audioRef.current) return;
    
    const audioPromise = audioRef.current.play();
    const videoPromise = isVideo ? videoRef.current?.play() : Promise.resolve();
    
    if (audioPromise !== undefined) {
      Promise.all([audioPromise, videoPromise]).then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error("Error playing media:", error);
        setIsPlaying(false);
      });
    }
  }, [isVideo]);

  const pauseMedia = useCallback(() => {
    audioRef.current?.pause();
    if (isVideo) videoRef.current?.pause();
    setIsPlaying(false);
  }, [isVideo]);

  const handlePlayPause = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      pauseMedia();
    } else {
      playMedia();
    }
  }, [isPlaying, playMedia, pauseMedia]);

  const handleInitialInteraction = useCallback(() => {
    if (userInteracted) return;
    setUserInteracted(true);
    playMedia();
  }, [userInteracted, playMedia]);

  const seek = (delta: number) => {
    if (audioRef.current) {
        audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime + delta);
    }
  }

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.play().catch(e => console.log("Video autoplay blocked"));
    }
  }, [videoRef, isVideo]);


  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const timeUpdateHandler = () => {
        const currentTime = audio.currentTime;
        const duration = audio.duration;
        
        if(duration > 0) {
            setProgress((currentTime / duration) * 100);
        }
        
        if (srtContent) {
            const activeLine = subtitles.find(line => currentTime >= line.startTime && currentTime < line.endTime);
            const newSubtitle = activeLine ? activeLine.text : '';
             if (newSubtitle !== currentSubtitle) {
              setCurrentSubtitle(newSubtitle);
            }
        }
    };
    
    const handleAudioEnd = () => {
        setIsPlaying(false);
        setProgress(0);
        if (audio) audio.currentTime = 0;
        if (!srtContent) setCurrentSubtitle("YOU ARE MY FAVORITE SONG");
    }

    audio.addEventListener('timeupdate', timeUpdateHandler);
    audio.addEventListener('ended', handleAudioEnd);

    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', timeUpdateHandler);
        audio.removeEventListener('ended', handleAudioEnd);
      }
    };
  }, [subtitles, srtContent, currentSubtitle]);

  return (
    <div 
      className="w-full h-full bg-gradient-to-b from-[#FFF5E1] to-[#FFDAB9] flex flex-col items-center justify-center font-['Montserrat']"
      onClick={handleInitialInteraction}
    >
        <div className="w-[400px] h-[600px] bg-gradient-to-b from-[#FFF5E1] to-[#FFDAB9] flex flex-col items-center">
            <audio ref={audioRef} src={audioUrl} />

            <div className="mt-5 text-2xl font-bold text-black w-full text-center">{name}</div>
            
            <div className="mt-10 w-[350px] h-[300px] rounded-lg overflow-hidden">
                {isVideo ? (
                    <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                ) : (
                    <Image src={mediaUrl} alt="background" width={350} height={300} className="w-full h-full object-cover" />
                )}
            </div>

            <div className="mt-[30px] text-3xl font-bold text-black w-full text-center h-16 flex items-center justify-center">
                <div className="h-full">
                  {currentSubtitle.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                  ))}
                </div>
            </div>

            <div className="mt-5 w-[120px]">
                <div className="relative w-[120px] h-0.5">
                    <div className="w-full h-full bg-black"></div>
                    <div 
                        className="absolute top-[-3px] w-2 h-2 rounded-full bg-black"
                        style={{ left: `${progress}%`}}
                    ></div>
                </div>
                <div className="flex justify-center gap-5 mt-2.5">
                    <div className="h-10 flex items-center">
                        <button onClick={(e) => { e.stopPropagation(); seek(-5); }} className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[20px] border-r-black" aria-label="Rewind"></button>
                    </div>
                    <button onClick={handlePlayPause} className="w-10 h-10 rounded-full bg-black flex justify-center items-center text-white" aria-label="Play/Pause">
                        {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                    </button>
                    <div className="h-10 flex items-center">
                        <button onClick={(e) => { e.stopPropagation(); seek(5); }} className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[20px] border-l-black" aria-label="Fast Forward"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
